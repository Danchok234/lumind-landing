import type {
  AuthOkResponse,
  AuthSessionResponse,
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  RequestVerifyTokenPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from '@/types/auth';

import { ApiClientError, apiRequest } from './client';
import { getApiBaseUrl } from './config';

const OAUTH_LOGIN_PATH = '/api/v2/auth/login';

export async function login(payload: LoginPayload) {
  const body = new URLSearchParams({
    grant_type: 'password',
    username: payload.email,
    password: payload.password,
  });

  const base = getApiBaseUrl();
  const url = base ? `${base}${OAUTH_LOGIN_PATH}` : OAUTH_LOGIN_PATH;

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  const responseText = await response.text();
  const parsed = responseText ? safeParseJson(responseText) : null;

  if (!response.ok) {
    const message = extractApiErrorMessage(parsed, response.status);

    console.error('[login] OAuth2 HTTP error', {
      url,
      status: response.status,
      payload: {
        ...payload,
        password: '***',
      },
      response: parsed,
    });

    throw new ApiClientError(message, response.status, parsed);
  }

  return parsed as AuthSessionResponse;
}

export function register(payload: RegisterPayload) {
  return apiRequest<AuthSessionResponse>('api/v2/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export function requestVerifyToken(payload: RequestVerifyTokenPayload) {
  return apiRequest<AuthOkResponse>('api/v2/auth/request-verify-token', {
    method: 'POST',
    body: payload,
  });
}

export function verifyEmail(payload: VerifyEmailPayload) {
  return apiRequest<AuthOkResponse>('api/v2/auth/verify', {
    method: 'POST',
    body: payload,
  });
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiRequest<AuthOkResponse>('api/v2/auth/forgot-password', {
    method: 'POST',
    body: payload,
  });
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiRequest<AuthOkResponse>('api/v2/auth/reset-password', {
    method: 'POST',
    body: payload,
  });
}

export function logout() {
  return apiRequest<AuthOkResponse>('api/v2/auth/logout', {
    method: 'POST',
  });
}

export function getMe() {
  return apiRequest<AuthUser>('/auth/me', {
    method: 'GET',
    cache: 'no-store',
  });
}

function safeParseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function extractApiErrorMessage(parsed: unknown, status: number): string {
  if (parsed && typeof parsed === 'object') {
    const maybeMessage = (parsed as { message?: unknown }).message;
    if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
      return maybeMessage;
    }

    const maybeDetail = (parsed as { detail?: unknown }).detail;
    if (typeof maybeDetail === 'string' && maybeDetail.trim()) {
      return maybeDetail;
    }

    if (Array.isArray(maybeDetail) && maybeDetail.length > 0) {
      return maybeDetail
        .map((item) => {
          if (!item || typeof item !== 'object') {
            return String(item);
          }
          const loc = Array.isArray((item as { loc?: unknown }).loc)
            ? (item as { loc: unknown[] }).loc.join('.')
            : 'field';
          const msg =
            typeof (item as { msg?: unknown }).msg === 'string'
              ? (item as { msg: string }).msg
              : 'Invalid value';
          return `${loc}: ${msg}`;
        })
        .join('; ');
    }
  }

  return `Request failed with status ${status}`;
}
