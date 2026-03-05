import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AppLayout from './ui/layout/AppLayout';
import ThreadsPage from './pages/ThreadsPage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NewThreadPage from './pages/NewThreadPage';
import LeaderboardPage from './pages/LeaderboardPage';

import { bootstrapAuth } from './state/authSlice';

export default function App() {
  const dispatch = useDispatch();
  const isBootstrapped = useSelector((s) => s.auth.isBootstrapped);

  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);

  if (!isBootstrapped) {
    return (
      <div className="appShellCenter">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/threads" replace />} />
        <Route path="/threads" element={<ThreadsPage />} />
        <Route path="/threads/:threadId" element={<ThreadDetailPage />} />
        <Route path="/new" element={<NewThreadPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/threads" replace />} />
      </Route>
    </Routes>
  );
}
