#!/bin/bash
# Visual-only notification on file writes/edits (no sound)
# PostToolUse hook for Write|Edit tools

TOOL_NAME=$(jq -r '.tool_name // "Unknown"')
FILE_PATH=$(jq -r '.tool_input.file_path // ""')

if [ -n "$FILE_PATH" ]; then
  FILENAME=$(basename "$FILE_PATH")
  if command -v osascript &>/dev/null; then
    osascript -e "display notification \"$FILENAME\" with title \"Claude: $TOOL_NAME\"" 2>/dev/null
  elif command -v notify-send &>/dev/null; then
    notify-send "Claude: $TOOL_NAME" "$FILENAME" 2>/dev/null
  fi
fi

exit 0
