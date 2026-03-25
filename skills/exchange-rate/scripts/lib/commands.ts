/**
 * Command execution logic for the exchange rate skill
 */

import { httpRequest, buildApiUrl } from './http.js';
import {
  validateCurrencyCode,
  validateAmount,
  validateDateFormat,
  validateDateRange,
  validateNotFutureDate,
} from './validators.js';
import { CliError, ERROR_CODES } from './config.js';

/**
 * API response types
 */
interface LatestResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

interface HistoricalResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

interface SeriesResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Record<string, number>>;
}

interface CurrenciesResponse {
  [code: string]: string;
}

/**
 * Convert amount between currencies
 */
export async function convertCurrency(
  from: string,
  to: string,
  amount: number = 1,
  date?: string
): Promise<LatestResponse | HistoricalResponse> {
  validateCurrencyCode(from);
  validateCurrencyCode(to);
  validateAmount(amount);

  const endpoint = date ? `/${date}` : '/latest';

  if (date) {
    validateDateFormat(date);
    validateNotFutureDate(date);
  }

  const params: Record<string, string> = {
    from,
    to,
  };

  if (amount !== 1) {
    params.amount = amount.toString();
  }

  const url = buildApiUrl(endpoint, params);
  const response = await httpRequest<LatestResponse | HistoricalResponse>(url);

  return response.data;
}

/**
 * Get latest exchange rates
 */
export async function getLatestRates(from: string, to?: string): Promise<LatestResponse> {
  validateCurrencyCode(from);

  if (to) {
    for (const code of to.split(',')) {
      validateCurrencyCode(code.trim());
    }
  }

  const params: Record<string, string> = { from };

  if (to) {
    params.to = to;
  }

  const url = buildApiUrl('/latest', params);
  const response = await httpRequest<LatestResponse>(url);

  return response.data;
}

/**
 * Get historical exchange rate for a specific date
 */
export async function getHistoricalRate(
  from: string,
  date: string,
  to?: string
): Promise<HistoricalResponse> {
  validateCurrencyCode(from);
  validateDateFormat(date);
  validateNotFutureDate(date);

  if (to) {
    for (const code of to.split(',')) {
      validateCurrencyCode(code.trim());
    }
  }

  const params: Record<string, string> = { from };

  if (to) {
    params.to = to;
  }

  const url = buildApiUrl(`/${date}`, params);
  const response = await httpRequest<HistoricalResponse>(url);

  return response.data;
}

/**
 * Get exchange rate trend over a date range
 */
export async function getRateSeries(
  from: string,
  start: string,
  end: string,
  to?: string
): Promise<SeriesResponse> {
  validateCurrencyCode(from);
  validateDateFormat(start);
  validateDateFormat(end);
  validateDateRange(start, end);
  validateNotFutureDate(end);

  if (to) {
    for (const code of to.split(',')) {
      validateCurrencyCode(code.trim());
    }
  }

  const params: Record<string, string> = {
    from,
    start,
    end,
  };

  if (to) {
    params.to = to;
  }

  const url = buildApiUrl(`/${start}..${end}`, params);
  const response = await httpRequest<SeriesResponse>(url);

  return response.data;
}

/**
 * List all supported currencies
 */
export async function getCurrencies(): Promise<CurrenciesResponse> {
  const url = buildApiUrl('/currencies', {});
  const response = await httpRequest<CurrenciesResponse>(url);

  return response.data;
}
