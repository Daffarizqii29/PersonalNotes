const KEY = 'ruangdiskusi_auth_v1';

export function loadAuthFromStorage() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { token: null, user: null };
    const parsed = JSON.parse(raw);
    return {
      token: parsed.token || null,
      user: null,
    };
  } catch (e) {
    return { token: null, user: null };
  }
}

export function saveAuthToStorage({ token }) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ token }));
  } catch (e) {
    // ignore
  }
}

export function clearAuthStorage() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    // ignore
  }
}
