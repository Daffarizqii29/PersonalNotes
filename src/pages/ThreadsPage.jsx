import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import ThreadCard from '../ui/components/ThreadCard';
import { fetchThreads, setCategoryFilter } from '../state/threadsSlice';
import { unique } from '../utils/format';

function ThreadCardSkeleton() {
  return (
    <div className="card threadCardSkeleton" aria-hidden="true">
      <div className="threadCardTop">
        <div className="threadMeta">
          <Skeleton width={88} height={28} borderRadius={999} />
          <Skeleton width={110} />
        </div>
        <Skeleton width={34} height={72} borderRadius={16} />
      </div>

      <Skeleton height={28} width="72%" />
      <Skeleton count={3} />

      <div className="threadCardBottom">
        <div className="userInline">
          <Skeleton circle width={28} height={28} />
          <div>
            <Skeleton width={110} />
            <Skeleton width={84} />
          </div>
        </div>

        <Skeleton width={72} height={36} borderRadius={12} />
      </div>
    </div>
  );
}

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
            <ThreadCardSkeleton key={`thread-skeleton-${i + 1}`} />
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
