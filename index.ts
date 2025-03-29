#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { runAppleScript } from 'run-applescript';
import { run } from '@jxa/run';

// Define the ChatGPT tool
const CHATGPT_TOOL: Tool = {
  name: "chatgpt",
  description: "Interact with the ChatGPT desktop app on macOS",
  inputSchema: {
    type: "object",
    properties: {
      operation: {
        type: "string",
        description: "Operation to perform: 'ask' or 'get_conversations'",
        enum: ["ask", "get_conversations"]
      },
      prompt: {
        type: "string",
        description: "The prompt to send to ChatGPT (required for ask operation)"
      },
      conversation_id: {
        type: "string",
        description: "Optional conversation ID to continue a specific conversation"
      },
      time_to_wait: {
        type: "number",
        description: "Time in seconds to wait before retrieving the response (0-3600). If 0, no response is retrieved. Defaults to 6.",
        minimum: 0,
        maximum: 3600,
        default: 6
      }
    },
    required: ["operation"]
  }
};

const server = new Server(
  {
    name: "ChatGPT MCP Tool",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Check if ChatGPT app is installed and running
async function checkChatGPTAccess(): Promise<boolean> {
  try {
    const isRunning = await runAppleScript(`
      tell application "System Events"
        return application process "ChatGPT" exists
      end tell
    `);

    if (isRunning !== "true") {
      console.log("ChatGPT app is not running, attempting to launch...");
      try {
        await runAppleScript(`
          tell application "ChatGPT" to activate
          delay 2
        `);
      } catch (activateError) {
        console.error("Error activating ChatGPT app:", activateError);
        throw new Error("Could not activate ChatGPT app. Please start it manually.");
      }
    }
    
    return true;
  } catch (error) {
    console.error("ChatGPT access check failed:", error);
    throw new Error(
      `Cannot access ChatGPT app. Please make sure ChatGPT is installed and properly configured. Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// Function to send a prompt to ChatGPT
async function askChatGPT(prompt: string, conversationId?: string, time_to_wait: number = 6): Promise<string> {
  await checkChatGPTAccess();

  // Ensure time_to_wait is within bounds, default handled by caller but good to double check
  const waitSeconds = Math.max(0, Math.min(time_to_wait, 3600));

  try {
    // This is a simplistic approach - actual implementation may need to be more sophisticated
    const script = `
      tell application "ChatGPT"
        activate
        delay 1
        
        tell application "System Events"
          tell process "ChatGPT"
            ${conversationId ? `
            -- Try to find and click the specified conversation
            try
              click button "${conversationId}" of group 1 of group 1 of window 1
              delay 1
            end try
            ` : ''}
            
            -- Type in the prompt
            keystroke "${prompt.replace(/"/g, '\\"')}"
            delay 0.5
            keystroke return

            ${waitSeconds > 0 ? `
            delay ${waitSeconds} -- Wait for response based on parameter

            -- Try to get the response (this is approximate and may need adjustments)
            set responseText to ""
            try
              set responseText to value of text area 2 of group 1 of group 1 of window 1
            on error
              set responseText to "Could not retrieve the response from ChatGPT after waiting ${waitSeconds}s."
            end try
            return responseText
            ` : `
            -- time_to_wait is 0, do not wait or retrieve response
            return "Prompt sent. Response retrieval skipped (time_to_wait was 0)."
            `}
          end tell
        end tell
      end tell
    `;

    const result = await runAppleScript(script);

    // If time_to_wait was 0, AppleScript returns the specific message.
    // Otherwise, it returns the retrieved text or an error message.
    return result;
  } catch (error) {
    console.error("Error interacting with ChatGPT:", error);
    throw new Error(`Failed to get response from ChatGPT: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Function to get available conversations
async function getConversations(): Promise<string[]> {
  await checkChatGPTAccess();
  
  try {
    const result = await runAppleScript(`
      tell application "ChatGPT"
        activate
        delay 1
        
        tell application "System Events"
          tell process "ChatGPT"
            -- Try to get conversation titles
            set conversationsList to {}
            
            try
              set chatButtons to buttons of group 1 of group 1 of window 1
              repeat with chatButton in chatButtons
                set buttonName to name of chatButton
                if buttonName is not "New chat" then
                  set end of conversationsList to buttonName
                end if
              end repeat
            on error
              set conversationsList to {"Unable to retrieve conversations"}
            end try
            
            return conversationsList
          end tell
        end tell
      end tell
    `);
    
    // Parse the AppleScript result into an array
    const conversations = result.split(", ");
    return conversations;
  } catch (error) {
    console.error("Error getting ChatGPT conversations:", error);
    return ["Error retrieving conversations"];
  }
}

function isChatGPTArgs(args: unknown): args is {
  operation: "ask" | "get_conversations";
  prompt?: string;
  conversation_id?: string;
  time_to_wait?: number | string; // Allow string for potential conversion
} {
  if (typeof args !== "object" || args === null) return false;

  const { operation, prompt, conversation_id, time_to_wait } = args as any;
  
  if (!operation || !["ask", "get_conversations"].includes(operation)) {
    return false;
  }
  
  // Validate required fields based on operation
  if (operation === "ask" && !prompt) return false;
  
  // Validate field types if present
  if (prompt && typeof prompt !== "string") return false;
  if (conversation_id && typeof conversation_id !== "string") return false;
  if (time_to_wait !== undefined) {
    const waitNum = Number(time_to_wait);
    if (isNaN(waitNum) || waitNum < 0 || waitNum > 3600) {
      console.error(`Invalid time_to_wait: ${time_to_wait}. Must be a number between 0 and 3600.`);
      return false;
    }
  }

  return true;
}

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [CHATGPT_TOOL],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    if (!args) {
      throw new Error("No arguments provided");
    }

    if (name === "chatgpt") {
      if (!isChatGPTArgs(args)) {
        throw new Error("Invalid arguments for ChatGPT tool");
      }

      switch (args.operation) {
        case "ask": {
          if (!args.prompt) {
            throw new Error("Prompt is required for ask operation");
          }

          // Validate and get time_to_wait, applying default if necessary
          let waitTime = 6; // Default value
          if (args.time_to_wait !== undefined) {
             const parsedWait = Number(args.time_to_wait);
             // Use validated number if valid and within range, otherwise stick to default
             if (!isNaN(parsedWait) && parsedWait >= 0 && parsedWait <= 3600) {
               waitTime = parsedWait;
             } else {
               console.warn(`Invalid time_to_wait value '${args.time_to_wait}' received. Using default ${waitTime}s.`);
             }
          }

          const response = await askChatGPT(args.prompt, args.conversation_id, waitTime);

          return {
            content: [{
              type: "text",
              text: response // askChatGPT now returns confirmation or response/error
            }],
            isError: false
          };
        }

        case "get_conversations": {
          const conversations = await getConversations();
          
          return {
            content: [{ 
              type: "text", 
              text: conversations.length > 0 ? 
                `Found ${conversations.length} conversation(s):\n\n${conversations.join("\n")}` :
                "No conversations found in ChatGPT."
            }],
            isError: false
          };
        }

        default:
          throw new Error(`Unknown operation: ${args.operation}`);
      }
    }

    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
      isError: true,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("ChatGPT MCP Server running on stdio");
