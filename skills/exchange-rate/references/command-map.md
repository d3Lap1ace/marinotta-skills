# Command Map

## Available Commands

| Command | Description | Required Flags | Optional Flags |
| --- | --- | --- | --- |
| `convert` | Convert an amount between currencies | `--from`, `--to` | `--amount`, `--date` |
| `latest` | Show latest exchange rates for a base currency | `--from` | `--to` |
| `history` | Show exchange rate on a specific date | `--from`, `--date` | `--to` |
| `series` | Show exchange rate trend over a date range | `--from`, `--start`, `--end` | `--to` |
| `currencies` | List all supported currencies | - | - |

## Flag Details

| Flag | Format | Example | Description |
| --- | --- | --- | --- |
| `--from` | ISO 4217 currency code | `USD`, `CNY`, `EUR` | Source currency code |
| `--to` | One or more codes, comma-separated | `CNY`, `CNY,JPY,EUR` | Target currency code(s) |
| `--amount` | Positive number | `100`, `1500.50` | Amount to convert (default: 1) |
| `--date` | `YYYY-MM-DD` | `2025-06-15` | Specific date for historical rate |
| `--start` | `YYYY-MM-DD` | `2025-01-01` | Start date for series query |
| `--end` | `YYYY-MM-DD` | `2025-01-31` | End date for series query |

## Exit Codes

| Code | Meaning |
| --- | --- |
| `0` | Success |
| `2` | Input or configuration error (invalid currency code, bad date format, etc.) |
| `3` | Network / timeout / HTTP transport error |
| `4` | API business error |
| `5` | Unexpected internal error |

## API Information

**Base URL**: `https://api.frankfurter.dev/v1`

**Available Endpoints**:
- `/latest` - Latest exchange rates
- `/{date}` - Historical rates for a specific date
- `/{start}..{end}` - Time series rates for a date range
- `/currencies` - List of all supported currencies

**Features**:
- No API key required
- Data source: European Central Bank (ECB)
- Update frequency: Once per working day
- Supported currencies: 30+ major world currencies

## Usage Examples

```bash
# Convert currency
bun scripts/exchange.ts convert --from USD --to CNY --amount 100

# Get latest rates
bun scripts/exchange.ts latest --from USD --to CNY,JPY,EUR

# Get historical rate
bun scripts/exchange.ts history --from USD --date 2025-06-15 --to CNY

# Get rate trend over time
bun scripts/exchange.ts series --from USD --start 2025-01-01 --end 2025-06-30 --to CNY

# List all supported currencies
bun scripts/exchange.ts currencies
```
