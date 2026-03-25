# Marinotta Skills

> A curated collection of skills for Claude Code

Welcome to **marinotta-skills** — a collection of reusable skills designed to enhance your Claude Code experience.

## 🚀 Getting Started

Each skill in this collection is designed to solve specific tasks or workflows. To use a skill, simply invoke it with the `/` command in Claude Code.

## 📦 Available Skills

| Skill | Description | Tech Stack |
|-------|-------------|------------|
| **exchange-rate** | Currency exchange rate converter and query tool. Query real-time rates, historical rates, and rate trends. Data source: Frankfurter API (ECB). | TypeScript, Bun |

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
