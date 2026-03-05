import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { fetchMe, loginUser } from '../state/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((s) => s.auth.status);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.rejected.match(result)) {
      setError(result.payload || result.error.message);
      return;
    }

    await dispatch(fetchMe());
    navigate('/threads');
  };

  return (
    <div className="page narrow">
      <div className="card authCard">
        <h1 className="pageTitle">Login</h1>
        <p className="pageSubtitle">Masuk untuk membuat thread, komentar, dan melakukan vote.</p>

        <form onSubmit={onSubmit}>
          <label className="label" htmlFor="email">
            Email
            <input
              id="email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
            />
          </label>

          <label className="label" htmlFor="password">
            Password
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="minimal 6 karakter"
              required
            />
          </label>

          {error ? <div className="fieldError">{error}</div> : null}

          <button type="submit" className="primaryBtn full" disabled={status === 'loading'}>
            {status === 'loading' ? 'Memproses…' : 'Login'}
          </button>
        </form>

        <div className="muted" style={{ marginTop: 12 }}>
          Belum punya akun?
          {' '}
          <Link to="/register">Daftar</Link>
        </div>
      </div>
    </div>
  );
}
