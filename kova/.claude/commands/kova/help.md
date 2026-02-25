# /kova:help
# Kova Protocol — Quick Reference
# Call this anytime to see what's available.

## What is Kova?

Kova is the automation layer running inside this project. It gives Claude:
- **Safety hooks** that block dangerous commands and protect sensitive files
- **Verification gates** that run build/test/lint/typecheck before Claude can stop
- **Workflow commands** for planning, shipping, reviewing, and debugging
- **Auto-formatting** for every file write across 10+ languages

---

## Available Commands

### Workflow (use daily)

| Command | What it does |
|---------|-------------|
| `/plan [feature]` | Plan before coding. Claude explores, writes a plan, waits for "go" |
| `/commit-push-pr` | Stage, commit, push, open draft PR — no questions asked |
| `/verify-app` | Full 10-layer QA: build, tests, lint, types, browser, a11y, perf, security |
| `/fix-and-verify` | Autonomous bug fixing. Loops until green or asks for help after 3 tries |
| `/code-review` | 4 parallel reviewers (security, logic, architecture, tests) |
| `/simplify` | Clean up code without changing behaviour |
| `/daily-standup` | Engineering report: shipped, blockers, priorities |

### Reference (load on demand)

| Command | What it does |
|---------|-------------|
| `/core-rules` | DRY, naming, 300-line limit |
| `/typescript-rules` | No `any`, type guards, explicit types |
| `/error-handling` | Meaningful catches, context logging |
| `/security-rules` | No hardcoded secrets, env var patterns |
| `/code-cleanup` | Dead code, duplication, complexity |
| `/style-guide` | Visual design and styling rules |
| `/troubleshooting` | Common issues and solutions |
| `/techdebt` | Scan codebase for tech debt |
| `/worktree-workflow` | Git worktree parallel sessions |
| `/framework-rules` | Add framework-specific rules |

### Kova

| Command | What it does |
|---------|-------------|
| `/kova:help` | This help page |
| `/kova:status` | Check which hooks are active and what stack is detected |
| `/kova:activate` | Turn ON all automatic hooks (format, verify, block, notify) |
| `/kova:deactivate` | Turn OFF all automatic hooks (commands still work) |
| `/kova:install` | Instructions for installing into another project |
| `/kova:init [name]` | Scaffold a new PRD file for the Smart Loop |
| `/kova:loop <prd>` | Smart Loop: implement PRD items with verify + review per iteration |

---

## Hooks (off by default — use `/kova:activate` to enable; **takes effect next session**)

| Hook | When | What |
|------|------|------|
| `auto-format.sh` | After every file write | Prettier, Ruff, Black, gofmt, rustfmt, RuboCop, etc. |
| `block-dangerous.sh` | Before bash commands | Blocks rm -rf /, force push, DROP TABLE |
| `protected-files.sh` | Before file edits | Blocks `.env*`, `.pem`, `.key`, `secrets/`, `credentials/` |
| `verify-on-stop.sh` | When Claude finishes | 6 blocking layers + 1 warning: build, test (with flaky retry), lint, types, security (warn only) |
| `session-start.sh` | Session start | Sets env vars based on detected stack |
| `task-notify.sh` | After file changes | Desktop notification (macOS/Linux) |
| `test-runner.sh` | After file changes | Detects test file modifications |

---

## Supported Languages

Auto-detected from lockfiles/config files:

**Node.js** (package.json) | **Python** (pyproject.toml) | **Go** (go.mod) | **Rust** (Cargo.toml) | **Ruby** (Gemfile) | **Java** (pom.xml/build.gradle) | **.NET** (*.csproj)

> **Note:** The Smart Loop (`/kova:loop`) uses its own verification gate with the same layers but no retry counter or self-healing — failures are handled by the loop's fix-and-retry logic.

---

## Customization

1. Edit `.claude/CLAUDE.md` — fill in the `[PROJECT: ...]` placeholders
2. Edit `.claude/settings.local.json` — adjust permissions and hook config
3. Add/remove hooks by editing hook entries in settings.local.json

---

Now tell the user what commands are available and ask how you can help.
