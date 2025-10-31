'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { quizAPI } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      const [statsResponse, historyResponse] = await Promise.all([
        quizAPI.getStats(),
        quizAPI.getHistory(20),
      ]);
      setStats(statsResponse.stats);
      setHistory(historyResponse.history || []);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      {/* Navbar */}
      <nav>
        <div className="nav-container">
          <Link href="/dashboard" className="nav-logo">
            <span>🧠</span>
            <span>Smart Quiz Arena</span>
          </Link>
          <div className="nav-links">
            <Link href="/dashboard" className="btn btn-secondary">Dashboard</Link>
            <Link href="/leaderboard" className="btn btn-secondary">Leaderboard</Link>
            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
              {user?.username}
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{stats?.total_quizzes || 0}</div>
            <div className="stat-label">Total Quizzes</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{stats?.total_points || 0}</div>
            <div className="stat-label">Total Points</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-value">{stats?.avg_score?.toFixed(1) || 0}%</div>
            <div className="stat-label">Average Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-value">{stats?.topics_attempted || 0}</div>
            <div className="stat-label">Topics Attempted</div>
          </div>
        </div>

        {/* Quiz History */}
        <div className="history-section">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            📜 Quiz History
          </h2>
          
          {history.length === 0 ? (
            <div className="empty-state">
              <p>No quiz attempts yet</p>
              <Link href="/dashboard" className="btn btn-primary">Take Your First Quiz</Link>
            </div>
          ) : (
            <div className="history-list">
              {history.map((attempt) => (
                <div key={attempt.id} className="history-item">
                  <div className="history-icon">{attempt.topic_icon}</div>
                  <div className="history-content">
                    <div className="history-title">{attempt.topic_name}</div>
                    <div className="history-meta">
                      {new Date(attempt.completed_at).toLocaleDateString()} • 
                      {attempt.time_taken}s
                    </div>
                  </div>
                  <div className="history-score">
                    <div className="history-percentage">{attempt.percentage}%</div>
                    <div className="history-points">{attempt.score}/{attempt.total_questions}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}