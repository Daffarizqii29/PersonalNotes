import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { createThread } from '../state/threadsSlice';

export default function NewThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((s) => s.auth.user);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [body, setBody] = useState('');
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !body.trim()) {
      setError('Judul dan isi thread wajib diisi.');
      return;
    }

    const result = await dispatch(createThread({
      title: title.trim(),
      body: body.trim(),
      category: category.trim(),
    }));

    if (createThread.rejected.match(result)) {
      setError(result.payload || result.error.message);
      return;
    }

    const newThread = result.payload;
    navigate(`/threads/${newThread.id}`);
  };

  return (
    <div className="page narrow">
      <div className="card">
        <h1 className="pageTitle">Buat Thread Baru</h1>
        <p className="pageSubtitle">Mulai diskusi dengan pertanyaan yang jelas dan konteks yang cukup.</p>

        {!authUser ? (
          <div className="alert">
            Kamu perlu
            {' '}
            <Link to="/login">login</Link>
            {' '}
            untuk membuat thread.
          </div>
        ) : null}

        <form onSubmit={onSubmit}>
          <label className="label" htmlFor="title">
            Judul
            <input
              id="title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Cara optimasi performa React Router?"
              required
              disabled={!authUser}
            />
          </label>

          <label className="label" htmlFor="category">
            Kategori
            <input
              id="category"
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Misal: General / React / Career"
              disabled={!authUser}
            />
          </label>

          <label className="label" htmlFor="body">
            Isi
            <textarea
              id="body"
              className="textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder="Tulis detail permasalahan, apa yang sudah dicoba, dan harapan jawaban…"
              required
              disabled={!authUser}
            />
          </label>

          {error ? <div className="fieldError">{error}</div> : null}

          <div className="formActions">
            <button type="submit" className="primaryBtn" disabled={!authUser}>
              Publikasikan
            </button>
            <Link to="/threads" className="linkBtn">Batal</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
