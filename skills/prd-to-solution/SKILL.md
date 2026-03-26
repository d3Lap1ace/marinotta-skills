---
name: prd-to-solution
description: >
  Generate technical solution documents from Product Requirements Documents (PRD).
  Creates comprehensive technical proposals for review, including architecture, tech stack, timeline, and risks.
  Output directory: ~/Documents/solution/
  Trigger words: PRD, 技术方案, 评审, 需求文档, 产品文档, solution, technical design, architecture
---

# prd-to-solution — PRD to Technical Solution Generator

Generate comprehensive technical solution documents from Product Requirements Documents (PRD) for technical review.

## Quick Start

1. Provide your PRD content (file path, URL, or direct text)
2. Optionally, use `--analyze` flag to include automatic project structure analysis
3. Claude will analyze and generate a structured technical solution
4. Output files are saved to `~/Documents/solution/`

## Workflow

1. **Parse PRD**: Extract key requirements, features, constraints, and success criteria
2. **Analyze Project** (optional): Scan current project structure and detect tech stack
3. **Analyze Requirements**: Identify functional and non-functional requirements
4. **Design Architecture**: Propose system architecture and component design
5. **Select Tech Stack**: Recommend appropriate technologies based on project analysis
6. **Estimate Timeline**: Break down phases and provide time estimates
7. **Identify Risks**: List potential risks and mitigation strategies
8. **Generate Document**: Create a structured solution document in Markdown

## Output Structure

Generated solution documents include:

### 1. 背景和目标
- 项目背景说明
- 改动目标
- 成功标准

### 2. 改动范围
- 包含的功能模块
- 不包含的内容说明

### 3. 现状梳理（可选）
- 当前架构描述
- 存在问题分析

### 4. 总体方案
- 架构设计（架构图）
- 时序图
- 核心流程说明

### 5. 关键设计点
- **接口变更**（可选）
  - HTTP/RPC 接口定义
  - 请求/响应参数
  - 兼容策略
- **数据模型/表结构变更**（可选）
  - DDL 语句
  - 索引设计
  - 数据迁移方案
- **异步/任务/幂等/重试**（可选）
  - 异步任务配置
  - 幂等设计
  - 重试策略
- **权限/审计/安全**（可选）
  - 权限设计
  - 审计日志
  - 安全方案
- **服务角色职责**（可选）
- **上下游依赖**（可选）

### 6. 改动清单
- 按项目分组的改动列表
- 模块/包路径
- 配置变更
- 依赖变更

### 7. 测试计划与结果
- 测试范围
- 接口测试示例（含入参/出参）
- 本地测试结果
- CI 测试结果

### 8. 风险评估
- 技术风险
- 业务风险
- 进度风险
- 回滚方案

## Output Location

All generated solution documents are saved to:
```
~/Documents/solution/
└── {project_name}_技术方案_{timestamp}.md
```

## Usage Examples

### Using the script directly:
```bash
# Generate solution template
npx tsx skills/prd-to-solution/scripts/generate.ts "用户订单系统"

# Generate with project structure analysis
npx tsx skills/prd-to-solution/scripts/generate.ts "用户订单系统" --analyze

# Analyze a specific project
npx tsx skills/prd-to-solution/scripts/generate.ts "用户订单系统" --analyze --project /path/to/project
```

### In Claude Code:
```
"根据这个 PRD 生成技术方案"
"帮我分析这份需求文档，输出评审用的技术方案"
"基于当前项目结构和这份 PRD，创建技术方案"
"Review this PRD and create a technical solution document with project analysis"
```

## Project Analysis Feature

When using the `--analyze` flag, the skill will scan the current project structure and include basic project information (project name, directory structure) in the solution document appendix.

This is especially useful when:
- Creating technical solutions for existing projects
- Documenting current architecture before changes
- Understanding project context for design decisions

## References

- `references/solution-template.md` - Standard solution document template

## Notes

- This skill creates structured documents suitable for technical review meetings
- Supports both Chinese and English PRD documents
- Template focuses on practical technical review points (architecture, design changes, testing, risks)
- Automatically timestamps output files for version tracking
- Encourages iterative refinement through follow-up questions
- Use `--analyze` flag to include basic project structure information
