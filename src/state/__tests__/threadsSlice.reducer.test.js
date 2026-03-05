/**
 * Skenario Pengujian (Reducer) - threadsSlice
 * - setCategoryFilter()
 *   - harus mengubah categoryFilter sesuai payload
 * - patchThreadVotes()
 *   - harus memperbarui upVotesBy/downVotesBy pada thread yang sesuai
 */

import threadsReducer, { setCategoryFilter, patchThreadVotes } from '../threadsSlice';

describe('threadsSlice reducer', () => {
  it('harus mengubah categoryFilter saat setCategoryFilter dipanggil', () => {
    const prevState = {
      items: [],
      status: 'idle',
      error: null,
      categoryFilter: 'ALL',
    };

    const nextState = threadsReducer(prevState, setCategoryFilter('React'));

    expect(nextState.categoryFilter).toBe('React');
  });

  it('harus memperbarui votes thread saat patchThreadVotes dipanggil', () => {
    const prevState = {
      items: [
        { id: 't1', upVotesBy: [], downVotesBy: [] },
        { id: 't2', upVotesBy: ['u1'], downVotesBy: [] },
      ],
      status: 'idle',
      error: null,
      categoryFilter: 'ALL',
    };

    const nextVotes = { upVotesBy: ['u1', 'u2'], downVotesBy: [] };
    const nextState = threadsReducer(prevState, patchThreadVotes({ threadId: 't2', votes: nextVotes }));

    expect(nextState.items.find((t) => t.id === 't2').upVotesBy).toEqual(['u1', 'u2']);
    expect(nextState.items.find((t) => t.id === 't2').downVotesBy).toEqual([]);
  });
});
