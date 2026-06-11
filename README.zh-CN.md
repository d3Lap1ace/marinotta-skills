# Marinotta Skills

[English](./README.md) | 中文

一个精简的可复用技能集合，适用于各类 coding agent。

## 技能

| 技能 | 用途 |
| --- | --- |
| `exchange-rate` | 汇率换算、最新汇率、历史汇率和趋势查询。 |
| `medium-track` | 用你自己的 sid cookie 抓取 Medium 文章，会话内输出简体中文译文与要点摘要。 |
| `prd-solution-review` | 结合仓库上下文和需求，输出简洁的评审方案。 |
| `translate-en-zh` | 将英文网页、PDF、Markdown、HTML 和文本翻译成简体中文。 |

## 安装

使用 [skills CLI](https://skills.sh) 安装（支持 Claude Code、Codex、Cursor 等 40+ 种 agent）：

```bash
npx skills add d3Lap1ace/marinotta-skills
```

免交互安装全部技能：

```bash
npx skills add d3Lap1ace/marinotta-skills --skill '*'
```

只安装你需要的技能：

| 技能 | 安装命令 |
| --- | --- |
| `exchange-rate` | `npx skills add d3Lap1ace/marinotta-skills --skill exchange-rate` |
| `medium-track` | `npx skills add d3Lap1ace/marinotta-skills --skill medium-track` |
| `prd-solution-review` | `npx skills add d3Lap1ace/marinotta-skills --skill prd-solution-review` |
| `translate-en-zh` | `npx skills add d3Lap1ace/marinotta-skills --skill translate-en-zh` |

加 `-g` 可安装到全局（用户级）而不是当前项目。

## 示例

```text
/exchange-rate Convert 100 USD to CNY
/medium-track https://medium.com/<author>/<slug>
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
