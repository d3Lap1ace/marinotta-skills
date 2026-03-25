#!/usr/bin/env bun
/**
 * Exchange Rate CLI - Main entry point
 *
 * Usage:
 *   bun scripts/exchange.ts convert --from USD --to CNY --amount 100
 *   bun scripts/exchange.ts latest --from USD --to CNY,JPY
 *   bun scripts/exchange.ts history --from USD --date 2025-06-15 --to CNY
 *   bun scripts/exchange.ts series --from USD --start 2025-01-01 --end 2025-06-30 --to CNY
 *   bun scripts/exchange.ts currencies
 */

import * as commands from './lib/commands.js';
import { CliError, ERROR_CODES } from './lib/config.js';

interface ParsedArgs {
  command: string;
  flags: Record<string, string>;
}

/**
 * Parse command line arguments
 */
function parseArgs(args: string[]): ParsedArgs {
  const command = args[0];
  const flags: Record<string, string> = {};

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[++i];
      if (value !== undefined && !value.startsWith('--')) {
        flags[key] = value;
      }
    }
  }

  return { command, flags };
}

/**
 * Display help message
 */
function showHelp(): void {
  console.log(`
Exchange Rate CLI - Query currency exchange rates

Usage:
  bun scripts/exchange.ts <command> [flags]

Commands:
  convert     Convert an amount between currencies
  latest      Show latest exchange rates for a base currency
  history     Show exchange rate on a specific date
  series      Show exchange rate trend over a date range
  currencies  List all supported currencies

Flags:
  --from <code>    Source currency code (e.g., USD, CNY, EUR)
  --to <code>      Target currency code(s), comma-separated (e.g., CNY,JPY,EUR)
  --amount <num>   Amount to convert (default: 1)
  --date <date>    Specific date in YYYY-MM-DD format
  --start <date>   Start date for series query in YYYY-MM-DD format
  --end <date>     End date for series query in YYYY-MM-DD format

Examples:
  # Convert currency
  bun scripts/exchange.ts convert --from USD --to CNY --amount 100

  # Get latest rates
  bun scripts/exchange.ts latest --from USD --to CNY,JPY,EUR

  # Get historical rate
  bun scripts/exchange.ts history --from USD --date 2025-06-15 --to CNY

  # Get rate trend
  bun scripts/exchange.ts series --from USD --start 2025-01-01 --end 2025-06-30 --to CNY

  # List currencies
  bun scripts/exchange.ts currencies

For more details, see references/command-map.md
  `);
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    process.exit(0);
  }

  const { command, flags } = parseArgs(args);

  try {
    let result: unknown;

    switch (command) {
      case 'convert': {
        const { from, to, amount, date } = flags;
        if (!from || !to) {
          throw new CliError(ERROR_CODES.INPUT_ERROR, 'convert command requires --from and --to flags');
        }
        result = await commands.convertCurrency(
          from,
          to,
          amount ? parseFloat(amount) : 1,
          date
        );
        break;
      }

      case 'latest': {
        const { from, to } = flags;
        if (!from) {
          throw new CliError(ERROR_CODES.INPUT_ERROR, 'latest command requires --from flag');
        }
        result = await commands.getLatestRates(from, to);
        break;
      }

      case 'history': {
        const { from, date, to } = flags;
        if (!from || !date) {
          throw new CliError(ERROR_CODES.INPUT_ERROR, 'history command requires --from and --date flags');
        }
        result = await commands.getHistoricalRate(from, date, to);
        break;
      }

      case 'series': {
        const { from, start, end, to } = flags;
        if (!from || !start || !end) {
          throw new CliError(ERROR_CODES.INPUT_ERROR, 'series command requires --from, --start, and --end flags');
        }
        result = await commands.getRateSeries(from, start, end, to);
        break;
      }

      case 'currencies': {
        result = await commands.getCurrencies();
        break;
      }

      default:
        throw new CliError(ERROR_CODES.INPUT_ERROR, `Unknown command: ${command}`);
    }

    // Output result as JSON
    console.log(JSON.stringify(result, null, 2));
    process.exit(ERROR_CODES.SUCCESS);

  } catch (error) {
    if (error instanceof CliError) {
      console.error(JSON.stringify({
        error: error.message,
        code: error.code,
      }, null, 2));
      process.exit(error.code);
    }

    console.error(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
      code: ERROR_CODES.INTERNAL_ERROR,
    }, null, 2));
    process.exit(ERROR_CODES.INTERNAL_ERROR);
  }
}

// Run main
main();
