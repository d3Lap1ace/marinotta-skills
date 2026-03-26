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

### 1. 项目概述 (Project Overview)
- Background and objectives
- Scope and boundaries
- Key stakeholders

### 2. 需求分析 (Requirements Analysis)
- Functional requirements
- Non-functional requirements
- User stories and use cases
- Acceptance criteria

### 3. 技术方案 (Technical Solution)
- System architecture
- Component design
- Data models
- API design
- Integration points

### 4. 技术栈 (Tech Stack)
- Frontend technologies
- Backend technologies
- Database and storage
- Infrastructure and DevOps
- Third-party services

### 5. 实施计划 (Implementation Plan)
- Development phases
- Milestones and deliverables
- Timeline estimates
- Resource allocation

### 6. 风险评估 (Risk Assessment)
- Technical risks
- Schedule risks
- Resource risks
- Mitigation strategies

### 7. 成本估算 (Cost Estimation)
- Development effort
- Infrastructure costs
- Ongoing maintenance

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

When using the `--analyze` flag, the skill will:
- Scan the project directory structure
- Detect programming languages (TypeScript, Python, Go, etc.)
- Identify frameworks (React, Vue, Express, Django, etc.)
- Find databases and ORMs (PostgreSQL, MongoDB, Prisma, etc.)
- List build tools and testing frameworks
- Include detected tech stack in the solution document
- Append a project structure analysis appendix

This is especially useful when:
- Creating technical solutions for existing projects
- Documenting current architecture before changes
- Onboarding new developers to the team
- Creating architecture decision records (ADRs)

## References

- `templates/solution-template.md` - Standard solution document template
- `references/tech-stack-guide.md` - Technology selection guidelines
- `references/risk-checklist.md` - Common risks and mitigation strategies

## Notes

- This skill creates structured documents suitable for technical review meetings
- Supports both Chinese and English PRD documents
- **Project analysis automatically detects**: languages, frameworks, databases, build tools, testing frameworks
- Automatically timestamps output files for version tracking
- Encourages iterative refinement through follow-up questions
- Use `--analyze` flag to leverage existing project structure in solution documents
