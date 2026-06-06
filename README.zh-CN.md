# Marinotta Skills

[English](./README.md) | 中文

一个精简的 Claude Code plugin marketplace，用来分发可复用技能。

## 技能

| 技能 | 用途 |
| --- | --- |
| `exchange-rate` | 汇率换算、最新汇率、历史汇率和趋势查询。 |
| `auto-code-review` | 审查代码，并根据 Claude 反馈应用安全修复。 |
| `prd-solution-review` | 结合仓库上下文和需求，输出简洁的评审方案。 |
| `translate-en-zh` | 将英文网页、PDF、Markdown、HTML 和文本翻译成简体中文。 |

## 从 Claude Code 安装

添加 marketplace：

```text
/plugin marketplace add d3Lap1ace/marinotta-skills
```

只安装你需要的插件：

| 插件 | 安装命令 |
| --- | --- |
| `exchange-rate` | `/plugin install exchange-rate@marinotta-skills` |
| `auto-code-review` | `/plugin install auto-code-review@marinotta-skills` |
| `prd-solution-review` | `/plugin install prd-solution-review@marinotta-skills` |
| `translate-en-zh` | `/plugin install translate-en-zh@marinotta-skills` |

## 示例

```text
/exchange-rate Convert 100 USD to CNY
/auto-code-review Review my current git changes
/prd-solution-review Analyze this repo and draft a review-ready plan
/translate-en-zh Translate this saved HTML article into Chinese
```

## 本地安装

安装全部支持的本地目标：

```bash
python3 scripts/install.py all
```

安装单个目标：

```bash
python3 scripts/install.py claude-code
python3 scripts/install.py codex
python3 scripts/install.py agents
```

只预览，不复制文件：

```bash
python3 scripts/install.py all --dry-run
```

## 目录

```text
.claude-plugin/              Marketplace manifest
commands/claude-code/        Slash command 模板
docs/                        安装与技能编写说明
scripts/                     安装与校验脚本
skills/<name>/SKILL.md       单技能 plugin 根目录
```

每个技能的 agent 指令放在 `SKILL.md`，给人看的说明放在对应技能目录的 `README.md`。

## 校验

```bash
python3 scripts/validate.py
claude plugin validate --strict .
```

## License

MIT。见 [LICENSE](LICENSE)。
