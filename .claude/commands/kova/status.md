# /kova:status
# Check the current Kova setup in this project.
# Shows detected stack, active hooks, and available commands.

## Steps:

1. **Detect stack** — Run these checks and report what's found:
   - Check for `package.json` → Node.js (report package manager: npm/pnpm/yarn/bun)
   - Check for `pyproject.toml` or `requirements.txt` → Python
   - Check for `go.mod` → Go
   - Check for `Cargo.toml` → Rust
   - Check for `Gemfile` → Ruby
   - Check for `pom.xml` or `build.gradle` → Java
   - Check for `*.csproj` or `*.sln` → .NET

2. **Check hooks** — Read `.claude/settings.local.json` (or `.claude/settings.json` if no local) and list which hooks are configured:
   - PostToolUse hooks (format, notify, test-runner)
   - Stop hooks (verify-on-stop)
   - PreToolUse hooks (block-dangerous, protected-files)
   - Note any hooks that are configured but whose script files are missing

3. **Check commands** — List all `.md` files in `.claude/commands/` and `.claude/commands/kova/`

4. **Check shared library** — Verify `.claude/hooks/lib/detect-stack.sh` exists

4b. **Check Smart Loop** — Check if `.claude/hooks/kova-loop.sh` exists and report:
   - Loop script: OK / MISSING
   - Loop libs: check for `parse-prd.sh`, `verify-gate.sh`, `parse-failures.sh`, `generate-prompt.sh`, `run-code-review.sh` in `.claude/hooks/lib/`
   - Active loop: check if `.kova-loop/` directory exists (indicates a loop is in progress or was run)

5. **Report** in this format:
```
KOVA STATUS
═══════════════════════════
Stack detected:    [Node.js (pnpm), Python, etc. or "none"]
Package manager:   [npm/pnpm/yarn/bun or "N/A"]
Hooks active:      [X of 7]
Commands available: [X workflow + Y reference + Z kova]
Shared library:    [OK / MISSING]
═══════════════════════════
```

6. If anything is missing or misconfigured, suggest how to fix it.
