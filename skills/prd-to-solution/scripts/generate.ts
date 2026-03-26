#!/usr/bin/env bun
/**
 * PRD to Solution Generator
 *
 * Generate technical solution documents from Product Requirements Documents.
 * Output: ~/Documents/solution/{project_name}_技术方案_{timestamp}.md
 *
 * Options:
 *   --analyze    Analyze current project structure and include in solution
 *   --project    Path to project directory (default: current directory)
 */

import fs from 'fs';
import path from 'path';
import { analyzeProject, formatProjectInfo } from './lib/analyzer.js';

const SOLUTION_DIR = '/Users/lvhang/Documents/solution';
// Template path relative to script location
const TEMPLATE_PATH = path.join('skills', 'prd-to-solution', 'templates', 'solution-template.md');

interface SolutionConfig {
  projectName: string;
  version?: string;
  date?: string;
  author?: string;
  analyze?: boolean;
  projectPath?: string;
}

/**
 * Get current timestamp in format YYYYMMDD-HHmmss
 */
function getTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

/**
 * Get current date in Chinese format
 */
function getChineseDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}年${month}月${day}日`;
}

/**
 * Load template file
 */
function loadTemplate(): string {
  try {
    const templatePath = path.join(process.cwd(), TEMPLATE_PATH);
    return fs.readFileSync(templatePath, 'utf-8');
  } catch (error) {
    console.error(`Error loading template: ${error}`);
    process.exit(1);
  }
}

/**
 * Format tech stack for solution document
 */
function formatTechStack(info: ReturnType<typeof analyzeProject>): string {
  const lines: string[] = [];

  lines.push(`### 前端技术`);
  if (info.type === 'frontend' || info.type === 'full-stack') {
    info.techStack.languages.filter(l => ['JavaScript', 'TypeScript'].includes(l)).forEach(lang => {
      lines.push(`| ${lang} | | 核心语言`);
    });
    info.techStack.frameworks.filter(f =>
      ['React', 'Vue.js', 'Next.js', 'Nuxt.js', 'Angular', 'Svelte'].includes(f)
    ).forEach(fw => {
      lines.push(`| ${fw} | | UI 框架`);
    });
  }
  if (lines.length === 0) lines.push(`| - | - | -`);
  lines.push(``);

  lines.push(`### 后端技术`);
  if (info.type === 'backend' || info.type === 'full-stack') {
    info.techStack.languages.filter(l => !['JavaScript', 'TypeScript'].includes(l)).forEach(lang => {
      lines.push(`| ${lang} | | 服务端语言`);
    });
    info.techStack.frameworks.filter(f =>
      ['Express.js', 'Fastify', 'Koa', 'NestJS', 'Django', 'Spring Boot'].includes(f)
    ).forEach(fw => {
      lines.push(`| ${fw} | | 后端框架`);
    });
  }
  if (lines.length === 0) lines.push(`| - | - | -`);
  lines.push(``);

  lines.push(`### 数据存储`);
  if (info.techStack.databases.length > 0) {
    info.techStack.databases.forEach(db => {
      lines.push(`| ${db} | | ${db.includes('ORM') ? '数据访问层' : '数据存储'}`);
    });
  } else {
    lines.push(`| - | - | -`);
  }
  lines.push(``);

  lines.push(`### 基础设施`);
  if (info.metadata.hasDocker) lines.push(`| Docker | | 容器化`);
  if (info.metadata.hasCI) lines.push(`| GitHub Actions | | CI/CD`);
  if (lines.length <= 2) lines.push(`| - | | |`);

  return lines.join('\n');
}

/**
 * Generate solution document
 */
function generateSolution(config: SolutionConfig): string {
  const template = loadTemplate();

  const replacements: Record<string, string> = {
    '{项目名称}': config.projectName,
    '{生成日期}': config.date || getChineseDate(),
    '{版本}': config.version || 'v1.0',
    '{作者}': config.author || '技术团队',
  };

  let solution = template;
  for (const [key, value] of Object.entries(replacements)) {
    solution = solution.replace(new RegExp(escapeRegExp(key), 'g'), value);
  }

  // If analyze flag is set, append project analysis
  if (config.analyze) {
    const projectPath = config.projectPath || process.cwd();
    const projectInfo = analyzeProject(projectPath);

    const analysisSection = `
---

## 附录：项目结构分析

${formatProjectInfo(projectInfo)}

---

> *以上项目结构分析基于当前项目目录自动生成*
`;

    solution += analysisSection;

    // Try to fill in tech stack section
    const techStackSection = formatTechStack(projectInfo);
    solution = solution.replace(
      /### 前端技术[\s\S]*?### 后端技术[\s\S]*?### 数据存储[\s\S]*?### 基础设施[\s\S]*?(?=\n##)/,
      techStackSection.slice(0, -1) + '\n\n'
    );
  }

  return solution;
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Save solution document
 */
function saveSolution(content: string, projectName: string): string {
  // Ensure solution directory exists
  if (!fs.existsSync(SOLUTION_DIR)) {
    fs.mkdirSync(SOLUTION_DIR, { recursive: true });
  }

  // Generate filename
  const filename = `${projectName}_技术方案_${getTimestamp()}.md`;
  const filepath = path.join(SOLUTION_DIR, filename);

  // Write file
  fs.writeFileSync(filepath, content, 'utf-8');

  return filepath;
}

/**
 * Display usage
 */
function showUsage(): void {
  console.log(`
PRD to Solution Generator

Usage:
  bun scripts/generate.ts <project-name> [options]

Arguments:
  project-name    Name of the project (required)

Options:
  --analyze       Analyze current project structure and include in solution
  --project <dir> Path to project directory (default: current directory)
  --version <ver> Solution version (default: v1.0)
  --author <name> Author name (default: 技术团队)

Examples:
  # Generate solution template
  bun scripts/generate.ts 用户订单系统

  # Generate with project analysis
  bun scripts/generate.ts 用户订单系统 --analyze

  # Analyze specific project
  bun scripts/generate.ts 用户订单系统 --analyze --project /path/to/project

  # With custom version and author
  bun scripts/generate.ts 支付中台 --version v2.0 --author "张三"

Output:
  ~/Documents/solution/{project_name}_技术方案_{timestamp}.md
  `);
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
    showUsage();
    process.exit(0);
  }

  const projectName = args[0];
  const analyze = args.includes('--analyze');
  const version = args.includes('--version') ? args[args.indexOf('--version') + 1] : undefined;
  const author = args.includes('--author') ? args[args.indexOf('--author') + 1] : undefined;
  const projectPath = args.includes('--project') ? args[args.indexOf('--project') + 1] : undefined;

  const config: SolutionConfig = {
    projectName,
    version,
    author,
    analyze,
    projectPath,
  };

  const solution = generateSolution(config);
  const filepath = saveSolution(solution, projectName);

  console.log(`✅ 技术方案已生成:`);
  console.log(`   ${filepath}`);

  if (analyze) {
    console.log(`\n📊 项目结构分析已包含在方案中`);
    const analyzedPath = projectPath || process.cwd();
    console.log(`   分析目录: ${analyzedPath}`);
  }

  console.log(`\n请根据 PRD 内容完善以下章节:`);
  console.log(`   - 项目概述`);
  console.log(`   - 需求分析`);
  console.log(`   - 技术方案`);
  console.log(`   - 实施计划`);
  console.log(`   - 风险评估`);
  console.log(`   - 成本估算`);
}

// Run main
main();
