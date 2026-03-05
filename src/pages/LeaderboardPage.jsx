import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchLeaderboards } from '../state/leaderboardSlice';
import Avatar from '../ui/components/Avatar';

export default function LeaderboardPage() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.leaderboard.items);
  const status = useSelector((s) => s.leaderboard.status);
  const error = useSelector((s) => s.leaderboard.error);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchLeaderboards());
  }, [dispatch, status]);

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Leaderboard</h1>
          <p className="pageSubtitle">Pengguna paling aktif berdasarkan skor dari vote.</p>
        </div>
      </div>

      {error ? <div className="alert">{error}</div> : null}

      {status === 'loading' && items.length === 0 ? (
        <div className="card skeleton" style={{ height: 240 }} />
      ) : (
        <div className="card">
          <div className="table">
            <div className="row head">
              <div>#</div>
              <div>Pengguna</div>
              <div className="right">Skor</div>
            </div>
            {items.map((it, idx) => (
              <div key={it.user.id} className="row">
                <div className="muted">{idx + 1}</div>
                <div className="userInline">
                  <Avatar src={it.user.avatar} name={it.user.name} size={28} />
                  <div className="userName">{it.user.name}</div>
                </div>
                <div className="right score">{it.score}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
