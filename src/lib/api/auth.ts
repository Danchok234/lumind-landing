import type {
  AuthOkResponse,
  AuthErrorDetail,
  AuthSessionResponse,
  AuthUser,
  ForgotPasswordPayload,
  GoogleCallbackPayload,
  GoogleCallbackResponse,
  LoginPayload,
  RegisterPayload,
  RequestVerifyTokenPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from '@/types/auth';

import { ApiClientError, apiRequest } from './client';
import { getApiBaseUrl, getGoogleAuthorizeUrl } from './config';

const OAUTH_LOGIN_PATH = '/api/v2/auth/jwt/login';

export function getGoogleOAuthStartUrl(state?: string): string {
  return getGoogleAuthorizeUrl(state);
}

export async function login(payload: LoginPayload) {
  console.info('email_login_start', { email: payload.email });

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
    const authError = extractAuthError(parsed, response.status);

    console.error('email_login_fail', {
      url,
      status: response.status,
      payload: {
        ...payload,
        password: '***',
      },
      response: parsed,
    });

    throw new ApiClientError(authError.message, response.status, parsed);
  }

  console.info('email_login_success', { email: payload.email });

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

export async function googleCallback(payload: GoogleCallbackPayload) {
  console.info('exchange_code_with_backend_start');

  try {
    const response = await apiRequest<GoogleCallbackResponse>('api/v2/auth/google/callback', {
      method: 'POST',
      body: payload,
    });

    console.info('exchange_code_with_backend_success', {
      is_new_user: response.is_new_user,
    });

    return response;
  } catch (error) {
    console.error('exchange_code_with_backend_fail', {
      error,
    });

    if (error instanceof ApiClientError) {
      if (error.status === 502) {
        throw new ApiClientError('Ошибка авторизации через Google. Повторите попытку.', 502, error.details);
      }

      if (error.status === 403) {
        throw new ApiClientError(extractDetailMessage(error.details) ?? 'Доступ запрещен.', 403, error.details);
      }
    }

    throw error;
  }
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
  return apiRequest<AuthUser>('api/v2/auth/me', {
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

function extractAuthError(parsed: unknown, status: number): { message: string; detail?: AuthErrorDetail } {
  const detail = extractDetail(parsed);
  const code = extractDetailCode(detail);

  if (code === 'LOGIN_USER_NOT_ACTIVE') {
    return {
      message: 'Аккаунт деактивирован. Обратитесь в поддержку.',
      detail,
    };
  }

  if (code === 'LOGIN_USER_NOT_VERIFIED') {
    return {
      message: 'Подтвердите почту, чтобы войти.',
      detail,
    };
  }

  if ((status === 400 || status === 401) && detail) {
    return {
      message: extractDetailMessage(detail) ?? 'Неверный email или пароль.',
      detail,
    };
  }

  return {
    message: extractApiErrorMessage(parsed, status),
    detail,
  };
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

function extractDetail(parsed: unknown): AuthErrorDetail | undefined {
  if (!parsed || typeof parsed !== 'object') {
    return undefined;
  }

  const detail = (parsed as { detail?: unknown }).detail;
  if (typeof detail === 'string') {
    return detail;
  }

  if (detail && typeof detail === 'object') {
    const typed = detail as { code?: unknown; message?: unknown; reason?: unknown };
    return {
      code: typeof typed.code === 'string' ? typed.code : undefined,
      message: typeof typed.message === 'string' ? typed.message : undefined,
      reason: typeof typed.reason === 'string' ? typed.reason : undefined,
    };
  }

  return undefined;
}

function extractDetailCode(detail?: AuthErrorDetail): string | undefined {
  if (!detail || typeof detail === 'string') {
    return undefined;
  }

  return detail.code;
}

function extractDetailMessage(detail?: unknown): string | undefined {
  if (!detail) {
    return undefined;
  }

  if (typeof detail === 'string') {
    return detail;
  }

  if (typeof detail === 'object') {
    const typed = detail as { message?: unknown; reason?: unknown; code?: unknown };
    if (typeof typed.message === 'string' && typed.message.trim()) {
      return typed.message;
    }

    if (typeof typed.reason === 'string' && typed.reason.trim()) {
      return typed.reason;
    }

    if (typeof typed.code === 'string' && typed.code.trim()) {
      return typed.code;
    }
  }

  return undefined;
}

