#!/bin/bash
# Auto-setup development environment variables based on detected stack
# SessionStart hook

if [ -z "$CLAUDE_ENV_FILE" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || true

# Node.js / JavaScript / TypeScript
if [ -f "package.json" ]; then
  echo 'export NODE_ENV=development' >> "$CLAUDE_ENV_FILE"
fi

# Python
if [ -f "pyproject.toml" ] || [ -f "requirements.txt" ] || [ -f "setup.py" ] || [ -f "Pipfile" ]; then
  echo 'export PYTHONDONTWRITEBYTECODE=1' >> "$CLAUDE_ENV_FILE"
fi

# Go
if [ -f "go.mod" ]; then
  echo 'export CGO_ENABLED=0' >> "$CLAUDE_ENV_FILE"
fi

# Rust
if [ -f "Cargo.toml" ]; then
  echo 'export RUST_BACKTRACE=1' >> "$CLAUDE_ENV_FILE"
fi

# [PROJECT: Uncomment and customize for your framework]
# echo 'export PRISMA_HIDE_UPDATE_MESSAGE=1' >> "$CLAUDE_ENV_FILE"
# echo 'export NEXT_TELEMETRY_DISABLED=1' >> "$CLAUDE_ENV_FILE"
# echo 'export DJANGO_SETTINGS_MODULE=config.settings.dev' >> "$CLAUDE_ENV_FILE"
# echo 'export FLASK_ENV=development' >> "$CLAUDE_ENV_FILE"

exit 0
