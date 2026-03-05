/**
 * Skenario Pengujian (Thunk) - authSlice
 * - loginUser()
 *   - harus memanggil forumApi.login
 *   - harus menyimpan token pada state auth saat fulfilled
 *   - harus menambah lalu mengurangi counter loading (startLoading/stopLoading)
 */

import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';

import authReducer, { loginUser } from '../authSlice';
import loadingReducer from '../loadingSlice';

// Mock API module yang dipakai oleh thunk
vi.mock('../../api/forumApi', () => ({
  forumApi: {
    login: vi.fn(),
  },
}));

// eslint-disable-next-line import/first
import { forumApi } from '../../api/forumApi';

function createStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      loading: loadingReducer,
    },
  });
}

describe('authSlice thunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('harus menyimpan token dan mengelola loading saat login berhasil', async () => {
    forumApi.login.mockResolvedValueOnce({ token: 'token-xyz' });

    const store = createStore();
    expect(store.getState().loading.count).toBe(0);

    const result = await store.dispatch(loginUser({ email: 'a@a.com', password: 'secret' }));

    expect(forumApi.login).toHaveBeenCalledTimes(1);
    expect(forumApi.login).toHaveBeenCalledWith({ email: 'a@a.com', password: 'secret' });

    expect(loginUser.fulfilled.match(result)).toBe(true);
    expect(store.getState().auth.token).toBe('token-xyz');

    // startLoading & stopLoading seimbang, jadi kembali 0
    expect(store.getState().loading.count).toBe(0);
  });
});
