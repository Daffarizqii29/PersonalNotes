import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { forumApi } from '../api/forumApi';
import { startLoading, stopLoading } from './loadingSlice';

export const patchThreadVotesInDetail = createAction('threadDetail/patchThreadVotesInDetail');
export const patchCommentVotesInDetail = createAction('threadDetail/patchCommentVotesInDetail');

export const fetchThreadDetail = createAsyncThunk(
  'threadDetail/fetchThreadDetail',
  async ({ threadId }, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());
    try {
      const data = await forumApi.getThreadDetail(threadId);
      return data.detailThread;
    } catch (e) {
      return rejectWithValue(e.message);
    } finally {
      dispatch(stopLoading());
    }
  },
);

export const addComment = createAsyncThunk(
  'threadDetail/addComment',
  async ({ threadId, content }, { getState, dispatch, rejectWithValue }) => {
    const { token } = getState().auth;
    if (!token) return rejectWithValue('Kamu harus login untuk komentar.');

    dispatch(startLoading());
    try {
      const data = await forumApi.createComment(token, threadId, { content });
      return { threadId, comment: data.comment };
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

export const voteComment = createAsyncThunk(
  'threadDetail/voteComment',
  async ({ threadId, commentId, direction }, { getState, dispatch, rejectWithValue }) => {
    const { token, user } = getState().auth;
    if (!token || !user) return rejectWithValue('Kamu harus login untuk vote.');

    const { detail } = getState().threadDetail;
    if (!detail || detail.id !== threadId) return rejectWithValue('Detail thread belum siap.');

    const comment = detail.comments.find((c) => c.id === commentId);
    if (!comment) return rejectWithValue('Komentar tidak ditemukan.');

    const prev = { upVotesBy: comment.upVotesBy, downVotesBy: comment.downVotesBy };
    const next = applyVote(prev, user.id, direction);

    dispatch(patchCommentVotesInDetail({ threadId, commentId, votes: next }));

    try {
      const isUp = prev.upVotesBy.includes(user.id);
      const isDown = prev.downVotesBy.includes(user.id);

      if (direction === 'up') {
        if (isUp) await forumApi.neutralVoteComment(token, threadId, commentId);
        else await forumApi.upVoteComment(token, threadId, commentId);
      }

      if (direction === 'down') {
        if (isDown) await forumApi.neutralVoteComment(token, threadId, commentId);
        else await forumApi.downVoteComment(token, threadId, commentId);
      }

      return { threadId, commentId, votes: next };
    } catch (e) {
      dispatch(patchCommentVotesInDetail({ threadId, commentId, votes: prev }));
      return rejectWithValue(e.message);
    }
  },
);

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: {
    detail: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearThreadDetail(state) {
      state.detail = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreadDetail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.detail = action.payload;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
        state.detail = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        if (state.detail && state.detail.id === action.payload.threadId) {
          state.detail.comments.push(action.payload.comment);
        }
      })
      .addCase(patchThreadVotesInDetail, (state, action) => {
        const { threadId, votes } = action.payload;
        if (state.detail && state.detail.id === threadId) {
          state.detail.upVotesBy = votes.upVotesBy;
          state.detail.downVotesBy = votes.downVotesBy;
        }
      })
      .addCase(patchCommentVotesInDetail, (state, action) => {
        const { threadId, commentId, votes } = action.payload;
        if (state.detail && state.detail.id === threadId) {
          const idx = state.detail.comments.findIndex((c) => c.id === commentId);
          if (idx >= 0) {
            state.detail.comments[idx].upVotesBy = votes.upVotesBy;
            state.detail.comments[idx].downVotesBy = votes.downVotesBy;
          }
        }
      });
  },
});

export const { clearThreadDetail } = threadDetailSlice.actions;
export default threadDetailSlice.reducer;
