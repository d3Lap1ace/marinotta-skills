/**
 * Configuration constants for the exchange rate skill
 */

export const CONFIG = {
  /** Frankfurter API base URL */
  API_BASE_URL: 'https://api.frankfurter.dev/v1',

  /** Default timeout in milliseconds */
  DEFAULT_TIMEOUT: 15000,

  /** Default number of retries */
  DEFAULT_RETRIES: 2,

  /** Delay between retries in milliseconds (exponential backoff) */
  RETRY_DELAY: 1000,
} as const;

/**
 * Custom error class for CLI errors
 */
export class CliError extends Error {
  constructor(
    public readonly code: number,
    message: string
  ) {
    super(message);
    this.name = 'CliError';
  }
}

/**
 * Error codes and their meanings
 */
export const ERROR_CODES = {
  SUCCESS: 0,
  INPUT_ERROR: 2,
  NETWORK_ERROR: 3,
  API_ERROR: 4,
  INTERNAL_ERROR: 5,
} as const;
