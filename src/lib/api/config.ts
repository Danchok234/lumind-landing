const trimTrailingSlash = (value: string) => value.replace(/\/$/, '');

export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!raw) {
    // Keep requests relative when a reverse proxy serves API on same origin.
    return '';
  }

  return trimTrailingSlash(raw);
}

