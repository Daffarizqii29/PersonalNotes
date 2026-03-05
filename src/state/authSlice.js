import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { forumApi } from '../api/forumApi';
import { clearAuthStorage } from './storage';
import { startLoading, stopLoading } from './loadingSlice';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    try {
      const data = await forumApi.register({ name, email, password });
      return data.user;
    } catch (e) {
      return rejectWithValue(e.message);
    } finally {
      dispatch(stopLoading());
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    try {
      const data = await forumApi.login({ email, password });
      return data.token;
    } catch (e) {
      return rejectWithValue(e.message);
    } finally {
      dispatch(stopLoading());
    }
  },
);

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { token } = getState().auth;
    if (!token) return rejectWithValue('Missing token');

    dispatch(startLoading());
    try {
      const data = await forumApi.getMe(token);
      return data.user;
    } catch (e) {
      return rejectWithValue(e.message);
    } finally {
      dispatch(stopLoading());
    }
  },
);

export const bootstrapAuth = createAsyncThunk(
  'auth/bootstrapAuth',
  async (_, { dispatch, getState }) => {
    const { token } = getState().auth;
    if (token) {
      await dispatch(fetchMe());
    }
    return true;
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    status: 'idle',
    error: null,
    isBootstrapped: false,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.error = null;
      state.status = 'idle';
      clearAuthStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
      })
      .addCase(bootstrapAuth.fulfilled, (state) => {
        state.isBootstrapped = true;
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.isBootstrapped = true;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
