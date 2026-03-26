#!/usr/bin/env bun
/**
 * PRD to Solution Generator
 *
 * Generate technical solution documents from Product Requirements Documents.
 * Output: ~/Documents/solution/{project_name}_技术方案_{timestamp}.md
 *
 * Options:
 *   --analyze    Include basic project structure information
 *   --project    Path to project directory (default: current directory)
 */

import fs from 'fs';
import path from 'path';

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
 * Get basic project information
 */
function getProjectInfo(projectPath: string): { name: string; directories: string[] } {
  const packageJsonPath = path.join(projectPath, 'package.json');
  let projectName = path.basename(projectPath);

  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      if (packageJson.name) {
        projectName = packageJson.name;
      }
    } catch {
      // Use directory name as fallback
    }
  }

  const directories: string[] = [];
  try {
    const items = fs.readdirSync(projectPath);
    for (const item of items) {
      const fullPath = path.join(projectPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory() && !item.startsWith('.')) {
        directories.push(item);
      }
    }
  } catch {
    // Ignore errors
  }

  return { name: projectName, directories };
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

  // If analyze flag is set, append basic project info
  if (config.analyze) {
    const projectPath = config.projectPath || process.cwd();
    const projectInfo = getProjectInfo(projectPath);

    const analysisSection = `

---

## 附录：项目基本信息

**项目名称**: ${projectInfo.name}
**项目路径**: ${projectPath}

**目录结构**:
\`\`\`
${projectInfo.directories.map(d => d + '/').join('\n')}
\`\`\`

---

> *以上项目信息基于当前项目目录自动生成*
`;

    solution += analysisSection;
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
  --analyze       Include basic project structure information
  --project <dir> Path to project directory (default: current directory)
  --version <ver> Solution version (default: v1.0)
  --author <name> Author name (default: 技术团队)

Examples:
  # Generate solution template
  bun scripts/generate.ts 用户订单系统

  # Generate with basic project info
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
    console.log(`\n📊 项目基本信息已包含在方案中`);
    const analyzedPath = projectPath || process.cwd();
    console.log(`   分析目录: ${analyzedPath}`);
  }

  console.log(`\n请根据 PRD 内容完善以下章节:`);
  console.log(`   - 1. 背景和目标`);
  console.log(`   - 2. 改动范围`);
  console.log(`   - 3. 现状梳理（可选）`);
  console.log(`   - 4. 总体方案（架构图/时序图）`);
  console.log(`   - 5. 关键设计点`);
  console.log(`   - 6. 改动清单`);
  console.log(`   - 7. 测试计划与结果`);
  console.log(`   - 8. 风险评估`);
}

// Run main
main();
