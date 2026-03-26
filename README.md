# Marinotta Skills

> A curated collection of skills for Claude Code

Welcome to **marinotta-skills** — a collection of reusable skills designed to enhance your Claude Code experience.

## 🚀 Getting Started

Each skill in this collection is designed to solve specific tasks or workflows. To use a skill, simply invoke it with the `/` command in Claude Code.

## 📦 Available Skills

| Skill | Description | Tech Stack |
|-------|-------------|------------|
| **exchange-rate** | Currency exchange rate converter and query tool. Query real-time rates, historical rates, and rate trends. Data source: Frankfurter API (ECB). | TypeScript, Bun |
| **prd-to-solution** | Generate technical solution documents from Product Requirements Documents (PRD). Creates comprehensive technical proposals for review. | TypeScript, Bun |

### exchange-rate

Query real-time and historical exchange rates via the Frankfurter API (European Central Bank data source).

**Features:**
- Real-time currency conversion
- Historical exchange rate lookup
- Exchange rate trend analysis over date ranges
- Support for 30+ major currencies
- Chinese and English currency names
- No API key required

**Usage:**
```bash
# Convert currency
bun skills/exchange-rate/scripts/exchange.ts convert --from USD --to CNY --amount 100

# Get latest rates
bun skills/exchange-rate/scripts/exchange.ts latest --from USD --to CNY,JPY,EUR

# Get historical rate
bun skills/exchange-rate/scripts/exchange.ts history --from USD --date 2025-06-15 --to CNY

# Get rate trend
bun skills/exchange-rate/scripts/exchange.ts series --from USD --start 2025-01-01 --end 2025-06-30 --to CNY

# List supported currencies
bun skills/exchange-rate/scripts/exchange.ts currencies
```

**Supported Currencies:** USD, CNY, EUR, GBP, JPY, KRW, HKD, SGD, AUD, CAD, THB, CHF, and more.

### prd-to-solution

Generate comprehensive technical solution documents from Product Requirements Documents (PRD) for technical review.

**Features:**
- Structured solution document template
- **Automatic project structure analysis** (`--analyze` flag)
- Tech stack auto-detection (languages, frameworks, databases)
- Architecture design guidance
- Implementation timeline planning
- Risk assessment checklist
- Cost estimation framework

**Usage:**
```bash
# Generate a solution document template
npx tsx skills/prd-to-solution/scripts/generate.ts "用户订单系统"

# Generate with automatic project structure analysis
npx tsx skills/prd-to-solution/scripts/generate.ts "用户订单系统" --analyze

# Analyze a specific project directory
npx tsx skills/prd-to-solution/scripts/generate.ts "用户订单系统" --analyze --project /path/to/project

# With custom version and author
npx tsx skills/prd-to-solution/scripts/generate.ts "支付中台" --version v2.0 --author "张三"
```

**Output:** `~/Documents/solution/{project_name}_技术方案_{timestamp}.md`

**In Claude Code:**
```
"根据这个 PRD 生成技术方案"
"帮我分析这份需求文档，输出评审用的技术方案"
"Review this PRD and create a technical solution document"
```

## 🛠️ Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/d3lap1ace/marinotta-skills.git
   ```

2. Copy the skills to your Claude Code skills directory

## 📝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built for [Claude Code](https://claude.com/claude-code) by Anthropic

---

Made with ❤️ by [d3lap1ace](https://github.com/d3lap1ace)
