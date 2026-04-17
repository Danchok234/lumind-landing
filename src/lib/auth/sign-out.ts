const STORAGE_KEYS = ['authToken', 'accessToken', 'refreshToken', 'user'];

export function saveAccessToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem('accessToken', token);
  window.sessionStorage.setItem('accessToken', token);
}

export function saveCurrentUser(user: unknown): void {
  if (typeof window === 'undefined') {
    return;
  }

  const serialized = JSON.stringify(user);
  window.localStorage.setItem('user', serialized);
  window.sessionStorage.setItem('user', serialized);
}

export function clearAuthStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }

  STORAGE_KEYS.forEach((key) => {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  });
}

export async function signOut(redirectTo = '/login'): Promise<void> {
  console.info('logout');

  try {
    await fetch('/api/v2/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } finally {
    if (typeof window === 'undefined') {
      return;
    }

    clearAuthStorage();
    window.location.assign(redirectTo);
  }
}

