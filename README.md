# ChatGPT MCP Server

An MCP (Model Context Protocol) server providing a tool to interact with the ChatGPT macOS desktop application.

## Overview

This server exposes a single tool, `chatgpt`, designed to allow MCP clients (e.g., Cline, Claude Desktop, Cursor) to send prompts to and retrieve conversation lists from the native ChatGPT application on macOS.

## Problem Solved

AI models interacting via MCP often need to leverage the capabilities or context within specific desktop applications like ChatGPT. Directly controlling the application allows the AI to continue existing conversations, ask new questions within the user's established ChatGPT environment, or query the conversation history without manual copy-pasting or context switching by the user.

## Solution: The `chatgpt` Tool

This server provides the `chatgpt` tool with the following operations:

*   **Operation:** `ask`
    *   **Description:** Sends a prompt to the ChatGPT application. Can optionally continue an existing conversation.
    *   **Input Parameters:**
        *   `prompt` (string, required): The text prompt to send.
        *   `conversation_id` (string, optional): The title/ID of an existing conversation to continue. If omitted, uses the currently active chat.
        *   `time_to_wait` (number, optional, default: 6): The time in seconds (0-3600) to wait after sending the prompt before attempting to retrieve the response text from the ChatGPT window.
            *   If `time_to_wait > 0`: The tool waits for the specified duration and then returns the text content found in the main response area of the ChatGPT window.
            *   If `time_to_wait == 0`: The tool sends the prompt and immediately returns a confirmation message ("Prompt sent. Response retrieval skipped (time_to_wait was 0).") without waiting or attempting to read the response.

*   **Operation:** `get_conversations`
    *   **Description:** Retrieves the list of conversation titles from the ChatGPT application's sidebar.
    *   **Input Parameters:** None.
    *   **Output:** Returns a text list of the found conversation titles.

## Use Cases

*   **Continue Existing Chats:** "Using ChatGPT, continue the conversation titled 'Project Planning Q3' and ask 'What were the key deadlines we discussed?'"
*   **Quick Queries:** "Ask ChatGPT: 'What is the capital of France?' Wait 10 seconds for the response."
*   **Contextual Interaction:** "Get my ChatGPT conversations list. Then, ask ChatGPT to summarize the conversation titled 'Latest Market Research'."
*   **Fire-and-Forget Prompts:** "Ask ChatGPT: 'Generate 5 ideas for blog posts about AI ethics.' Set time_to_wait to 0."

## Installation & Setup

**Requirements:**
*   macOS operating system.
*   The official ChatGPT desktop application installed.
*   Node.js and Bun installed (`bun` is used to run the script).

### Step 1: Clone the Repository

Clone your fork of the repository to a location on your Mac:
```bash
# Replace '199-bio' with your GitHub username if different
git clone https://github.com/199-bio/claude-chatgpt-mcp.git /path/to/your/desired/location
cd /path/to/your/desired/location/claude-chatgpt-mcp
bun install
```
Replace `/path/to/your/desired/location` with the actual path where you want to store the server code (e.g., `~/Documents/MCP-Servers`). **Remember this path for the next step.**

### Step 2: Configure Your MCP Client

Add the following JSON block within the `"mcpServers": {}` object in your client's configuration file. Choose the file corresponding to your client and operating system:

**Configuration Block:**
```json
"chatgpt-mac": {
  "command": "bun",
  "args": ["run", "/path/to/your/cloned/repo/claude-chatgpt-mcp/index.ts"],
  "env": {},
  "disabled": false,
  "autoApprove": []
}
```
**IMPORTANT:** Replace `/path/to/your/cloned/repo/claude-chatgpt-mcp` in the `"args"` array with the **full, absolute path** to the directory where you cloned the repository in Step 1.

**Client Configuration File Locations:**
*   **Claude Desktop:**
    *   macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
    *   Windows: `%APPDATA%\Claude\claude_desktop_config.json`
    *   Linux: `~/.config/Claude/claude_desktop_config.json` *(Path may vary slightly)*
*   **VS Code Extension (Cline / "Claude Code"):**
    *   macOS: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
    *   Windows: `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
    *   Linux: `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
*   **Cursor:**
    *   Global: `~/.cursor/mcp.json`
    *   Project-Specific: Create a file at `.cursor/mcp.json` within your project folder.
*   **Windsurf:**
    *   `~/.codeium/windsurf/mcp_config.json`
*   **Other Clients:**
    *   Consult the specific client's documentation for the location of its MCP configuration file. The JSON structure shown in the "Configuration Block" above should generally work.

### Step 3: Restart Client

After adding the configuration block and saving the file, **fully restart** your MCP client application for the changes to take effect. The server will now run directly from your cloned repository using `bun`.

## Usage Example

Once installed and enabled, you can instruct your MCP client:
```
"Ask ChatGPT 'Explain quantum entanglement simply' and wait 15 seconds for the response."
```
The client's AI model should recognize the intent and call the `chatgpt` tool with `operation: "ask"`, the `prompt`, and `time_to_wait: 15`.

Or to get conversations:
```
"Get my ChatGPT conversation list."
```

## Developed By

This tool was adapted and modified by Boris Djordjevic based on the original work by Syed Azhar (https://github.com/syedazharmbnr1/claude-chatgpt-mcp).

Further development inspired by initiatives at [199 Longevity](https://www.199.company), a group focused on extending the frontiers of human health and longevity. Learn more about our work in biotechnology at [199.bio](https://www.199.bio).

Project contributor: Boris Djordjevic

## License

This project is licensed under the MIT License.
