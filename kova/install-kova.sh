#!/bin/bash
# install-kova.sh
# Run this from the ROOT of any project to install the Kova protocol.
#
# Usage:
#   cd /path/to/kova && bash install-kova.sh /path/to/project
#   OR from project root: bash /path/to/kova/install-kova.sh
#   Add --dry-run to preview what would be installed without making changes
#
# What it does:
#   1. Creates .claude/ directory structure
#   2. Copies all hooks (including shared lib), commands, and settings
#   3. Makes hooks executable
#   4. Creates CLAUDE.md if one doesn't exist

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="$(pwd)"
DRY_RUN=false

# Parse flags
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
  esac
done

if $DRY_RUN; then
  echo "DRY RUN — showing what would be installed into: $TARGET_DIR"
  echo ""
  echo "Directories to create:"
  echo "  $TARGET_DIR/.claude/commands/"
  echo "  $TARGET_DIR/.claude/hooks/"
  echo "  $TARGET_DIR/.claude/hooks/lib/"
  echo "  $TARGET_DIR/.claude/commands/kova/"
  echo ""
  echo "Files to copy:"
  echo "  settings.json"
  echo "  hooks/format.sh"
  echo "  hooks/verify-on-stop.sh"
  echo "  hooks/block-dangerous.sh"
  echo "  hooks/protect-files.sh"
  echo "  hooks/kova-loop.sh"
  echo "  hooks/lib/detect-stack.sh"
  echo "  hooks/lib/parse-prd.sh"
  echo "  hooks/lib/verify-gate.sh"
  echo "  hooks/lib/parse-failures.sh"
  echo "  hooks/lib/generate-prompt.sh"
  echo "  hooks/lib/run-code-review.sh"
  echo "  commands/commit-push-pr.md"
  echo "  commands/verify-app.md"
  echo "  commands/daily-standup.md"
  echo "  commands/fix-and-verify.md"
  echo "  commands/code-review.md"
  echo "  commands/plan.md"
  echo "  commands/simplify.md"
  echo "  commands/kova/init.md"
  echo "  commands/kova/loop.md"
  echo "  commands/kova/help.md"
  echo "  commands/kova/status.md"
  echo "  commands/kova/activate.md"
  echo "  commands/kova/deactivate.md"
  echo "  commands/kova/install.md"
  if [ -f "$TARGET_DIR/CLAUDE.md" ]; then
    echo "  CLAUDE.md -> CLAUDE.kova.md (existing CLAUDE.md preserved)"
  else
    echo "  CLAUDE.md"
  fi
  echo ""
  echo "No changes made. Remove --dry-run to install."
  exit 0
fi

echo "Installing Kova Protocol into: $TARGET_DIR"
echo ""

# Create directories
mkdir -p "$TARGET_DIR/.claude/commands/kova"
mkdir -p "$TARGET_DIR/.claude/hooks/lib"

# Copy settings (backup if exists)
if [ -f "$TARGET_DIR/.claude/settings.json" ]; then
  echo "  .claude/settings.json already exists. Backing up to settings.json.bak"
  cp "$TARGET_DIR/.claude/settings.json" "$TARGET_DIR/.claude/settings.json.bak"
fi
cp "$SCRIPT_DIR/.claude/settings.json" "$TARGET_DIR/.claude/settings.json"
echo "  settings.json installed"

# Copy hooks
cp "$SCRIPT_DIR/.claude/hooks/format.sh"          "$TARGET_DIR/.claude/hooks/"
cp "$SCRIPT_DIR/.claude/hooks/verify-on-stop.sh"  "$TARGET_DIR/.claude/hooks/"
cp "$SCRIPT_DIR/.claude/hooks/block-dangerous.sh" "$TARGET_DIR/.claude/hooks/"
cp "$SCRIPT_DIR/.claude/hooks/protect-files.sh"   "$TARGET_DIR/.claude/hooks/"
cp "$SCRIPT_DIR/.claude/hooks/kova-loop.sh"  "$TARGET_DIR/.claude/hooks/"

# Copy shared library
cp "$SCRIPT_DIR/.claude/hooks/lib/detect-stack.sh"      "$TARGET_DIR/.claude/hooks/lib/"
cp "$SCRIPT_DIR/.claude/hooks/lib/parse-prd.sh"         "$TARGET_DIR/.claude/hooks/lib/"
cp "$SCRIPT_DIR/.claude/hooks/lib/verify-gate.sh"       "$TARGET_DIR/.claude/hooks/lib/"
cp "$SCRIPT_DIR/.claude/hooks/lib/parse-failures.sh"    "$TARGET_DIR/.claude/hooks/lib/"
cp "$SCRIPT_DIR/.claude/hooks/lib/generate-prompt.sh"   "$TARGET_DIR/.claude/hooks/lib/"
cp "$SCRIPT_DIR/.claude/hooks/lib/run-code-review.sh"   "$TARGET_DIR/.claude/hooks/lib/"

