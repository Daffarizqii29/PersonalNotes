import { Link } from 'react-router-dom';

import Avatar from './Avatar';
import VoteButtons from './VoteButtons';
import { excerpt, formatDate } from '../../utils/format';

export default function ThreadCard({ thread, owner }) {
  return (
    <article className="card threadCard">
      <div className="threadCardTop">
        <div className="threadMeta">
          <div className="badge">
            #
            {thread.category || 'Umum'}
          </div>
          <div className="muted">{formatDate(thread.createdAt)}</div>
        </div>
        <VoteButtons
          mode="thread"
          threadId={thread.id}
          upVotesBy={thread.upVotesBy}
          downVotesBy={thread.downVotesBy}
        />
      </div>

      <h3 className="threadTitle">
        <Link to={`/threads/${thread.id}`}>{thread.title}</Link>
      </h3>

      <p className="threadExcerpt">{excerpt(thread.body, 160)}</p>

      <div className="threadCardBottom">
        <div className="userInline">
          <Avatar src={owner?.avatar} name={owner?.name || 'Anon'} size={28} />
          <div>
            <div className="userName">{owner?.name || 'Anon'}</div>
            <div className="muted">
              {thread.totalComments}
              {' '}
              komentar
            </div>
          </div>
        </div>

        <Link className="linkBtn" to={`/threads/${thread.id}`}>Baca</Link>
      </div>
    </article>
  );
}
