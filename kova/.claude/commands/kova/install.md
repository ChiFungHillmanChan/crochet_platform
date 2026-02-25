# /kova:install
# Show instructions for installing Kova into another project.

Print the following guide to the user:

---

## Install Kova into a Project

### Option 1: Kova Installer (recommended)

```bash
cd /path/to/your/project
bash /path/to/kova/install-kova.sh
```

Preview first without making changes:
```bash
bash /path/to/kova/install-kova.sh --dry-run
```

### Option 2: Copy the .claude/ directory

```bash
cp -r /path/to/template/.claude/ /path/to/your/project/.claude/
```

Then customize `.claude/CLAUDE.md` — fill in the `[PROJECT: ...]` placeholders.

### Option 3: Cherry-pick specific files

```bash
# Just the safety hooks
cp .claude/hooks/block-dangerous.sh /your/project/.claude/hooks/
cp .claude/hooks/protected-files.sh /your/project/.claude/hooks/

# Just the verification gate
cp .claude/hooks/lib/detect-stack.sh /your/project/.claude/hooks/lib/
cp .claude/hooks/verify-on-stop.sh /your/project/.claude/hooks/

# Just the workflow commands
cp .claude/commands/plan.md /your/project/.claude/commands/
cp .claude/commands/verify-app.md /your/project/.claude/commands/
```

### Requirements

- `jq` (required by hooks): `brew install jq` / `apt install jq`
- `gh` (optional, for PR commands): `brew install gh`
- Claude Code CLI installed

### After Installation

1. Run `/kova:status` to verify everything is set up
2. Run `/kova:help` to see available commands
3. Edit `.claude/CLAUDE.md` to customize for your project

---

That's it. The hooks activate automatically — no additional setup needed.
