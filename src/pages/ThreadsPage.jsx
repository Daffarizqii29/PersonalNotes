import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import ThreadCard from '../ui/components/ThreadCard';
import { fetchThreads, setCategoryFilter } from '../state/threadsSlice';
import { unique } from '../utils/format';

export default function ThreadsPage() {
  const dispatch = useDispatch();
  const threads = useSelector((s) => s.threads.items);
  const status = useSelector((s) => s.threads.status);
  const error = useSelector((s) => s.threads.error);
  const categoryFilter = useSelector((s) => s.threads.categoryFilter);
  const usersById = useSelector((s) => s.users.byId);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchThreads());
  }, [dispatch, status]);

  const categories = useMemo(() => {
    const cats = unique(threads.map((t) => (t.category || 'Umum').trim()).filter(Boolean));
    return ['ALL', ...cats.sort((a, b) => a.localeCompare(b))];
  }, [threads]);

  const filtered = useMemo(() => {
    if (categoryFilter === 'ALL') return threads;
    return threads.filter((t) => (t.category || 'Umum') === categoryFilter);
  }, [threads, categoryFilter]);

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Daftar Thread</h1>
          <p className="pageSubtitle">Temukan diskusi, vote yang kamu setujui, dan mulai obrolan baru.</p>
        </div>

        <div className="pageActions">
          <label htmlFor="category" className="muted">
            Kategori
            <select
              id="category"
              className="select"
              value={categoryFilter}
              onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'ALL' ? 'Semua' : c}</option>
              ))}
            </select>
          </label>

          <Link to="/new" className="primaryBtn">+ Thread</Link>
        </div>
      </div>

      {error ? (
        <div className="alert">{error}</div>
      ) : null}

      {status === 'loading' && threads.length === 0 ? (
        <div className="grid">
          {Array.from({ length: 6 }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i} className="card skeleton" />
          ))}
        </div>
      ) : (
        <div className="grid">
          {filtered.map((t) => (
            <ThreadCard key={t.id} thread={t} owner={usersById[t.ownerId]} />
          ))}
        </div>
      )}

      {status === 'succeeded' && filtered.length === 0 ? (
        <div className="emptyState">
          <div className="emptyTitle">Belum ada thread untuk kategori ini.</div>
          <div className="muted">Coba pilih kategori lain atau buat thread baru.</div>
        </div>
      ) : null}
    </div>
  );
}
