/**
 * Skenario Pengujian (React Component) - VoteButtons
 * - harus menampilkan skor (upVotesBy - downVotesBy)
 * - ketika tombol up vote ditekan pada mode 'thread', harus mem-dispatch voteThread dengan parameter yang benar
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import VoteButtons from '../VoteButtons';

const mockDispatch = vi.fn();

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector({ auth: { user: { id: 'u1' } } }),
}));

vi.mock('../../../state/threadsSlice', () => ({
  voteThread: (payload) => ({ type: 'threads/voteThread', payload }),
}));

vi.mock('../../../state/threadDetailSlice', () => ({
  voteComment: (payload) => ({ type: 'threadDetail/voteComment', payload }),
}));

describe('VoteButtons component', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('harus menampilkan skor yang benar', () => {
    render(
      <VoteButtons
        mode="thread"
        threadId="t1"
        upVotesBy={['u1', 'u2']}
        downVotesBy={['u3']}
      />,
    );

    expect(screen.getByLabelText('Skor 1')).toBeInTheDocument();
  });

  it('harus dispatch voteThread saat tombol up vote ditekan', async () => {
    const user = userEvent.setup();

    render(
      <VoteButtons
        mode="thread"
        threadId="t1"
        upVotesBy={[]}
        downVotesBy={[]}
      />,
    );

    await user.click(screen.getByRole('button', { name: /up vote/i }));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'threads/voteThread',
      payload: { threadId: 't1', direction: 'up' },
    });
  });
});
