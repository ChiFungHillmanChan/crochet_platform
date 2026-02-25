# /kova:deactivate
# Turn OFF all Kova automatic hooks.
# Commands like /kova:help, /verify-app, /plan still work — only automatic hooks are disabled.

## Steps:

1. Read `.claude/settings.local.json`
2. Remove the entire `"hooks"` key from the JSON (keep everything else: permissions, enabledPlugins, env, etc.)
3. Write the updated JSON back to `.claude/settings.local.json`
4. Report:

```
KOVA DEACTIVATED
═══════════════════════════
All automatic hooks disabled.

Still available (on-demand):
  /kova:help       — reference guide
  /kova:status     — check setup
  /kova:activate   — turn hooks back on
  /verify-app            — manual verification
  /plan                  — plan before coding
  /commit-push-pr        — commit workflow
  /code-review           — code review
  /fix-and-verify        — bug fix loop
═══════════════════════════
```
