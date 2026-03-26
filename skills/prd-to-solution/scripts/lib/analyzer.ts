/**
 * Project Structure Analyzer
 *
 * Analyzes the current project directory to detect:
 * - Project type (frontend, backend, full-stack, monorepo)
 * - Tech stack (languages, frameworks, libraries)
 * - Directory structure
 * - Configuration files
 */

import fs from 'fs';
import path from 'path';

export interface ProjectInfo {
  name: string;
  type: ProjectType;
  techStack: TechStack;
  structure: ProjectStructure;
  metadata: ProjectMetadata;
}

export type ProjectType = 'frontend' | 'backend' | 'full-stack' | 'monorepo' | 'unknown';

export interface TechStack {
  languages: string[];
  frameworks: string[];
  databases: string[];
  buildTools: string[];
  testingFrameworks: string[];
  other: string[];
}

export interface ProjectStructure {
  root: string;
  directories: string[];
  entryPoints: string[];
  configFiles: string[];
}

export interface ProjectMetadata {
  packageJson?: Record<string, any>;
  hasGit: boolean;
  hasDocker: boolean;
  hasCI: boolean;
}

/**
 * Detect project type from structure and files
 */
function detectProjectType(structure: ProjectStructure, packageJson?: Record<string, any>): ProjectType {
  const dirs = structure.directories.map(d => d.toLowerCase());

  // Check for monorepo
  if (dirs.includes('packages') || dirs.includes('apps') || packageJson?.workspaces) {
    return 'monorepo';
  }

  // Check for frontend indicators
  const hasFrontend = dirs.some(d =>
    ['src', 'app', 'pages', 'components', 'public', 'assets'].includes(d)
  ) || packageJson?.dependencies?.['react'] ||
    packageJson?.dependencies?.['vue'] ||
    packageJson?.dependencies?.['next'] ||
    packageJson?.dependencies?.['nuxt'];

  // Check for backend indicators
  const hasBackend = dirs.some(d =>
    ['api', 'server', 'src', 'lib', 'controllers', 'models', 'services'].includes(d)
  ) || packageJson?.dependencies?.['express'] ||
    packageJson?.dependencies?.['fastify'] ||
    packageJson?.dependencies?.['koa'] ||
    packageJson?.dependencies?.['django'] ||
    packageJson?.dependencies?.['flask'] ||
    packageJson?.dependencies?.['spring'];

  if (hasFrontend && hasBackend) return 'full-stack';
  if (hasFrontend) return 'frontend';
  if (hasBackend) return 'backend';

  return 'unknown';
}

/**
 * Detect languages from files
 */
function detectLanguages(structure: ProjectStructure): string[] {
  const languages: string[] = [];
  const files = getAllFiles(structure.root, ['node_modules', '.git', 'dist', 'build']);

  const extMap: Record<string, string> = {
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript',
    '.js': 'JavaScript',
    '.jsx': 'JavaScript',
    '.py': 'Python',
    '.go': 'Go',
    '.java': 'Java',
    '.kt': 'Kotlin',
    '.rs': 'Rust',
    '.cpp': 'C++',
    '.c': 'C',
    '.cs': 'C#',
    '.php': 'PHP',
    '.rb': 'Ruby',
    '.swift': 'Swift',
    '.dart': 'Dart',
  };

  const detected = new Set<string>();
  for (const file of files) {
    const ext = path.extname(file);
    if (extMap[ext]) {
      detected.add(extMap[ext]);
    }
  }

  return Array.from(detected);
}

/**
 * Detect frameworks from package.json or other config files
 */
