import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { forumApi } from '../api/forumApi';
import { startLoading, stopLoading } from './loadingSlice';

export const fetchLeaderboards = createAsyncThunk(
  'leaderboard/fetchLeaderboards',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    try {
      const data = await forumApi.getLeaderboards();
      return data.leaderboards;
    } catch (e) {
      return rejectWithValue(e.message);
    } finally {
      dispatch(stopLoading());
    }
  },
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboards.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLeaderboards.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchLeaderboards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default leaderboardSlice.reducer;