# Make hooks executable
chmod +x "$TARGET_DIR/.claude/hooks/"*.sh
chmod +x "$TARGET_DIR/.claude/hooks/lib/"*.sh
echo "  Hooks installed and made executable"

# Copy slash commands
cp "$SCRIPT_DIR/.claude/commands/commit-push-pr.md" "$TARGET_DIR/.claude/commands/"
cp "$SCRIPT_DIR/.claude/commands/verify-app.md"     "$TARGET_DIR/.claude/commands/"
cp "$SCRIPT_DIR/.claude/commands/daily-standup.md"  "$TARGET_DIR/.claude/commands/"
cp "$SCRIPT_DIR/.claude/commands/fix-and-verify.md" "$TARGET_DIR/.claude/commands/"
cp "$SCRIPT_DIR/.claude/commands/code-review.md"    "$TARGET_DIR/.claude/commands/"
cp "$SCRIPT_DIR/.claude/commands/plan.md"           "$TARGET_DIR/.claude/commands/"
cp "$SCRIPT_DIR/.claude/commands/simplify.md"       "$TARGET_DIR/.claude/commands/"

# Copy kova commands
cp "$SCRIPT_DIR/.claude/commands/kova/init.md"       "$TARGET_DIR/.claude/commands/kova/"
cp "$SCRIPT_DIR/.claude/commands/kova/loop.md"       "$TARGET_DIR/.claude/commands/kova/"
cp "$SCRIPT_DIR/.claude/commands/kova/help.md"       "$TARGET_DIR/.claude/commands/kova/"
cp "$SCRIPT_DIR/.claude/commands/kova/status.md"     "$TARGET_DIR/.claude/commands/kova/"
cp "$SCRIPT_DIR/.claude/commands/kova/activate.md"   "$TARGET_DIR/.claude/commands/kova/"
cp "$SCRIPT_DIR/.claude/commands/kova/deactivate.md" "$TARGET_DIR/.claude/commands/kova/"
cp "$SCRIPT_DIR/.claude/commands/kova/install.md"    "$TARGET_DIR/.claude/commands/kova/"
echo "  Slash commands installed (including kova commands)"

# Copy CLAUDE.md only if one doesn't exist
if [ -f "$TARGET_DIR/CLAUDE.md" ]; then
  echo "  CLAUDE.md already exists. Not overwriting. Kova additions saved to CLAUDE.kova.md"
  cp "$SCRIPT_DIR/CLAUDE.md" "$TARGET_DIR/CLAUDE.kova.md"
  echo "   -> Manually merge CLAUDE.kova.md into your CLAUDE.md"
else
  cp "$SCRIPT_DIR/CLAUDE.md" "$TARGET_DIR/CLAUDE.md"
  echo "  CLAUDE.md installed"
fi

# Check for jq (required for hooks)
if ! command -v jq &>/dev/null; then
  echo ""
  echo "  WARNING: 'jq' is not installed. Hooks require jq to work."
  echo "   Install it:"
  echo "   macOS:  brew install jq"
  echo "   Ubuntu: sudo apt-get install jq"
  echo "   Fedora: sudo dnf install jq"
  echo "   Arch:   sudo pacman -S jq"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Kova Protocol installed!"
echo ""
echo "Available slash commands:"
echo "  /plan           -> Plan before coding"
echo "  /verify-app     -> Full QA sweep"
echo "  /commit-push-pr -> Auto commit + push + PR"
echo "  /fix-and-verify -> Debug and fix failing tests"
echo "  /code-review    -> Multi-agent code review"
echo "  /simplify       -> Clean up code after feature"
echo "  /daily-standup  -> CEO-level project report"
echo ""
echo "  /kova:loop  -> Smart Loop: implement PRD items with verify + review"
echo "  /kova:help  -> See all Kova commands"
echo ""
echo "Hooks active:"
echo "  PostToolUse -> auto-format on every file write"
echo "  Stop        -> auto-run tests when Claude finishes"
echo "  PreToolUse  -> block dangerous commands + protect sensitive files"
echo ""
echo "Supported ecosystems: Node.js, Python, Go, Rust, Ruby, Java, .NET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