function detectFrameworks(structure: ProjectStructure, packageJson?: Record<string, any>): string[] {
  const frameworks: string[] = [];

  if (packageJson) {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    // Frontend frameworks
    if (deps['react']) frameworks.push('React');
    if (deps['vue']) frameworks.push('Vue.js');
    if (deps['next']) frameworks.push('Next.js');
    if (deps['nuxt']) frameworks.push('Nuxt.js');
    if (deps['angular']) frameworks.push('Angular');
    if (deps['svelte']) frameworks.push('Svelte');
    if (deps['solid-js']) frameworks.push('SolidJS');

    // Backend frameworks
    if (deps['express']) frameworks.push('Express.js');
    if (deps['fastify']) frameworks.push('Fastify');
    if (deps['koa']) frameworks.push('Koa');
    if (deps['nest']) frameworks.push('NestJS');
    if (deps['hapi']) frameworks.push('Hapi.js');
    if (deps['@nestjs/core']) frameworks.push('NestJS');
  }

  // Check for other framework indicators
  const files = structure.configFiles.map(f => f.toLowerCase());
  if (files.includes('django.settings') || files.includes('settings.py')) frameworks.push('Django');
  if (files.includes('application.properties') || files.includes('pom.xml')) frameworks.push('Spring Boot');
  if (files.includes('go.mod')) frameworks.push('Go Standard Library');

  return frameworks;
}

/**
 * Detect databases from configuration
 */
function detectDatabases(structure: ProjectStructure, packageJson?: Record<string, any>): string[] {
  const databases: string[] = [];

  if (packageJson) {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    if (deps['pg'] || deps['postgres']) databases.push('PostgreSQL');
    if (deps['mysql'] || deps['mysql2']) databases.push('MySQL');
    if (deps['mongodb'] || deps['mongoose']) databases.push('MongoDB');
    if (deps['redis']) databases.push('Redis');
    if (deps['sqlite3'] || deps['better-sqlite3']) databases.push('SQLite');
    if (deps['@prisma/client']) databases.push('Prisma (ORM)');
    if (deps['typeorm']) databases.push('TypeORM');
    if (deps['sequelize']) databases.push('Sequelize');
    if (deps['knex']) databases.push('Knex.js');
  }

  // Check for database config files
  const files = structure.configFiles.map(f => f.toLowerCase());
  if (files.includes('prisma')) databases.push('Prisma');
  if (files.includes('drizzle')) databases.push('Drizzle ORM');

  return [...new Set(databases)];
}

/**
 * Detect build tools
 */
function detectBuildTools(structure: ProjectStructure, packageJson?: Record<string, any>): string[] {
  const tools: string[] = [];

  if (packageJson) {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    if (deps['webpack']) tools.push('Webpack');
    if (deps['vite']) tools.push('Vite');
    if (deps['rollup']) tools.push('Rollup');
    if (deps['esbuild']) tools.push('esbuild');
    if (deps['parcel']) tools.push('Parcel');
    if (deps['turbo']) tools.push('Turbopack');
    if (deps['babel']) tools.push('Babel');
    if (deps['swc']) tools.push('SWC');
    if (deps['typescript']) tools.push('TypeScript Compiler');
    if (deps['tsup']) tools.push('tsup');
  }

  return tools;
}

/**
 * Detect testing frameworks
 */
function detectTestingFrameworks(structure: ProjectStructure, packageJson?: Record<string, any>): string[] {
  const frameworks: string[] = [];

  if (packageJson) {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    if (deps['jest']) frameworks.push('Jest');
    if (deps['vitest']) frameworks.push('Vitest');
    if (deps['mocha']) frameworks.push('Mocha');
    if (deps['jasmine']) frameworks.push('Jasmine');
    if (deps['karma']) frameworks.push('Karma');
    if (deps['@testing-library/react']) frameworks.push('Testing Library');
    if (deps['cypress']) frameworks.push('Cypress');
    if (deps['playwright']) frameworks.push('Playwright');
    if (deps['puppeteer']) frameworks.push('Puppeteer');
    if (deps['pytest']) frameworks.push('Pytest');
    if (deps['go test']) frameworks.push('Go Testing');
  }

  return frameworks;
}

/**
 * Get all files in directory recursively
 */
function getAllFiles(dirPath: string, exclude: string[] = []): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dirPath)) return files;

  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (exclude.some(excl => fullPath.includes(excl))) continue;
      files.push(...getAllFiles(fullPath, exclude));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Analyze project structure
 */
