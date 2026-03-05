import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { registerUser } from '../state/authSlice';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((s) => s.auth.status);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const result = await dispatch(registerUser({ name, email, password }));
    if (registerUser.rejected.match(result)) {
      setError(result.payload || result.error.message);
      return;
    }

    setSuccess('Akun berhasil dibuat. Silakan login.');
    setTimeout(() => navigate('/login'), 600);
  };

  return (
    <div className="page narrow">
      <div className="card authCard">
        <h1 className="pageTitle">Daftar Akun</h1>
        <p className="pageSubtitle">Buat akun baru untuk ikut berdiskusi.</p>

        <form onSubmit={onSubmit}>
          <label className="label" htmlFor="name">
            Nama
            <input
              id="name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap"
              required
            />
          </label>

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
              minLength={6}
            />
          </label>

          {error ? <div className="fieldError">{error}</div> : null}
          {success ? <div className="fieldSuccess">{success}</div> : null}

          <button type="submit" className="primaryBtn full" disabled={status === 'loading'}>
            {status === 'loading' ? 'Membuat akun…' : 'Daftar'}
          </button>
        </form>

        <div className="muted" style={{ marginTop: 12 }}>
          Sudah punya akun?
          {' '}
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
