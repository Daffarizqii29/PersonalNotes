import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import { addComment, clearThreadDetail, fetchThreadDetail } from '../state/threadDetailSlice';
import Avatar from '../ui/components/Avatar';
import VoteButtons from '../ui/components/VoteButtons';
import { formatDate } from '../utils/format';

function CommentItem({ threadId, comment }) {
  return (
    <div className="comment">
      <div className="commentHeader">
        <div className="userInline">
          <Avatar src={comment.owner?.avatar} name={comment.owner?.name} size={28} />
          <div>
            <div className="userName">{comment.owner?.name}</div>
            <div className="muted">{formatDate(comment.createdAt)}</div>
          </div>
        </div>

        <VoteButtons
          mode="comment"
          threadId={threadId}
          commentId={comment.id}
          upVotesBy={comment.upVotesBy}
          downVotesBy={comment.downVotesBy}
        />
      </div>

      <div className="commentBody">{comment.content}</div>
    </div>
  );
}

export default function ThreadDetailPage() {
  const { threadId } = useParams();
  const dispatch = useDispatch();

  const detail = useSelector((s) => s.threadDetail.detail);
  const status = useSelector((s) => s.threadDetail.status);
  const error = useSelector((s) => s.threadDetail.error);
  const authUser = useSelector((s) => s.auth.user);

  const [content, setContent] = useState('');
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    dispatch(fetchThreadDetail({ threadId }));
    return () => {
      dispatch(clearThreadDetail());
    };
  }, [dispatch, threadId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!content.trim()) {
      setSubmitError('Komentar tidak boleh kosong.');
      return;
    }

    const result = await dispatch(addComment({ threadId, content: content.trim() }));
    if (addComment.rejected.match(result)) {
      setSubmitError(result.payload || result.error.message);
      return;
    }

    setContent('');
  };

  if (status === 'loading' && !detail) {
    return (
      <div className="page">
        <div className="card skeleton" style={{ height: 220 }} />
        <div className="card skeleton" style={{ height: 160, marginTop: 12 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="alert">{error}</div>
        <Link to="/threads" className="linkBtn">Kembali</Link>
      </div>
    );
  }

  if (!detail) return null;

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/threads">Threads</Link>
        <span className="sep">/</span>
        <span className="muted">Detail</span>
      </div>

      <article className="card detailCard">
        <div className="detailTop">
          <div className="badge">
            #
            {detail.category || 'Umum'}
          </div>
          <VoteButtons
            mode="thread"
            threadId={detail.id}
            upVotesBy={detail.upVotesBy}
            downVotesBy={detail.downVotesBy}
          />
        </div>

        <h1 className="detailTitle">{detail.title}</h1>

        <div className="detailOwner">
          <div className="userInline">
            <Avatar src={detail.owner?.avatar} name={detail.owner?.name} size={34} />
            <div>
              <div className="userName">{detail.owner?.name}</div>
              <div className="muted">{formatDate(detail.createdAt)}</div>
            </div>
          </div>
        </div>

        <div className="detailBody">{detail.body}</div>
      </article>

      <section className="section">
        <div className="sectionHeader">
          <h2 className="sectionTitle">
            Komentar (
            {detail.comments.length}
            )
          </h2>
        </div>

        <div className="card formCard">
          {authUser ? (
            <form onSubmit={onSubmit}>
              <label className="label" htmlFor="comment">
                Tulis komentar
                <textarea
                  id="comment"
                  className="textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  placeholder="Tanya, bantu jawab, atau tambahkan insight…"
                />
              </label>
              {submitError ? <div className="fieldError">{submitError}</div> : null}
              <div className="formActions">
                <button type="submit" className="primaryBtn">Kirim</button>
              </div>
            </form>
          ) : (
            <div className="muted">
              Kamu perlu
              {' '}
              <Link to="/login">login</Link>
              {' '}
              untuk menulis komentar.
            </div>
          )}
        </div>

        <div className="comments">
          {detail.comments.map((c) => (
            <CommentItem key={c.id} threadId={detail.id} comment={c} />
          ))}
        </div>
      </section>
    </div>
  );
}
