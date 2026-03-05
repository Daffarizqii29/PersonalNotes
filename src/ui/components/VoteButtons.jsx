import { useDispatch, useSelector } from 'react-redux';

import { voteThread } from '../../state/threadsSlice';
import { voteComment } from '../../state/threadDetailSlice';

function countVotes(upVotesBy, downVotesBy) {
  return (upVotesBy?.length || 0) - (downVotesBy?.length || 0);
}

export default function VoteButtons({
  mode, // 'thread' | 'comment'
  threadId,
  commentId,
  upVotesBy,
  downVotesBy,
}) {
  const dispatch = useDispatch();
  const authUser = useSelector((s) => s.auth.user);

  const score = countVotes(upVotesBy, downVotesBy);
  const hasUp = authUser ? upVotesBy?.includes(authUser.id) : false;
  const hasDown = authUser ? downVotesBy?.includes(authUser.id) : false;

  const onUp = () => {
    if (mode === 'thread') dispatch(voteThread({ threadId, direction: 'up' }));
    if (mode === 'comment') dispatch(voteComment({ threadId, commentId, direction: 'up' }));
  };

  const onDown = () => {
    if (mode === 'thread') dispatch(voteThread({ threadId, direction: 'down' }));
    if (mode === 'comment') dispatch(voteComment({ threadId, commentId, direction: 'down' }));
  };

  return (
    <div className="vote">
      <button
        type="button"
        className={`voteBtn ${hasUp ? 'active' : ''}`}
        onClick={onUp}
        aria-label="Up vote"
        title="Up vote"
      >
        ▲
      </button>
      <div className="voteScore" aria-label={`Skor ${score}`}>{score}</div>
      <button
        type="button"
        className={`voteBtn ${hasDown ? 'active' : ''}`}
        onClick={onDown}
        aria-label="Down vote"
        title="Down vote"
      >
        ▼
      </button>
    </div>
  );
}
