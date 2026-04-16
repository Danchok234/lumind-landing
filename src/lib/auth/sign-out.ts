const STORAGE_KEYS = ['authToken', 'accessToken', 'refreshToken', 'user'];

export async function signOut(redirectTo = '/login'): Promise<void> {
  try {
    await fetch('/api/v2/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } finally {
    if (typeof window !== 'undefined') {
      STORAGE_KEYS.forEach((key) => {
        window.localStorage.removeItem(key);
        window.sessionStorage.removeItem(key);
      });

      window.location.assign(redirectTo);
    }
  }
}

