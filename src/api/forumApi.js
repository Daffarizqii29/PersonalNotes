const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://forum-api.dicoding.dev/v1';

async function request(path, { method = 'GET', token = null, body = null } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.message || `HTTP ${res.status}`;
    throw new Error(message);
  }
  if (data?.status !== 'success') {
    throw new Error(data?.message || 'Request failed');
  }
  return data.data;
}

export const forumApi = {
  async register({ name, email, password }) {
    return request('/register', { method: 'POST', body: { name, email, password } });
  },
  async login({ email, password }) {
    return request('/login', { method: 'POST', body: { email, password } });
  },
  async getMe(token) {
    return request('/users/me', { token });
  },
  async getUsers() {
    return request('/users');
  },
  async getThreads() {
    return request('/threads');
  },
  async getThreadDetail(threadId) {
    return request(`/threads/${threadId}`);
  },
  async createThread(token, { title, body, category }) {
    return request('/threads', {
      method: 'POST',
      token,
      body: { title, body, category },
    });
  },
  async createComment(token, threadId, { content }) {
    return request(`/threads/${threadId}/comments`, {
      method: 'POST',
      token,
      body: { content },
    });
  },
  async upVoteThread(token, threadId) {
    return request(`/threads/${threadId}/up-vote`, { method: 'POST', token });
  },
  async downVoteThread(token, threadId) {
    return request(`/threads/${threadId}/down-vote`, { method: 'POST', token });
  },
  async neutralVoteThread(token, threadId) {
    return request(`/threads/${threadId}/neutral-vote`, { method: 'POST', token });
  },
  async upVoteComment(token, threadId, commentId) {
    return request(`/threads/${threadId}/comments/${commentId}/up-vote`, { method: 'POST', token });
  },
  async downVoteComment(token, threadId, commentId) {
    return request(`/threads/${threadId}/comments/${commentId}/down-vote`, { method: 'POST', token });
  },
  async neutralVoteComment(token, threadId, commentId) {
    return request(`/threads/${threadId}/comments/${commentId}/neutral-vote`, { method: 'POST', token });
  },
  async getLeaderboards() {
    return request('/leaderboards');
  },
};

// Export default for ESLint rule compatibility (and to support both import styles).
export default forumApi;
