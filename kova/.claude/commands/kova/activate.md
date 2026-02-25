# /kova:activate
# Turn ON all Kova automatic hooks.
# Hooks will run automatically until you call /kova:deactivate.

## Steps:

1. Read `.claude/settings.local.json`
2. Add the following hooks config to the JSON (merge with existing keys, do NOT overwrite permissions or enabledPlugins):

```json
"hooks": {
  "PreToolUse": [
    {
      "matcher": "Edit|Write",
      "hooks": [{ "type": "command", "command": "cat | .claude/hooks/protected-files.sh" }]
    },
    {
      "matcher": "Bash",
      "hooks": [{ "type": "command", "command": "cat | .claude/hooks/block-dangerous.sh" }]
    }
  ],
  "PostToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [
        { "type": "command", "command": "cat | .claude/hooks/task-notify.sh" },
        { "type": "command", "command": "cat | .claude/hooks/test-runner.sh" },
        { "type": "command", "command": "cat | .claude/hooks/auto-format.sh" }
      ]
    }
  ],
  "Stop": [
    {
      "matcher": "",
      "hooks": [{ "type": "command", "command": "cat | .claude/hooks/verify-on-stop.sh", "timeout": 60 }]
    }
  ],
  "SessionStart": [
    {
      "matcher": "startup",
      "hooks": [{ "type": "command", "command": ".claude/hooks/session-start.sh" }]
    }
  ]
}
```

3. Write the updated JSON back to `.claude/settings.local.json`
4. Report:

```
KOVA ACTIVATED
═══════════════════════════
Hooks enabled:
  ✓ protected-files (PreToolUse)
  ✓ block-dangerous (PreToolUse)
  ✓ auto-format (PostToolUse)
  ✓ test-runner (PostToolUse)
  ✓ task-notify (PostToolUse)
  ✓ verify-on-stop (Stop)
  ✓ session-start (SessionStart)
═══════════════════════════
Note: Hooks take effect on NEXT session start.
Run /kova:deactivate to turn off.
```
