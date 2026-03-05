/**
 * Skenario Pengujian (Thunk) - threadsSlice
 * - createThread()
 *   - ketika token tidak ada, harus reject dengan pesan yang sesuai
 *   - tidak boleh memanggil forumApi.createThread
 */

import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';

import threadsReducer, { createThread } from '../threadsSlice';
import authReducer from '../authSlice';
import loadingReducer from '../loadingSlice';

vi.mock('../../api/forumApi', () => ({
  forumApi: {
    createThread: vi.fn(),
  },
}));

// eslint-disable-next-line import/first
import { forumApi } from '../../api/forumApi';

function createStore() {
  return configureStore({
    reducer: {
      threads: threadsReducer,
      auth: authReducer,
      loading: loadingReducer,
    },
    preloadedState: {
      auth: {
        token: null,
        user: null,
        status: 'idle',
        error: null,
        isBootstrapped: false,
      },
    },
  });
}

describe('threadsSlice thunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('harus reject jika token tidak ada', async () => {
    const store = createStore();

    const result = await store.dispatch(createThread({ title: 't', body: 'b', category: 'c' }));

    expect(createThread.rejected.match(result)).toBe(true);
    expect(result.payload).toBe('Kamu harus login untuk membuat thread.');
    expect(forumApi.createThread).not.toHaveBeenCalled();
  });
});
