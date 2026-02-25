#!/bin/bash
# Notify when test files are modified
# PostToolUse hook for Write|Edit tools on test files

FILE_PATH=$(jq -r '.tool_input.file_path // ""')

IS_TEST=""
case "$FILE_PATH" in
  *.test.*|*.spec.*)   IS_TEST=1 ;;  # JS/TS: foo.test.ts, foo.spec.js
  */test_*.py)         IS_TEST=1 ;;  # Python: test_foo.py
  *_test.go)           IS_TEST=1 ;;  # Go: foo_test.go
  *_spec.rb)           IS_TEST=1 ;;  # Ruby: foo_spec.rb
  *Test.java)          IS_TEST=1 ;;  # Java: FooTest.java
  *_test.rs)           IS_TEST=1 ;;  # Rust: foo_test.rs
  *Tests.cs)           IS_TEST=1 ;;  # .NET: FooTests.cs
esac

if [ -n "$IS_TEST" ]; then
  # Cross-platform notification
  if command -v osascript &>/dev/null; then
    osascript -e "display notification \"Test file modified\" with title \"Claude: Test Runner\"" 2>/dev/null
  elif command -v notify-send &>/dev/null; then
    notify-send "Claude: Test Runner" "Test file modified" 2>/dev/null
  fi
  echo '{"systemMessage": "Test file modified. Consider running the project test suite for: '"$FILE_PATH"'"}'
fi

exit 0
