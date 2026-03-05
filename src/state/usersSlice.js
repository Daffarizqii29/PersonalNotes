import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { forumApi } from '../api/forumApi';
import { startLoading, stopLoading } from './loadingSlice';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    try {
      const data = await forumApi.getUsers();
      return data.users;
    } catch (e) {
      return rejectWithValue(e.message);
    } finally {
      dispatch(stopLoading());
    }
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    byId: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        action.payload.forEach((u) => {
          state.byId[u.id] = u;
        });
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default usersSlice.reducer;
