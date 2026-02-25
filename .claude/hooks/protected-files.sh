#!/bin/bash
# Block edits to protected files
# PreToolUse hook for Edit|Write tools

FILE_PATH=$(jq -r '.tool_input.file_path // ""')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Protected file patterns
PROTECTED_PATTERNS=(
  ".env"
  ".env.local"
  ".env.production"
  ".env.prod"
  ".env.development"
  "secrets/"
  "credentials/"
  ".pem"
  ".key"
  "id_rsa"
  "serviceAccountKey.json"
  "firebase-adminsdk"
  # [PROJECT: Add your protected files here]
  # "config/production.json"
  # "deploy/"
)

for PATTERN in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$PATTERN"* ]]; then
    echo "{\"hookSpecificOutput\": {\"permissionDecision\": \"deny\", \"permissionDecisionReason\": \"Protected file: $PATTERN. This file contains sensitive data and should not be modified by Claude Code.\"}}"
    exit 0
  fi
done

exit 0
