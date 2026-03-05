import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import LoadingOverlay from '../components/LoadingOverlay';
import Avatar from '../components/Avatar';
import { logout } from '../../state/authSlice';

export default function AppLayout() {
  const auth = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate('/threads');
  };

  return (
    <div className="appShell">
      <LoadingOverlay />

      <header className="topbar">
        <div className="topbarInner">
          <div className="brand">
            <div className="brandMark" aria-label="Robot mascot">🤖</div>
            <div>
              <div className="brandName">RuangDiskusi</div>
              <div className="brandTag">Forum santai, ide serius.</div>
            </div>
          </div>

          <nav className="nav">
            <NavLink to="/threads" className={({ isActive }) => (isActive ? 'navLink active' : 'navLink')}>
              Threads
            </NavLink>
            <NavLink to="/leaderboard" className={({ isActive }) => (isActive ? 'navLink active' : 'navLink')}>
              Leaderboard
            </NavLink>
            <NavLink to="/new" className={({ isActive }) => (isActive ? 'navLink active' : 'navLink')}>
              Buat Thread
            </NavLink>
          </nav>

          <div className="topbarRight">
            {auth.user ? (
              <div className="userBox">
                <Avatar src={auth.user.avatar} name={auth.user.name} size={32} />
                <div className="userBoxText">
                  <div className="userName">{auth.user.name}</div>
                  <button type="button" className="textBtn" onClick={onLogout}>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="authLinks">
                <NavLink to="/login" className={({ isActive }) => (isActive ? 'pill active' : 'pill')}>
                  Login
                </NavLink>
                <NavLink to="/register" className={({ isActive }) => (isActive ? 'pill active' : 'pill')}>
                  Daftar
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div />
      </footer>
    </div>
  );
}
