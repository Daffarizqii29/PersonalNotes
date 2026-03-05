import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import loadingReducer from './loadingSlice';
import usersReducer from './usersSlice';
import threadsReducer from './threadsSlice';
import threadDetailReducer from './threadDetailSlice';
import leaderboardReducer from './leaderboardSlice';

import { loadAuthFromStorage, saveAuthToStorage } from './storage';

const preloadedAuth = loadAuthFromStorage();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    users: usersReducer,
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
    leaderboard: leaderboardReducer,
  },
  preloadedState: {
    auth: {
      ...preloadedAuth,
      isBootstrapped: false,
    },
  },
});

store.subscribe(() => {
  const { token } = store.getState().auth;
  saveAuthToStorage({ token });
});

export const selectIsLoading = (state) => state.loading.count > 0;
