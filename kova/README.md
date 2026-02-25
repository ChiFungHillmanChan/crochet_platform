# Kova Protocol
### Autonomous Engineering Organization for Claude Code

Drop into **any project** to transform Claude Code from "AI coder that asks questions" into "Autonomous engineering team that ships."

---

## Install into a project

```bash
# From the kova directory, run:
bash install-kova.sh

# Preview without installing:
bash install-kova.sh --dry-run

# Or copy manually:
cp -r .claude/ /your/project/.claude/
cp CLAUDE.md /your/project/CLAUDE.md
chmod +x /your/project/.claude/hooks/*.sh
chmod +x /your/project/.claude/hooks/lib/*.sh
```

**Requires:** `jq` (macOS: `brew install jq`, Linux: `apt install jq`), `gh` (optional, for PR commands)

**Supports:** Node.js, Python, Go, Rust, Ruby, Java, .NET — auto-detected from lockfiles and config files.

---

## What this does

### Hooks (automatic, no command needed)
| Hook | Trigger | What it does |
|------|---------|--------------|
| `format.sh` | Every file write/edit | Auto-formats (Prettier, Ruff, Black, gofmt, rustfmt, RuboCop, etc.) |
| `verify-on-stop.sh` | When Claude finishes | 6 blocking layers (build, tests, lint, types) + 1 warning (security audit). Flaky tests auto-retried once. Self-heals after 3 failures. |
| `block-dangerous.sh` | Before any bash command | Blocks `rm -rf /`, force push, DROP TABLE, etc. |
| `protect-files.sh` | Before any file write | Blocks `.env*`, `.pem`, `.key`, `secrets/`, `credentials/` |

### Slash Commands
| Command | What it does |
|---------|-------------|
| `/plan` | Plan before coding. Claude waits for your approval before touching code. |
| `/verify-app` | Full QA sweep: tests + lint + types + code review |
| `/commit-push-pr` | Auto: stage files, commit, push, open PR |
| `/fix-and-verify` | Autonomous bug fixing. Doesn't stop until green. |
| `/code-review` | Multi-subagent review (security, logic, architecture, tests) |
| `/simplify` | Clean up code after feature, never breaks behaviour |
| `/daily-standup` | Engineering report: what shipped, what's next, risks |

### CLAUDE.md (the culture doc)
Tells Claude:
- Never ask permission for routine decisions
- Always run tests autonomously
- Use assumption protocol instead of stopping to ask
- Only escalate for production deploys, secret changes, or 3+ failed attempts

---

## Your Workflow

```
Morning:
  /daily-standup          <- 30-second project overview

Feature work:
  /plan [feature]         <- align on approach (you approve)
  -> "go"                 <- Claude implements autonomously
  /verify-app             <- QA sweep (or happens auto on Stop)
  /commit-push-pr         <- ships it

Bug found:
  /fix-and-verify         <- Claude fixes everything, comes back green

Before merge:
  /code-review            <- multi-agent review
  /simplify               <- clean up

End of day:
  /daily-standup          <- see what shipped
```

---

## Philosophy

> "You don't trust; you instrument."

The goal isn't to hope Claude does the right thing.
It's to build a system where Claude **can only do the right thing.**

As AI models get stronger, your system gets stronger automatically.
