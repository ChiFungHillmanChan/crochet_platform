# /kova:loop
# Kova Smart Loop — implement PRD items with maximum quality.
# Each iteration: implement → verify → review → commit (or diagnose → fix).
# Every fix gets a UNIQUE prompt with file:line diagnostics. No blind retries.
#
# Usage: /kova:loop <prd-file>
# The PRD file can be markdown (- [ ] items) or JSON ({ "items": [...] })

You are now the Kova Smart Loop orchestrator. Follow these steps EXACTLY.

---

## Phase 1: Validate & Parse

### 1.1 Get the PRD file path

The user argument is: `$ARGUMENTS`

- If `$ARGUMENTS` is empty or blank, say:
  ```
  Usage: /kova:loop <prd-file>
  Example: /kova:loop docs/prd-auth.md

  No PRD file specified. Provide a path to a markdown or JSON PRD file.
  Tip: Run /kova:init to scaffold a new PRD file.
  ```
  Then STOP. Do not continue.

- If `$ARGUMENTS` contains flags like `--dry-run`, `--no-commit`, `--max-iterations`, `--max-fix-attempts`, parse them:
  - `--dry-run` → set DRY_RUN mode (parse and show plan, don't execute)
  - `--no-commit` → skip git commit after each item
  - `--max-iterations N` → override default 20
  - `--max-fix-attempts N` → override default 5
  - The remaining non-flag argument is the PRD file path

### 1.2 Validate prerequisites

Run these checks (use Bash tool). If ANY fail, report and STOP:

```bash
# Check PRD file exists
test -f "<prd-file>" && echo "PRD_OK" || echo "PRD_MISSING"

# Check jq is available (needed for JSON PRDs and hooks)
command -v jq &>/dev/null && echo "JQ_OK" || echo "JQ_MISSING"

# Check we're in a git repo
git rev-parse --is-inside-work-tree 2>/dev/null && echo "GIT_OK" || echo "GIT_MISSING"

# Check for uncommitted changes (warn only)
git diff --quiet 2>/dev/null && git diff --cached --quiet 2>/dev/null && echo "GIT_CLEAN" || echo "GIT_DIRTY"

# Check detect-stack.sh exists
test -f ".claude/hooks/lib/detect-stack.sh" && echo "LIB_OK" || echo "LIB_MISSING"
```

Report failures clearly:
- `PRD_MISSING` → "PRD file not found: `<path>`. Check the path and try again."
- `JQ_MISSING` → "jq is required but not installed. Run: `brew install jq` (macOS) or `apt install jq` (Linux)"
- `GIT_MISSING` → "Not a git repository. The loop needs git for commits and diffs."
- `GIT_DIRTY` → WARNING only: "You have uncommitted changes. The loop will commit on top of them. Consider committing first."
- `LIB_MISSING` → "Kova lib not found. Run `/kova:install` first."

### 1.3 Parse the PRD file

Read the PRD file using the Read tool. Determine its format:

**Markdown format** — look for `- [ ] ` checklist items:
```markdown
- [ ] Implement user signup endpoint
- [ ] Add email validation
- [x] Set up database schema (already done)
```
Extract all `- [ ] ` lines as pending items. `- [x] ` lines are already completed (context only).

**JSON format** — look for `{ "items": [...] }`:
```json
{
  "items": [
    { "title": "Implement user signup", "description": "POST /api/signup with email+password" },
    { "title": "Add email validation", "done": false },
    { "title": "Set up database schema", "done": true }
  ]
}
```
Items with `"done": true` or `"completed": true` are already done.

**If format is unrecognized**, say:
```
Could not parse PRD file. Supported formats:
  Markdown:  - [ ] task description
  JSON:      { "items": [{ "title": "...", "description": "..." }] }
Run /kova:init to scaffold a properly formatted PRD.
```
Then STOP.

**If no pending items found**, say: "All items in the PRD are already completed (marked with [x]). Nothing to do."
Then STOP.

### 1.4 Check for existing loop state

```bash
test -d ".kova-loop" && echo "STATE_EXISTS" || echo "NO_STATE"
```

If `.kova-loop/` exists, read `.kova-loop/LOOP_PROGRESS.md` and show it to the user:
```
Found existing loop state from a previous run:
<contents of LOOP_PROGRESS.md>

Options:
  resume  — continue from where the last loop stopped
  restart — delete state and start fresh
  cancel  — abort
```
Wait for user input. If "resume", continue with existing state. If "restart", delete `.kova-loop/` and proceed fresh. If "cancel", STOP.

### 1.5 Show plan and confirm

Display:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 KOVA SMART LOOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PRD:             <filename> (<N> pending, <M> completed)
 Max iterations:  20
 Max fix tries:   5 per item
 Auto-commit:     yes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 Items to implement:
  1. [ ] <item 1>
  2. [ ] <item 2>
  3. [ ] <item 3>
  ...

 Already completed:
  [x] <completed item>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If `--dry-run` flag was set, show the above and STOP.

Otherwise ask: **"Ready to start. Type `go` to begin."**

Wait for the user to say "go" (or similar confirmation). Do NOT proceed without confirmation.

---

## Phase 2: The Loop

Initialize tracking:
```bash
mkdir -p .kova-loop
```

Create `.kova-loop/LOOP_PROGRESS.md` with the initial state (all items pending).

Set these variables mentally (do not use bash variables — track in your own context):
- `current_item = 1`
- `iteration = 0`
- `fix_attempts = 0`
- `mode = "implement"`
- `completed_items = []` (list of done items with commit hashes)
- `stuck_items = []`

### For each iteration of the loop:

Check exit conditions FIRST:
- If `current_item > total_items` → all done, go to Phase 3
- If `iteration >= max_iterations` → hit limit, go to Phase 3
- If user sends "stop" or "cancel" at any point → go to Phase 3

Increment `iteration`. Then:

---

### Step 2.1: Announce the iteration

```
--- Iteration <N>: Item <current>/<total> (mode: <mode>) ---
  <item text>
```

### Step 2.2: Implement or fix (based on mode)

**If mode = "implement":**
This is a NEW PRD item. Implement it:
1. Read relevant existing code in the project (explore before coding)
2. Implement the feature described in the PRD item
3. Write tests covering happy path, edge cases, and expected errors
4. Follow CLAUDE.md coding standards (300 line limit, no type-safety bypasses, etc.)
5. Keep a mental note of what you changed (files, functions)

**If mode = "fix-verify":**
Verification failed on a previous iteration. You have specific failures to fix:
1. Read the failures you recorded from the last verification
2. Fix ONLY those specific failures — do NOT re-implement or refactor
3. If a test expectation is wrong (not the code), fix the test
4. Minimal changes only

**If mode = "fix-review":**
Code review found HIGH-severity issues. Fix them:
1. Read the HIGH-severity issues from the last review
2. Fix each issue without breaking existing tests
3. Security issues take priority

### Step 2.3: Run verification

After implementing/fixing, run the project's verification pipeline using Bash:

```bash
source .claude/hooks/lib/detect-stack.sh
detect_pm
detect_languages
```

Then run each applicable layer (check what's detected):

**Layer 1 — Build:**
- Node.js with build script: `$PM run build`
- Go: `go build ./...`
- Rust: `cargo build`
- Java: `mvn compile -q` or `gradle build -q`
- .NET: `dotnet build --nologo -v q`
- If no build system: SKIP

**Layer 2 — Unit tests** (retry once if fail):
- Node.js: `$PM run test:unit` or `$PM run test -- --run` (vitest) or `$PM run test` (jest)
- Python: `pytest --tb=short -q`
- Go: `go test ./...`
- Rust: `cargo test`
- Ruby: `bundle exec rspec`

**Layer 3 — Integration tests** (if configured):
- `$PM run test:integration` (if script exists)

**Layer 4 — E2E** (if Playwright installed):
- `$PM run test:e2e` or `npx playwright test`

**Layer 5 — Lint:**
- Node.js: `$PM run lint`
- Python: `ruff check .` or `flake8 .`
- Go: `golangci-lint run`
- Rust: `cargo clippy -- -D warnings`

**Layer 6 — Type check:**
- Node.js: `$PM run typecheck` or `npx tsc --noEmit`
- Python: `mypy .` or `pyright`
- Go: `go vet ./...`
- Rust: `cargo check`

**Layer 7 — Security audit** (warn only, does not block):
- `$PM audit` or language equivalent

Record the full output of any failing layers. Note the specific errors with file:line detail.

### Step 2.4: Branch based on results

**If ALL blocking layers pass (1-6):**
```
  ✓ Verification passed (layers 1-6 green)
```

Now run a quick mental code review of YOUR OWN changes:
- Any security vulnerabilities? (injection, XSS, hardcoded secrets)
- Any logic bugs? (wrong conditions, null derefs, race conditions)
- Any missing error handling that could crash in production?

**If review is clean OR only low-severity:**
```
  ✓ Code review: clean
  ✓ Item <N> complete!
```
- If auto-commit is on, commit the changes:
  ```bash
  git add -A
  git commit -m "feat(loop): <short item description>

  Kova Smart Loop — PRD item <N>
  PRD: <prd-file>

  Co-Authored-By: Claude <noreply@anthropic.com>"
  ```
- Record the commit hash
- Add item to `completed_items`
- Set `current_item += 1`, `fix_attempts = 0`, `mode = "implement"`
- Update `.kova-loop/LOOP_PROGRESS.md`
- Continue to next iteration

**If review found HIGH-severity issues:**
```
  ⚠ Code review: HIGH-severity issues found
    - <file>:<line> — <description>
```
- Set `fix_attempts += 1`, `mode = "fix-review"`
- Record the issues for the next iteration's fix
- Continue to next iteration

**If ANY blocking layer FAILED:**
```
  ✗ Verification failed: <which layers>
```
- Parse the error output. Extract:
  - Test failures: file, line, test name, expected vs received
  - Lint errors: rule, file:line, message
  - Type errors: error code, file:line, type mismatch detail
  - Build errors: module not found, undefined reference, etc.
- Record these structured failures
- Set `fix_attempts += 1`, `mode = "fix-verify"`

**If stuck (fix_attempts >= max_fix_attempts):**
```
  ✗ STUCK on item <N> after <max> attempts. Skipping.
```
- Add to `stuck_items` with the last failure details
- Write to `.kova-loop/STUCK_ITEMS.md`
- Set `current_item += 1`, `fix_attempts = 0`, `mode = "implement"`
- Continue to next iteration

### Step 2.5: Update progress file

After every iteration, update `.kova-loop/LOOP_PROGRESS.md`:
```markdown
# Kova Loop Progress
Started: <date> | PRD: <file> (<N> items)

- [x] 1. <item> (commit abc1234)
- [x] 2. <item> (commit def5678)
- [ ] 3. <item> (IN PROGRESS, fix attempt 2/5)
- [ ] 4. <item>
- [ ] 5. <item>

Stats: 7/20 iterations | 2/5 items done | mode: fix-verify
```

Also append to `.kova-loop/ITERATION_LOG.md`:
```markdown
## Iteration <N> — Item <M> — Mode: <mode>
Time: <timestamp> | Result: <VERIFY_PASS|VERIFY_FAIL|ITEM_DONE|STUCK>
Detail: <what happened>
---
```

### Step 2.6: Tell the user what happened

After each iteration, briefly tell the user:
```
Iteration <N> done. Item <M>/<total>: <PASS|FAIL|DONE|STUCK>. <one sentence detail>.
```
Do NOT wait for user input between iterations — keep going automatically.
But DO check if the user has sent "stop" or "cancel".

---

## Phase 3: Report Results

When the loop ends (all items done, max iterations, user cancelled, or all remaining items stuck):

Read `.kova-loop/LOOP_PROGRESS.md` and display it.

Then show the final summary:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 KOVA SMART LOOP — COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Items completed: <X>/<Y>
 Iterations used: <N>/<max>
 Stuck items:     <Z>
 Commits:         <list of commit hashes>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Suggest next steps based on outcome:

**All items done:**
```
All PRD items implemented and verified.
Next: /verify-app for full QA sweep, then /commit-push-pr to ship.
```

**Some items stuck:**
```
<Z> items could not be fixed automatically. See .kova-loop/STUCK_ITEMS.md.
You can fix them manually and re-run /kova:loop to continue.
```

**Hit max iterations:**
```
Hit the iteration limit (<max>). To continue:
  /kova:loop <prd-file>    (will offer to resume)
  --max-iterations 40            (increase the limit)
```

**User cancelled:**
```
Loop stopped by user. Progress saved in .kova-loop/.
Run /kova:loop <prd-file> to resume from where you left off.
```

---

## Key Rules (NEVER violate these)

1. **NEVER use `--dangerously-skip-permissions`** — the loop uses `--allowedTools` whitelist if spawning sub-processes
2. **NEVER skip verification** — every implementation and fix MUST be verified before moving on
3. **NEVER blind retry** — every fix iteration MUST be based on specific diagnostics (file:line errors)
4. **NEVER commit failing code** — only commit after verification passes AND code review is clean
5. **ALWAYS update progress files** — `.kova-loop/LOOP_PROGRESS.md` after every iteration
6. **ALWAYS tell the user** what's happening after each iteration (brief, one line)
7. **ALWAYS respect the stuck limit** — skip items after max fix attempts, don't loop forever