export function analyzeProject(projectPath: string = process.cwd()): ProjectInfo {
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = fs.existsSync(packageJsonPath)
    ? JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    : undefined;

  // Get directories
  const items = fs.readdirSync(projectPath);
  const directories = items.filter(item => {
    const fullPath = path.join(projectPath, item);
    const stat = fs.statSync(fullPath);
    return stat.isDirectory() && !item.startsWith('.');
  });

  // Get config files
  const configFiles = items.filter(item => {
    const fullPath = path.join(projectPath, item);
    const stat = fs.statSync(fullPath);
    return stat.isFile() && (item.includes('.') || item === 'package.json');
  });

  // Find entry points
  const entryPoints: string[] = [];
  if (packageJson) {
    if (packageJson.main) entryPoints.push(packageJson.main);
    if (packageJson.bin) entryPoints.push(...(Array.isArray(packageJson.bin) ? packageJson.bin : Object.values(packageJson.bin)));
  }

  const structure: ProjectStructure = {
    root: projectPath,
    directories,
    entryPoints,
    configFiles,
  };

  const projectType = detectProjectType(structure, packageJson);

  const techStack: TechStack = {
    languages: detectLanguages(structure),
    frameworks: detectFrameworks(structure, packageJson),
    databases: detectDatabases(structure, packageJson),
    buildTools: detectBuildTools(structure, packageJson),
    testingFrameworks: detectTestingFrameworks(structure, packageJson),
    other: [],
  };

  const metadata: ProjectMetadata = {
    packageJson,
    hasGit: fs.existsSync(path.join(projectPath, '.git')),
    hasDocker: fs.existsSync(path.join(projectPath, 'Dockerfile')),
    hasCI: fs.existsSync(path.join(projectPath, '.github')) ||
           fs.existsSync(path.join(projectPath, '.gitlab-ci.yml')) ||
           fs.existsSync(path.join(projectPath, 'circleci')),
  };

  return {
    name: packageJson?.name || path.basename(projectPath),
    type: projectType,
    techStack,
    structure,
    metadata,
  };
}

/**
 * Format project info as markdown
 */
export function formatProjectInfo(info: ProjectInfo): string {
  const lines: string[] = [];

  lines.push(`# 项目结构分析\n`);
  lines.push(`## 基本信息`);
  lines.push(`- **项目名称**: ${info.name}`);
  lines.push(`- **项目类型**: ${info.type}`);
  lines.push(`- **根目录**: ${info.structure.root}\n`);

  lines.push(`## 技术栈`);
  lines.push(`### 编程语言`);
  if (info.techStack.languages.length > 0) {
    info.techStack.languages.forEach(lang => lines.push(`- ${lang}`));
  } else {
    lines.push(`- 未检测到`);
  }
  lines.push(``);

  lines.push(`### 框架与库`);
  if (info.techStack.frameworks.length > 0) {
    info.techStack.frameworks.forEach(fw => lines.push(`- ${fw}`));
  } else {
    lines.push(`- 未检测到`);
  }
  lines.push(``);

  lines.push(`### 数据库`);
  if (info.techStack.databases.length > 0) {
    info.techStack.databases.forEach(db => lines.push(`- ${db}`));
  } else {
    lines.push(`- 未检测到`);
  }
  lines.push(``);

  lines.push(`### 构建工具`);
  if (info.techStack.buildTools.length > 0) {
    info.techStack.buildTools.forEach(tool => lines.push(`- ${tool}`));
  } else {
    lines.push(`- 未检测到`);
  }
  lines.push(``);

  lines.push(`### 测试框架`);
  if (info.techStack.testingFrameworks.length > 0) {
    info.techStack.testingFrameworks.forEach(fw => lines.push(`- ${fw}`));
  } else {
    lines.push(`- 未检测到`);
  }
  lines.push(``);

  lines.push(`## 目录结构`);
  lines.push(`\`\`\``);
  info.structure.directories.forEach(dir => lines.push(dir + '/'));
  lines.push(`\`\`\`\n`);

  lines.push(`## 元数据`);
  lines.push(`- **Git 仓库**: ${info.metadata.hasGit ? '✅' : '❌'}`);
  lines.push(`- **Docker**: ${info.metadata.hasDocker ? '✅' : '❌'}`);
  lines.push(`- **CI/CD**: ${info.metadata.hasCI ? '✅' : '❌'}`);

  return lines.join('\n');
}
