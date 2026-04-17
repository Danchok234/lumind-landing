const trimTrailingSlash = (value: string) => value.replace(/\/$/, '');

const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';

const REQUIRED_GOOGLE_PARAMS = [
  'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
  'NEXT_PUBLIC_GOOGLE_REDIRECT_URI',
] as const;

export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!raw) {
    // Keep requests relative when a reverse proxy serves API on same origin.
    return '';
  }

  return trimTrailingSlash(raw);
}

export function getGoogleAuthorizeUrl(state?: string): string {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    const missing = REQUIRED_GOOGLE_PARAMS.filter((key) => !process.env[key]).join(', ');
    throw new Error(`Missing Google OAuth env: ${missing}`);
  }

  const scope = process.env.NEXT_PUBLIC_GOOGLE_SCOPE ?? 'openid email profile';
  const responseType = process.env.NEXT_PUBLIC_GOOGLE_RESPONSE_TYPE ?? 'code';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: responseType,
    scope,
    access_type: 'offline',
    include_granted_scopes: 'true',
    prompt: 'consent',
  });

  if (state) {
    params.set('state', state);
  }

  return `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;
}

