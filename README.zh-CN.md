# Marinotta Skills

<p align="center">
  <a href="./README.md"><img src="https://img.shields.io/badge/English-0B6EFD?style=for-the-badge" alt="English"></a>
  <a href="./README.zh-CN.md"><img src="https://img.shields.io/badge/%E4%B8%AD%E6%96%87-111827?style=for-the-badge" alt="中文"></a>
</p>

一组可复用的 agent 技能，面向 Claude Code、Codex，以及兼容 `SKILL.md` 的本地技能加载器。

你可以把这个仓库作为 Claude Code plugin marketplace 安装，也可以只复制其中某个技能到自己的本地环境。

## 技能列表

| 技能 | 用途 | 技术栈 |
| --- | --- | --- |
| `exchange-rate` | 查询实时汇率、历史汇率和汇率趋势。 | TypeScript, Bun |
| `prd-to-solution` | 根据 PRD 生成完整的技术方案文档。 | TypeScript, Bun |
| `auto-code-review` | 使用 Claude 反馈审查代码，并在安全时自动修复。 | Markdown workflow |
| `prd-solution-review` | 结合项目结构和需求，输出简洁的评审用实现方案。 | Markdown workflow |
| `translate-en-zh` | 将英文网页、PDF、Markdown、HTML 和纯文本翻译成自然的简体中文稿件。 | Python helper |

每个技能都放在 `skills/<name>/` 下。`SKILL.md` 面向 agent 行为，技能目录里的 `README.md` 面向人类阅读。

## 安装

### Claude Code Plugin Marketplace

在 Claude Code 中添加这个仓库作为 plugin marketplace：

```text
/plugin marketplace add d3Lap1ace/marinotta-skills
```

安装插件：

```text
/plugin install marinotta-skills@marinotta-skills
```

安装后，技能会带有 plugin 命名空间，例如：

```text
/marinotta-skills:translate-en-zh
/marinotta-skills:auto-code-review
```

### 本地安装脚本

安装全部支持的目标：

```bash
python3 scripts/install.py all
```

只安装 Claude Code 命令：

```bash
python3 scripts/install.py claude-code
```

只安装 Codex 或 agent-style 技能：

```bash
python3 scripts/install.py codex
python3 scripts/install.py agents
```

只预览安装动作，不复制文件：

```bash
python3 scripts/install.py all --dry-run
```

使用 `--force` 可以覆盖已有安装。

## 目录结构

```text
.claude-plugin/         Claude Code plugin marketplace 与 plugin manifest
commands/claude-code/   Claude Code slash command 模板
docs/                   安装、兼容性和技能编写说明
scripts/                安装与校验脚本
skills/                 可复用技能包
```

## 校验

```bash
python3 scripts/validate.py
```

或：

```bash
npm run validate
```

## 使用提示

`exchange-rate` 和 `prd-to-solution` 带有 TypeScript 命令脚本。可以使用 Bun 或 `npx tsx` 运行，具体命令见对应技能文档。

`translate-en-zh` 带有 Python 提取脚本，可处理本地 Markdown、纯文本、保存的 HTML 和 PDF。PDF 提取需要安装 `pypdf`、`pdfminer.six` 或 `pymupdf` 中任意一个可选依赖。

## License

本项目使用 MIT License，见 [LICENSE](LICENSE)。
