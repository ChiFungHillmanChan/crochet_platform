# Contributing

Welcome! This project makes Claude Code work better for every language and ecosystem. Contributions are appreciated — whether it's adding a new language, improving hooks, or fixing bugs.

## Adding Support for a New Language

1. **Detection** — Add lockfile/config detection in `hooks/session-start.sh` (e.g., check for `go.mod`, `Cargo.toml`)
2. **Verification** — Add build, test, lint, and typecheck commands in `hooks/verify-on-stop.sh`
3. **Formatting** — Add the formatter invocation in `hooks/auto-format.sh`
4. **Environment** — Set any language-specific env vars in `hooks/session-start.sh`
5. **Verify command** — Update `commands/verify-app.md` to include the new language's tools
6. **Settings** — Update `settings.json` deny patterns if the language has generated files that should be protected

## Adding a New Hook

Hooks are shell scripts in `.claude/hooks/` that run automatically based on tool matchers.

1. Create a new `.sh` file in `.claude/hooks/`
2. Register it in `.claude/settings.local.json` under the `hooks` key with a `matcher` (tool trigger) and `command` (path to script)
3. Hooks receive context via environment variables and stdin — see existing hooks for examples
4. Keep hooks fast; they run on every matched action

## Adding a New Command

Slash commands are Markdown files in `.claude/commands/`.

1. Create a `.md` file in `.claude/commands/` — the filename becomes the command name (e.g., `my-command.md` -> `/my-command`)
2. Write the prompt/instructions Claude should follow when the command is invoked
3. Use clear, imperative instructions
4. Reference existing commands for style and structure

## PR Expectations

- [ ] All shell scripts pass `shellcheck` with no warnings
- [ ] Tested with at least one language/ecosystem
- [ ] `README.md` updated if adding new language support or hooks
- [ ] No secrets, credentials, or API keys committed
- [ ] Keep changes focused — one feature or fix per PR
