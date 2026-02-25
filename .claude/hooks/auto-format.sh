#!/bin/bash
# Auto-format files after Write|Edit tool use
# PostToolUse hook for Write|Edit tools

FILE_PATH=$(jq -r '.tool_input.file_path // ""')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Get file extension
EXT="${FILE_PATH##*.}"

case "$EXT" in
  ts|tsx|js|jsx|mjs|cjs|css|scss|html|md|yaml|yml)
    # Format with Prettier if available
    if command -v prettier &> /dev/null; then
      prettier --write "$FILE_PATH" 2>/dev/null || true
    elif [ -f "${CLAUDE_PROJECT_DIR:-$(pwd)}/node_modules/.bin/prettier" ]; then
      "${CLAUDE_PROJECT_DIR:-$(pwd)}/node_modules/.bin/prettier" --write "$FILE_PATH" 2>/dev/null || true
    elif command -v npx &> /dev/null && [ -f "node_modules/.bin/prettier" ]; then
      npx prettier --write "$FILE_PATH" 2>/dev/null || true
    fi
    ;;
  py)
    # Format with Ruff (preferred) or Black as fallback
    if command -v ruff &> /dev/null; then
      ruff format "$FILE_PATH" 2>/dev/null || true
    elif command -v black &> /dev/null; then
      black --quiet "$FILE_PATH" 2>/dev/null || true
    fi
    # Sort imports with isort if available
    if command -v isort &> /dev/null; then
      isort "$FILE_PATH" 2>/dev/null || true
    fi
    ;;
  go)
    # Format with gofmt
    if command -v gofmt &> /dev/null; then
      gofmt -w "$FILE_PATH" 2>/dev/null || true
    fi
    ;;
  rs)
    # Format with rustfmt
    if command -v rustfmt &> /dev/null; then
      rustfmt "$FILE_PATH" 2>/dev/null || true
    fi
    ;;
  rb)
    # Format with RuboCop
    if command -v rubocop &> /dev/null; then
      rubocop -a --fail-level error "$FILE_PATH" 2>/dev/null || true
    fi
    ;;
  java)
    # Format with google-java-format
    if command -v google-java-format &> /dev/null; then
      google-java-format -i "$FILE_PATH" 2>/dev/null || true
    fi
    ;;
  cs)
    # Format with dotnet format
    if command -v dotnet &> /dev/null; then
      dotnet format --include "$FILE_PATH" 2>/dev/null || true
    fi
    ;;
  toml)
    # Format with taplo
    if command -v taplo &> /dev/null; then
      taplo format "$FILE_PATH" 2>/dev/null || true
    fi
    ;;
  json)
    # Format JSON with jq
    if command -v jq &> /dev/null; then
      TMP=$(jq '.' "$FILE_PATH" 2>/dev/null) && echo "$TMP" > "$FILE_PATH" || true
    fi
    ;;
esac

exit 0
