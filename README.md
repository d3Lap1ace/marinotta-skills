# Marinotta Skills

> A curated collection of skills for Claude Code

Welcome to **marinotta-skills** — a collection of reusable skills designed to enhance your Claude Code experience.

## Getting Started

Each skill in this collection is designed to solve specific tasks or workflows. To use a skill, simply invoke it with the `/` command in Claude Code.

## Available Skills

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
- Structured solution document template (8 main sections)
- Architecture and sequence diagram templates
- Key design points (API changes, data models, async/idempotent, security, etc.)
- Change list grouped by project/module
- Test plan with interface test examples
- Risk assessment with rollback plan

**Template Structure:**
1. Background and Objectives
2. Scope of Changes
3. Current State Analysis (Optional)
4. Overall Solution (Architecture/Sequence Diagrams)
5. Key Design Points
6. Change List
7. Test Plan and Results
8. Risk Assessment

**Usage:**
```bash
# Generate a solution document template
npx tsx skills/prd-to-solution/scripts/generate.ts "User Order System"

# With basic project info
npx tsx skills/prd-to-solution/scripts/generate.ts "User Order System" --analyze

# With custom version and author
npx tsx skills/prd-to-solution/scripts/generate.ts "Payment Platform" --version v2.0 --author "John Doe"
```

**Output:** `~/Documents/solution/{project_name}_technical_solution_{timestamp}.md`

**In Claude Code:**
```
"Generate a technical solution from this PRD"
"Analyze this requirements document and output a technical solution for review"
"Review this PRD and create a technical solution document"
```

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/d3lap1ace/marinotta-skills.git
   ```

2. Copy the skills to your Claude Code skills directory

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Built for [Claude Code](https://claude.com/claude-code) by Anthropic

---

Made by [d3lap1ace](https://github.com/d3lap1ace)
