/**
 * HTTP client with retry logic for the exchange rate skill
 */

import { CliError, ERROR_CODES, CONFIG } from './config.js';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

interface HttpResponse<T = unknown> {
  ok: boolean;
  status: number;
  data: T;
  headers: Headers;
}

/**
 * Sleep utility for retry delay
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * HTTP request with retry logic
 */
export async function httpRequest<T = unknown>(
  url: string,
  options: RequestOptions = {}
): Promise<HttpResponse<T>> {
  const {
    method = 'GET',
    headers = {},
    timeout = CONFIG.DEFAULT_TIMEOUT,
    retries = CONFIG.DEFAULT_RETRIES,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'exchange-rate-skill',
          ...headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new CliError(
          ERROR_CODES.API_ERROR,
          `API error: ${response.status} ${response.statusText}`
        );
      }

      return {
        ok: true,
        status: response.status,
        data,
        headers: response.headers,
      };
    } catch (error) {
      lastError = error as Error;

      // Don't retry on CliError (already handled)
      if (error instanceof CliError) {
        throw error;
      }

      // Don't retry on the last attempt
      if (attempt < retries) {
        // Exponential backoff
        await sleep(CONFIG.RETRY_DELAY * Math.pow(2, attempt));
      }
    }
  }

  // All retries failed
  throw new CliError(
    ERROR_CODES.NETWORK_ERROR,
    `Network error after ${retries + 1} attempts: ${lastError?.message || 'Unknown error'}`
  );
}

/**
 * Build API URL with query parameters
 */
export function buildApiUrl(endpoint: string, params: Record<string, string>): string {
  // Remove leading slash from endpoint to avoid path replacement
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const baseUrl = CONFIG.API_BASE_URL.endsWith('/') ? CONFIG.API_BASE_URL.slice(0, -1) : CONFIG.API_BASE_URL;
  const url = new URL(cleanEndpoint, baseUrl + '/');

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  }

  return url.toString();
}
