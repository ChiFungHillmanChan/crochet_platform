# Project Instructions

## Self-Improving Instructions

When Claude makes a mistake or the user corrects a pattern, **update this file immediately**:
1. Add the correction to the Lessons Learned section at the bottom
2. This ensures the same mistake never happens twice

---

## Quick Reference

<!-- [PROJECT: Customize these for your project] -->

| Item | Location |
|------|----------|
| Project overview | `README.md` |
| Package commands | `package.json` / `pyproject.toml` / `go.mod` / `Cargo.toml` / `pom.xml` / `*.csproj` |
| Tech stack | _[Add your stack: e.g., "Next.js 15, Vitest, Playwright, TailwindCSS"]_ |
| Package manager | _[Add: npm / pnpm / yarn / bun / pip / cargo / go / bundle / mvn / gradle / dotnet]_ |
| Source directory | _[Add: src/ / lib/ / cmd/ / pkg/ / internal/ / app/]_ |
| Test directory | _[Add: tests/ / __tests__/ / spec/ / test/ / *_test.go]_ |

### Essential Commands
```bash
# [PROJECT: Replace with your actual commands]
# Build:     <pm> run build | go build | cargo build | mvn compile | dotnet build
# Test:      <pm> run test | pytest | go test | cargo test | rspec | mvn test
# Lint:      <pm> run lint | ruff check | golangci-lint | cargo clippy | rubocop
# Typecheck: <pm> run typecheck | mypy | go vet | cargo check
```

---

## Engineering Behaviour

### You are a senior engineer, not a code assistant.
You think before you act. You verify your own work. You own the outcome.

### You NEVER ask permission for:
- Choosing implementation approaches — pick the better one, comment why
- Writing tests — always write them
- File/folder naming — follow existing conventions
- Minor refactors while fixing bugs — do it, note in summary
- Adding types to untyped code — just do it
- Fixing lint/format errors — always fix
- Running tests/builds/type checks — always run without asking

### You ALWAYS escalate to the human for:
- Deleting production data or database tables
- Changing `.env` / secrets / credentials
- Architectural changes affecting more than 3 major systems
- Deploying to production
- If you have failed the SAME task 3+ times in a row

### Assumption Protocol
When requirements are ambiguous, **never stop and ask**. Instead:
1. Make the most reasonable assumption
2. Add a comment: `// ASSUMPTION: [your assumption]. Change X if different behaviour needed.`
3. Continue working
4. Include assumption in your final summary

---

## Verification Pipeline

### Automatic Stop Gate (every time you finish)
The Stop hook runs a 7-layer gate (6 blocking + 1 warning). You cannot stop until blocking layers pass:
1. **Build** — project must compile
2. **Unit tests** — auto-detected test runner (vitest/jest/pytest/go test/cargo test/rspec/etc.) — flaky tests auto-retried once
3. **Integration tests** — `test:integration` script **(if configured)** — flaky tests auto-retried once
4. **E2E tests** — Playwright **(if installed)** — flaky tests auto-retried once
5. **Lint** — must be clean
6. **Type check** — must be clean
7. **Security audit** — dependency audit (warn only, does not block stop)

If blocked 3 times, writes `DEBUG_LOG.md` with diagnosis and spawns a self-healing session (failures are not permanent blocks).

### Manual Full Pipeline (`/verify-app`)
Before any PR, merge, or deploy — 10 layers:
- Layers 1-4: Build + unit + integration + E2E (same as Stop gate)
- Layer 5: **MCP Chrome browser check** (visual, console errors, navigation, forms)
- Layer 6: **Accessibility check** (alt text, labels, heading hierarchy, keyboard nav)
- Layer 7: **Performance check** (load time, bundle size)
- Layers 8-10: Lint + types + security/code review

### After EVERY code change you must:
1. Run unit tests — fix until green
2. Run E2E tests — fix until green
3. Run lint + typecheck — fix until clean
4. Only stop when all pass
5. If stuck after 3 attempts, write `DEBUG_LOG.md`

---

## Available Commands

### Workflow (day-to-day)
| Command | Purpose |
|---------|---------|
| `/plan [feature]` | Plan before coding. Explore codebase, write plan, wait for "go". |
| `/verify-app` | Full 10-layer verification pipeline with browser + a11y + perf checks. |
| `/commit-push-pr` | Auto: git add, commit (conventional), push, open draft PR. |
| `/fix-and-verify` | Autonomous bug fixing. Loops until green, escalates after 3 tries. |
| `/code-review` | 4 parallel reviewers (security, logic, architecture, tests) + challenge pass. |
| `/simplify` | Clean up code without changing behaviour. Dead code, naming, structure. |
| `/daily-standup` | Engineering report: shipped, blockers, priorities, velocity. |

### Reference (load coding standards on demand)
| Command | Purpose |
|---------|---------|
| `/core-rules` | DRY, naming, 300-line limit, variable conventions |
| `/typescript-rules` | No `any`, type guards, explicit types |
| `/error-handling` | Meaningful catches, context logging |
| `/security-rules` | No hardcoded secrets, env var patterns |
| `/code-cleanup` | Dead code detection, duplication, complexity |
| `/style-guide` | Visual design and styling rules |
| `/troubleshooting` | Common issues and solutions |
| `/techdebt` | Scan codebase for tech debt and violations |
| `/worktree-workflow` | Git worktree parallel sessions |
| `/plan-mode` | Plan-first development discipline |
| `/framework-rules` | Add framework-specific rules (Next.js, Django, etc.) |

---

## Coding Standards (enforced — load `/core-rules` for details)

- Every file under 300 lines. No exceptions.
- No code duplication. Extract shared functions.
- Self-documenting names: `isVisible`, `fetchData`, `API_BASE_URL`
- No type-safety bypasses without justification (e.g., `any`, `@ts-ignore`, `# type: ignore`, `unsafe` blocks).
- No hardcoded secrets. Use env vars via factory functions.
- No empty catch blocks. Handle errors meaningfully or let them propagate.

---

## Git Conventions

**Commits:** `<type>(<scope>): <description>` (feat, fix, refactor, test, chore, docs, perf)
**Branches:** `<type>/<ticket>-<description>` (feature/, fix/, hotfix/, release/, chore/, refactor/)
**Attribution:** `Co-Authored-By: Claude <noreply@anthropic.com>`

---

## Summary Format

When you finish a task:
```
Done: [what you did]
Tests: [X unit passed, Y e2e passed]
Coverage: [X%]
Assumptions: [any, or "none"]
Escalations: [any, or "none"]
```

---

## Never Do These
- Never use `--dangerously-skip-permissions` unless explicitly told
- Never `rm -rf` without absolute certainty
- Never modify `.env.production` without human confirmation
- Never commit secrets, API keys, or passwords
- Never skip tests because "it's a small change"
- Never ship without the verification pipeline passing

<!-- Lessons Learned (append new entries here)
- YYYY-MM-DD: [correction description]
-->
