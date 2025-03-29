# diagnose_chatgpt_ui.applescript
# This script attempts to find the main response text area in the ChatGPT app
# by trying common UI element paths.

set appName to "ChatGPT"
set outputLog to "ChatGPT UI Diagnostic Report:\n"

# Ensure ChatGPT is running
try
	tell application "System Events"
		if not (application process appName exists) then
			set outputLog to outputLog & "Error: ChatGPT application process not found. Please ensure it is running.\n"
			return outputLog
		end if
	end tell
	tell application appName to activate
	delay 1
on error errMsg
	set outputLog to outputLog & "Error activating ChatGPT: " & errMsg & "\n"
	return outputLog
end try

# --- Test Common UI Paths ---
tell application "System Events"
	tell process appName
		try
			set mainWindow to window 1
			
			# Path 1: text area 1 of group 1 of group 1
			set path1 to "text area 1 of group 1 of group 1 of window 1"
			try
				set text1 to value of text area 1 of group 1 of group 1 of mainWindow
				set outputLog to outputLog & "Success [" & path1 & "]: Found text (first 50 chars): " & (text 1 thru 50 of text1) & "\n"
			on error err1
				set outputLog to outputLog & "Failed [" & path1 & "]: " & err1 & "\n"
			end try
			
			# Path 2: text area 2 of group 1 of group 1
			set path2 to "text area 2 of group 1 of group 1 of window 1"
			try
				set text2 to value of text area 2 of group 1 of group 1 of mainWindow
				set outputLog to outputLog & "Success [" & path2 & "]: Found text (first 50 chars): " & (text 1 thru 50 of text2) & "\n"
			on error err2
				set outputLog to outputLog & "Failed [" & path2 & "]: " & err2 & "\n"
			end try
			
			# Path 3: text area 1 of scroll area 1 of group 1
			# (Hypothesizing a scroll area might contain the text area)
			set path3 to "text area 1 of scroll area 1 of group 1 of window 1"
			try
				set text3 to value of text area 1 of scroll area 1 of group 1 of mainWindow
				set outputLog to outputLog & "Success [" & path3 & "]: Found text (first 50 chars): " & (text 1 thru 50 of text3) & "\n"
			on error err3
				set outputLog to outputLog & "Failed [" & path3 & "]: " & err3 & "\n"
			end try
			
			# Path 4: text area 1 of group 1 (Simpler structure)
			set path4 to "text area 1 of group 1 of window 1"
			try
				set text4 to value of text area 1 of group 1 of mainWindow
				set outputLog to outputLog & "Success [" & path4 & "]: Found text (first 50 chars): " & (text 1 thru 50 of text4) & "\n"
			on error err4
				set outputLog to outputLog & "Failed [" & path4 & "]: " & err4 & "\n"
			end try
			
		on error errWin
			set outputLog to outputLog & "Error accessing ChatGPT window or process: " & errWin & "\n"
		end try
	end tell
end tell

return outputLog
