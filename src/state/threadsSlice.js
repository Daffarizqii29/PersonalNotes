import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { forumApi } from '../api/forumApi';
import { startLoading, stopLoading } from './loadingSlice';
import { fetchUsers } from './usersSlice';
import { patchThreadVotesInDetail } from './threadDetailSlice';

// Used by optimistic voting updates (dispatched from thunks).
export const patchThreadVotes = createAction('threads/patchThreadVotes');

export const fetchThreads = createAsyncThunk(
  'threads/fetchThreads',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    try {
      await dispatch(fetchUsers());
      const data = await forumApi.getThreads();
      return data.threads;
    } catch (e) {
      return rejectWithValue(e.message);
    } finally {
      dispatch(stopLoading());
    }
  },
);

export const createThread = createAsyncThunk(
  'threads/createThread',
  async ({ title, body, category }, { getState, dispatch, rejectWithValue }) => {
    const { token } = getState().auth;
    if (!token) return rejectWithValue('Kamu harus login untuk membuat thread.');

    dispatch(startLoading());
    try {
      const data = await forumApi.createThread(token, { title, body, category });
      return data.thread;
    } catch (e) {
      return rejectWithValue(e.message);
    } finally {
      dispatch(stopLoading());
    }
  },
);

function applyVote({ upVotesBy, downVotesBy }, userId, direction) {
  const up = new Set(upVotesBy);
  const down = new Set(downVotesBy);

  if (direction === 'up') {
    if (up.has(userId)) {
      up.delete(userId);
    } else {
      up.add(userId);
      down.delete(userId);
    }
  }

  if (direction === 'down') {
    if (down.has(userId)) {
      down.delete(userId);
    } else {
      down.add(userId);
      up.delete(userId);
    }
  }

  return { upVotesBy: Array.from(up), downVotesBy: Array.from(down) };
}

export const voteThread = createAsyncThunk(
  'threads/voteThread',
  async ({ threadId, direction }, { getState, dispatch, rejectWithValue }) => {
    const { token, user } = getState().auth;
    if (!token || !user) return rejectWithValue('Kamu harus login untuk vote.');

    const thread = getState().threads.items.find((t) => t.id === threadId);
    if (!thread) return rejectWithValue('Thread tidak ditemukan.');

    const prev = { upVotesBy: thread.upVotesBy, downVotesBy: thread.downVotesBy };
    const next = applyVote(prev, user.id, direction);

    dispatch(patchThreadVotes({ threadId, votes: next }));
    dispatch(patchThreadVotesInDetail({ threadId, votes: next }));

    try {
      const isUp = prev.upVotesBy.includes(user.id);
      const isDown = prev.downVotesBy.includes(user.id);

      if (direction === 'up') {
        if (isUp) await forumApi.neutralVoteThread(token, threadId);
        else await forumApi.upVoteThread(token, threadId);
      }

      if (direction === 'down') {
        if (isDown) await forumApi.neutralVoteThread(token, threadId);
        else await forumApi.downVoteThread(token, threadId);
      }

      return { threadId, votes: next };
    } catch (e) {
      dispatch(patchThreadVotes({ threadId, votes: prev }));
      dispatch(patchThreadVotesInDetail({ threadId, votes: prev }));
      return rejectWithValue(e.message);
    }
  },
);

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    categoryFilter: 'ALL',
  },
  reducers: {
    setCategoryFilter(state, action) {
      state.categoryFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(patchThreadVotes, (state, action) => {
        const { threadId, votes } = action.payload;
        const idx = state.items.findIndex((t) => t.id === threadId);
        if (idx >= 0) {
          state.items[idx].upVotesBy = votes.upVotesBy;
          state.items[idx].downVotesBy = votes.downVotesBy;
        }
      })
      .addCase(fetchThreads.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export const { setCategoryFilter } = threadsSlice.actions;
export default threadsSlice.reducer;
