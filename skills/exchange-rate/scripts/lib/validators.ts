/**
 * Parameter validators for the exchange rate skill
 */

import { CliError, ERROR_CODES } from './config.js';

/**
 * Validates ISO 4217 currency code format
 */
export function validateCurrencyCode(code: string): void {
  if (!/^[A-Z]{3}$/.test(code)) {
    throw new CliError(ERROR_CODES.INPUT_ERROR, `Invalid currency code: ${code}. Must be a 3-letter ISO 4217 code.`);
  }
}

/**
 * Validates date format (YYYY-MM-DD)
 */
export function validateDateFormat(date: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new CliError(ERROR_CODES.INPUT_ERROR, `Invalid date format: ${date}. Must be YYYY-MM-DD.`);
  }

  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    throw new CliError(ERROR_CODES.INPUT_ERROR, `Invalid date: ${date}.`);
  }
}

/**
 * Validates amount is a positive number
 */
export function validateAmount(amount: number): void {
  if (isNaN(amount) || amount <= 0) {
    throw new CliError(ERROR_CODES.INPUT_ERROR, `Invalid amount: ${amount}. Must be a positive number.`);
  }
}

/**
 * Validates date range (start before end)
 */
export function validateDateRange(start: string, end: string): void {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (startDate >= endDate) {
    throw new CliError(ERROR_CODES.INPUT_ERROR, `Invalid date range: start (${start}) must be before end (${end}).`);
  }
}

/**
 * Validates that date is not in the future
 */
export function validateNotFutureDate(date: string): void {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (inputDate > today) {
    throw new CliError(ERROR_CODES.INPUT_ERROR, `Invalid date: ${date} is in the future.`);
  }
}
