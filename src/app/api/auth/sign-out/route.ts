import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api/config';

const AUTH_COOKIES_TO_CLEAR = ['token', 'access_token', 'refresh_token'];

export async function POST() {
  const apiBase = getApiBaseUrl();

  try {
    await fetch(`${apiBase}/api/v2/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
  } catch {
    // Keep logout idempotent on client side even if backend is unavailable.
  }

  const response = NextResponse.json({ success: true });

  AUTH_COOKIES_TO_CLEAR.forEach((cookieName) => {
    response.cookies.delete(cookieName);
  });

  return response;
}

