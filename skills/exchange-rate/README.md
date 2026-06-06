# exchange-rate

Query real-time and historical exchange rates via the Frankfurter API, which uses European Central Bank data.

## Use When

- You need currency conversion without an API key.
- You need historical exchange rates.
- You need exchange-rate trends over a date range.
- Users ask in English or Chinese currency names.

## Script Usage

```bash
bun skills/exchange-rate/scripts/exchange.ts convert --from USD --to CNY --amount 100
bun skills/exchange-rate/scripts/exchange.ts latest --from USD --to CNY,JPY,EUR
bun skills/exchange-rate/scripts/exchange.ts history --from USD --date 2025-06-15 --to CNY
bun skills/exchange-rate/scripts/exchange.ts series --from USD --start 2025-01-01 --end 2025-06-30 --to CNY
bun skills/exchange-rate/scripts/exchange.ts currencies
```

## Contents

```text
SKILL.md
package.json
references/command-map.md
scripts/exchange.ts
scripts/lib/
tsconfig.json
```
