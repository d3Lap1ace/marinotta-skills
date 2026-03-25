---
name: exchange-rate
description: >
  Currency exchange rate converter and query tool. Query real-time rates, historical rates, and rate trends.
  Data source: Frankfurter API (European Central Bank).
  Trigger words: 汇率, exchange rate, convert, 换算, USD, EUR, CNY, JPY, GBP,
  or any input matching "[amount] [currencyA] to/转/换 [currencyB]" format.
---

# exchange-rate — Currency Exchange Rate Skill

Query real-time and historical exchange rates via the Frankfurter API (European Central Bank data source).

## Quick Start

1. No API key required
2. Run `bun scripts/exchange.ts --help` to see all available commands
3. Reference `references/command-map.md` for detailed command mapping

## Workflow

1. Parse user intent — identify source currency, target currency, amount, and date (if any)
2. Select the appropriate command: `convert`, `latest`, `history`, `series`, or `currencies`
3. Execute the script and return the result
4. For natural language queries like "100 USD to CNY" or "100美元换人民币", use the `convert` command with `--amount 100 --from USD --to CNY`

## Commands

See `references/command-map.md` for complete command mapping and usage details.

## Common Currency Aliases

When users use Chinese currency names, map them to ISO codes:
- 美元/美金 → USD
- 人民币/元 → CNY
- 欧元 → EUR
- 英镑 → GBP
- 日元/日币 → JPY
- 韩元/韩币 → KRW
- 港币/港元 → HKD
- 新加坡元/新币 → SGD
- 澳元/澳币 → AUD
- 加元/加币 → CAD
- 泰铢 → THB
- 瑞士法郎/瑞郎 → CHF

## Notes

- This skill is script-first and does not run an MCP server
- Data source: ECB (European Central Bank), updated once per working day
- Supports 30+ major currencies
- No API key required
- All responses are returned in JSON format for easy parsing
