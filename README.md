# Claude Code Project Template

A drop-in template that turns Claude Code into an autonomous engineering team.
一個即插即用嘅模板，將 Claude Code 變成自主工程團隊。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**[English](#english) | [粵語 Cantonese](#粵語-cantonese) | [中文 Chinese](#中文-chinese)**

---

<a id="english"></a>
## English

### What is this?

Copy the `.claude/` folder into any project. Claude immediately gets coding standards, safety hooks, and workflow commands. Works with **Node.js, Python, Go, Rust, Ruby, Java, and .NET** — auto-detected.

### Quick Start

```bash
# Option 1: Copy the whole template into your project
cp -r .claude/ /path/to/your/project/.claude/

# Option 2: Use the Kova installer
cd /path/to/your/project
bash /path/to/kova/install-kova.sh

# Option 3: Preview before installing
bash /path/to/kova/install-kova.sh --dry-run
```

After copying, customize `.claude/CLAUDE.md` — fill in the `[PROJECT: ...]` placeholders with your tech stack, package manager, and source directories.

### What's Inside

#### Hooks (automatic, zero effort)

Hooks run automatically in the background. You never call them — they trigger on Claude's actions.

| Hook | Trigger | What it does |
|------|---------|--------------|
| `auto-format.sh` | After every file write | Formats with Prettier, Ruff, Black, gofmt, rustfmt, RuboCop, etc. |
| `block-dangerous.sh` | Before every bash command | Blocks `rm -rf /`, `git push --force`, `DROP TABLE`, fork bombs |
| `protected-files.sh` | Before every file edit | Blocks edits to `.env`, `.pem`, `id_rsa`, secrets, credentials |
| `verify-on-stop.sh` | When Claude finishes a task | Runs build + tests + lint + typecheck + security audit. Blocks stop if failing |
| `session-start.sh` | When a session starts | Sets up environment variables based on detected stack |
| `task-notify.sh` | After file changes | Sends notification (macOS/Linux) when files change |
| `test-runner.sh` | After file changes | Detects test file changes across all languages |

#### Slash Commands

Type these in Claude Code to trigger specific workflows.

**Workflow commands:**

| Command | What it does |
|---------|-------------|
| `/plan` | Plan a feature before coding. Claude explores, writes a plan, waits for "go" |
| `/commit-push-pr` | Stage files, commit with conventional message, push, open draft PR |
| `/verify-app` | Full 10-layer QA sweep: tests, lint, typecheck, browser check, security |
| `/fix-and-verify` | Autonomous bug fixing. Loops until all tests pass or asks for help after 3 tries |
| `/code-review` | Spawns 4 parallel reviewers (security, logic, architecture, tests) |
| `/simplify` | Cleans up code without changing behaviour |
| `/daily-standup` | Engineering report: what shipped, blockers, priorities |

**Reference commands:**

| Command | What it does |
|---------|-------------|
| `/core-rules` | Core programming principles |
| `/typescript-rules` | TypeScript best practices |
| `/error-handling` | Error handling patterns |
| `/security-rules` | Security and credential handling |
| `/code-cleanup` | Code quality detection |
| `/style-guide` | Visual design and styling rules |
| `/troubleshooting` | Common issues and solutions |
| `/techdebt` | Scan for tech debt and violations |
| `/worktree-workflow` | Git worktree parallel workflow |
| `/plan-mode` | Plan-first development discipline |
| `/framework-rules` | Template for adding framework-specific rules |

### Supported Languages

| Language | Build | Test | Lint | Type Check | Format | Security Audit |
|----------|-------|------|------|------------|--------|----------------|
| JS/TS | Yes | vitest, jest | eslint | tsc | prettier | npm/pnpm/yarn audit |
| Python | - | pytest | ruff, flake8 | mypy, pyright | ruff, black | pip-audit |
| Go | go build | go test | golangci-lint | go vet | gofmt | govulncheck |
| Rust | cargo build | cargo test | cargo clippy | cargo check | rustfmt | cargo audit |
| Ruby | - | rspec | rubocop | - | rubocop -a | bundle-audit |
| Java | mvn/gradle | mvn/gradle test | - | - | google-java-format | - |
| .NET | dotnet build | dotnet test | dotnet format | dotnet build | dotnet format | - |

Auto-detection is based on lockfiles and config files (package.json, go.mod, Cargo.toml, etc.).

### Hook Lifecycle

```
Session Start                    During Work                      Task Complete
─────────────                    ───────────                      ─────────────
session-start.sh          ┌─── auto-format.sh                verify-on-stop.sh
  │                       │      (after every write)            │
  ├─ Set env vars         │                                     ├─ Build
  └─ Detect stack         ├─── block-dangerous.sh              ├─ Unit tests
                          │      (before bash commands)         ├─ Integration
                          │                                     ├─ E2E tests
                          ├─── protected-files.sh              ├─ Lint
                          │      (before file edits)            ├─ Type check
                          │                                     └─ Security audit
                          └─── task-notify.sh
                                 (after file changes)
```

### Daily Workflow

```
Morning:
  /daily-standup              <- 30-second project overview

Feature work:
  /plan add user auth         <- Claude plans, you approve
  -> "go"                     <- Claude implements autonomously
  /verify-app                 <- QA sweep (also runs auto on Stop)
  /commit-push-pr             <- ships it

Bug found:
  /fix-and-verify             <- Claude fixes, loops until green

Before merge:
  /code-review                <- multi-agent review
  /simplify                   <- clean up
```

### Customization

**Add your tech stack** — open `.claude/CLAUDE.md` and fill in the Quick Reference table.

**Adjust permissions** — edit `settings.local.json`:
```json
"permissions": { "allow": ["Bash(pnpm run *)", "Bash(docker compose *)"] }
```

**Add/remove hooks** — each hook in `settings.local.json` has a `matcher` and `command`. Remove entries to disable, add new ones to extend.

### Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI installed
- `jq` (required by hooks): `brew install jq` / `apt install jq`
- `gh` (optional, for PR commands): `brew install gh`
- Your project's formatter (Prettier, Ruff, gofmt, etc.) for auto-format to work

---

<a id="粵語-cantonese"></a>
## 粵語 Cantonese

### 呢個係乜嘢？

將 `.claude/` 資料夾複製入你嘅 project，Claude 即刻識得自動跑 test、lint、format，仲會擋住危險指令。支援 **Node.js、Python、Go、Rust、Ruby、Java 同 .NET** — 自動偵測，唔使設定。

### 點樣開始

```bash
# 方法一：直接複製成個 template
cp -r .claude/ /你嘅project路徑/.claude/

# 方法二：用 Kova 安裝器
cd /你嘅project路徑
bash /kova嘅路徑/install-kova.sh

# 方法三：裝之前睇下會安裝啲乜
bash /kova嘅路徑/install-kova.sh --dry-run
```

複製完之後，打開 `.claude/CLAUDE.md`，填好入面嘅 `[PROJECT: ...]` 位置（你嘅技術棧、package manager、source 目錄等等）。

### 入面有啲乜

#### Hooks（自動執行，唔使理）

Hook 係自動喺背景行嘅。你唔使叫佢哋 — 佢哋會自己響應 Claude 嘅動作。

| Hook | 幾時觸發 | 做啲乜 |
|------|----------|--------|
| `auto-format.sh` | 每次寫檔之後 | 自動 format（Prettier、Ruff、Black、gofmt、rustfmt、RuboCop 等） |
| `block-dangerous.sh` | 每次行 bash 之前 | 擋住 `rm -rf /`、`git push --force`、`DROP TABLE` 等危險指令 |
| `protected-files.sh` | 每次改檔之前 | 擋住改 `.env`、`.pem`、`id_rsa`、密碼等敏感檔案 |
| `verify-on-stop.sh` | Claude 完成任務嗰陣 | 行 build + test + lint + typecheck + 安全審計。唔過就唔俾停 |
| `session-start.sh` | 開始 session 嗰陣 | 根據偵測到嘅技術棧設定環境變數 |
| `task-notify.sh` | 改咗檔之後 | 推送通知（macOS/Linux） |
| `test-runner.sh` | 改咗檔之後 | 偵測 test 檔案嘅改動 |

#### 斜線指令（Slash Commands）

喺 Claude Code 入面打呢啲指令嚟觸發工作流程：

| 指令 | 做啲乜 |
|------|--------|
| `/plan` | 寫 code 之前先計劃。Claude 會探索 codebase，寫計劃，等你講 "go" |
| `/commit-push-pr` | 自動 stage 檔案、commit、push、開 draft PR |
| `/verify-app` | 完整 10 層 QA 檢查：test、lint、typecheck、瀏覽器檢查、安全 |
| `/fix-and-verify` | 自動修 bug。loop 到所有 test 過晒，或者試咗 3 次就問你 |
| `/code-review` | 開 4 個平行 reviewer（安全、邏輯、架構、測試） |
| `/simplify` | 清理 code，唔改行為 |
| `/daily-standup` | 工程報告：做咗乜、有乜阻住、下步做乜 |

**參考指令（coding standards）：**

| 指令 | 做啲乜 |
|------|--------|
| `/core-rules` | 核心編程原則 |
| `/typescript-rules` | TypeScript 最佳實踐 |
| `/error-handling` | 錯誤處理模式 |
| `/security-rules` | 安全同認證處理 |
| `/techdebt` | 掃描技術債務 |
| `/troubleshooting` | 常見問題同解決方法 |

### 支援嘅語言

| 語言 | Build | Test | Lint | Type Check | Format | 安全審計 |
|------|-------|------|------|------------|--------|----------|
| JS/TS | 有 | vitest, jest | eslint | tsc | prettier | npm/pnpm/yarn audit |
| Python | - | pytest | ruff, flake8 | mypy, pyright | ruff, black | pip-audit |
| Go | go build | go test | golangci-lint | go vet | gofmt | govulncheck |
| Rust | cargo build | cargo test | cargo clippy | cargo check | rustfmt | cargo audit |
| Ruby | - | rspec | rubocop | - | rubocop -a | bundle-audit |
| Java | mvn/gradle | mvn/gradle test | - | - | google-java-format | - |
| .NET | dotnet build | dotnet test | dotnet format | dotnet build | dotnet format | - |

自動偵測係根據 lockfile 同設定檔（package.json、go.mod、Cargo.toml 等）。

### 每日工作流程

```
朝早：
  /daily-standup              <- 30 秒 project 概覽

做 feature：
  /plan add user auth         <- Claude 計劃，你批准
  -> "go"                     <- Claude 自主實現
  /verify-app                 <- QA 檢查（Stop 嗰陣都會自動行）
  /commit-push-pr             <- 出貨

搵到 bug：
  /fix-and-verify             <- Claude 修到好為止

merge 之前：
  /code-review                <- 多 agent review
  /simplify                   <- 清理
```

### 自訂設定

**加你嘅技術棧** — 打開 `.claude/CLAUDE.md`，填好 Quick Reference 表。

**調整權限** — 改 `settings.local.json`：
```json
"permissions": { "allow": ["Bash(pnpm run *)", "Bash(docker compose *)"] }
```

### 系統要求

- 裝咗 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI
- `jq`（hook 需要）：`brew install jq` / `apt install jq`
- `gh`（可選，用嚟開 PR）：`brew install gh`

---

<a id="中文-chinese"></a>
## 中文 Chinese

### 这是什么？

将 `.claude/` 文件夹复制到任何项目中，Claude 立即获得编码标准、安全钩子和工作流命令。支持 **Node.js、Python、Go、Rust、Ruby、Java 和 .NET** — 自动检测，无需配置。

### 快速开始

```bash
# 方式一：复制整个模板到你的项目
cp -r .claude/ /你的项目路径/.claude/

# 方式二：使用 Kova 安装器
cd /你的项目路径
bash /kova路径/install-kova.sh

# 方式三：安装前预览
bash /kova路径/install-kova.sh --dry-run
```

复制完成后，打开 `.claude/CLAUDE.md`，填写其中的 `[PROJECT: ...]` 占位符（你的技术栈、包管理器、源码目录等）。

### 包含什么

#### 钩子（Hooks）— 自动执行，无需干预

钩子在后台自动运行。你无需调用它们 — 它们会自动响应 Claude 的操作。

| 钩子 | 触发时机 | 功能 |
|------|----------|------|
| `auto-format.sh` | 每次写文件后 | 自动格式化（Prettier、Ruff、Black、gofmt、rustfmt、RuboCop 等） |
| `block-dangerous.sh` | 每次执行 bash 前 | 阻止 `rm -rf /`、`git push --force`、`DROP TABLE` 等危险命令 |
| `protected-files.sh` | 每次编辑文件前 | 阻止编辑 `.env`、`.pem`、`id_rsa`、密码等敏感文件 |
| `verify-on-stop.sh` | Claude 完成任务时 | 运行 build + test + lint + typecheck + 安全审计。不通过则阻止停止 |
| `session-start.sh` | 会话开始时 | 根据检测到的技术栈设置环境变量 |
| `task-notify.sh` | 文件更改后 | 发送通知（macOS/Linux） |
| `test-runner.sh` | 文件更改后 | 检测测试文件的更改 |

#### 斜杠命令（Slash Commands）

在 Claude Code 中输入这些命令触发工作流：

| 命令 | 功能 |
|------|------|
| `/plan` | 编码前先规划。Claude 探索代码库，撰写计划，等待你说 "go" |
| `/commit-push-pr` | 自动暂存文件、commit、push、创建 draft PR |
| `/verify-app` | 完整 10 层 QA 检查：测试、lint、typecheck、浏览器检查、安全 |
| `/fix-and-verify` | 自动修复 bug。循环直到所有测试通过，或尝试 3 次后求助 |
| `/code-review` | 启动 4 个并行审查者（安全、逻辑、架构、测试） |
| `/simplify` | 清理代码，不改变行为 |
| `/daily-standup` | 工程报告：已完成、阻塞项、优先级 |

**参考命令（编码标准）：**

| 命令 | 功能 |
|------|------|
| `/core-rules` | 核心编程原则 |
| `/typescript-rules` | TypeScript 最佳实践 |
| `/error-handling` | 错误处理模式 |
| `/security-rules` | 安全和凭证处理 |
| `/techdebt` | 扫描技术债务 |
| `/troubleshooting` | 常见问题及解决方案 |

### 支持的语言

| 语言 | 构建 | 测试 | Lint | 类型检查 | 格式化 | 安全审计 |
|------|------|------|------|----------|--------|----------|
| JS/TS | 是 | vitest, jest | eslint | tsc | prettier | npm/pnpm/yarn audit |
| Python | - | pytest | ruff, flake8 | mypy, pyright | ruff, black | pip-audit |
| Go | go build | go test | golangci-lint | go vet | gofmt | govulncheck |
| Rust | cargo build | cargo test | cargo clippy | cargo check | rustfmt | cargo audit |
| Ruby | - | rspec | rubocop | - | rubocop -a | bundle-audit |
| Java | mvn/gradle | mvn/gradle test | - | - | google-java-format | - |
| .NET | dotnet build | dotnet test | dotnet format | dotnet build | dotnet format | - |

自动检测基于锁文件和配置文件（package.json、go.mod、Cargo.toml 等）。

### 每日工作流程

```
早上：
  /daily-standup              <- 30 秒项目概览

功能开发：
  /plan add user auth         <- Claude 规划，你批准
  -> "go"                     <- Claude 自主实现
  /verify-app                 <- QA 检查（Stop 时也会自动运行）
  /commit-push-pr             <- 交付

发现 bug：
  /fix-and-verify             <- Claude 修复直到全部通过

合并前：
  /code-review                <- 多 agent 审查
  /simplify                   <- 清理
```

### 自定义设置

**添加你的技术栈** — 打开 `.claude/CLAUDE.md`，填写 Quick Reference 表。

**调整权限** — 编辑 `settings.local.json`：
```json
"permissions": { "allow": ["Bash(pnpm run *)", "Bash(docker compose *)"] }
```

### 系统要求

- 已安装 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI
- `jq`（钩子需要）：`brew install jq` / `apt install jq`
- `gh`（可选，用于创建 PR）：`brew install gh`

---

## Project Structure

```
.claude/
  CLAUDE.md                   # Project instructions (customize this)
  settings.json               # Shared permissions
  settings.local.json         # Local hooks, plugins, overrides
  hooks/                      # 7 automated hooks
    lib/detect-stack.sh       # Shared language detection library
    auto-format.sh            # Format on save
    block-dangerous.sh        # Block destructive commands
    protected-files.sh        # Block edits to secrets
    verify-on-stop.sh         # Auto-test when Claude finishes
    session-start.sh          # Environment setup
    task-notify.sh            # File change notifications
    test-runner.sh            # Test file detection
  commands/                   # 18 slash commands
    plan.md, verify-app.md, commit-push-pr.md, fix-and-verify.md,
    code-review.md, simplify.md, daily-standup.md, core-rules.md,
    typescript-rules.md, error-handling.md, security-rules.md,
    code-cleanup.md, style-guide.md, troubleshooting.md, techdebt.md,
    worktree-workflow.md, plan-mode.md, framework-rules.md

kova/                   # Portable installer package
  install-kova.sh       # One-command installer (supports --dry-run)
  CLAUDE.md                   # Engineering culture doc
  README.md                   # Package docs
```

## License

MIT
