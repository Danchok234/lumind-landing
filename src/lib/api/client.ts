import { getApiBaseUrl } from './config';

export class ApiClientError extends Error {
  readonly status: number;
  readonly details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.details = details;
  }
}

type JsonBody = unknown;

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: JsonBody;
}

function buildUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const base = getApiBaseUrl();
  return base ? `${base}${normalizedPath}` : normalizedPath;
}

export async function apiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const { body, headers, ...rest } = options;
  const url = buildUrl(path);
  const method = options.method ?? 'GET';

  let response: Response;

  try {
    response = await fetch(url, {
      ...rest,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    console.error('[apiRequest] Network error', {
      method,
      url,
      body,
      error,
    });
    throw error;
  }

  const responseText = await response.text();
  const parsed = responseText ? safeParseJson(responseText) : null;

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    if (parsed && typeof parsed === 'object' && 'message' in parsed) {
      const candidate = (parsed as { message?: unknown }).message;
      if (typeof candidate === 'string' && candidate.trim()) {
        message = candidate;
      }
    }

    console.error('[apiRequest] HTTP error', {
      method,
      url,
      status: response.status,
      body,
      response: parsed,
    });

    throw new ApiClientError(message, response.status, parsed);
  }

  return parsed as TResponse;
}

function safeParseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
