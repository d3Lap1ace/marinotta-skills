# Marinotta Skills

[English](./README.md) | 中文

一组可复用的技能，面向 Claude Code、Codex，以及兼容 `SKILL.md` 的本地技能加载器。

你可以把它作为 Claude Code plugin marketplace 使用，也可以只把需要的技能复制到本地环境。

## 技能

| 技能 | 用途 |
| --- | --- |
| `exchange-rate` | 汇率换算、最新汇率、历史汇率和趋势查询。 |
| `prd-to-solution` | 根据 PRD 生成完整技术方案文档。 |
| `auto-code-review` | 审查代码，并根据 Claude 反馈应用安全修复。 |
| `prd-solution-review` | 结合仓库上下文和需求，输出简洁的评审方案。 |
| `translate-en-zh` | 将英文网页、PDF、Markdown、HTML 和文本翻译成简体中文。 |

## Claude Code Marketplace

添加这个仓库作为 marketplace：

```text
/plugin marketplace add d3Lap1ace/marinotta-skills
```

市场插件安装清单：

目前市场里提供一个精简插件包；安装后按需调用具体技能。

| 插件 | 安装命令 |
| --- | --- |
| 全部 Marinotta skills | `/plugin install marinotta-skills@marinotta-skills` |

安装后，通过 plugin 命名空间调用技能：

```text
/marinotta-skills:exchange-rate
/marinotta-skills:prd-to-solution
/marinotta-skills:translate-en-zh
/marinotta-skills:auto-code-review
/marinotta-skills:prd-solution-review
```

## 示例

```text
/marinotta-skills:exchange-rate Convert 100 USD to CNY
/marinotta-skills:prd-to-solution Create a technical solution from this PRD
/marinotta-skills:auto-code-review Review my current git changes
/marinotta-skills:prd-solution-review Analyze this repo and draft a review-ready plan
/marinotta-skills:translate-en-zh Translate this saved HTML article into Chinese
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
.claude-plugin/         Claude Code marketplace 与 plugin manifest
commands/claude-code/   Slash command 模板
docs/                   安装与技能编写说明
scripts/                安装与校验脚本
skills/                 可复用技能包
```

每个技能的 agent 指令放在 `SKILL.md`，给人看的说明放在对应技能目录的 `README.md`。

## 校验

```bash
python3 scripts/validate.py
claude plugin validate .
```

## License

MIT。见 [LICENSE](LICENSE)。
