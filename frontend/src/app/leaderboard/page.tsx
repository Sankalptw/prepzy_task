'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { leaderboardAPI } from '@/lib/api';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'global' | 'today'>('global');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    if (user) {
      fetchUserRank();
    }
  }, [activeTab, user]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = activeTab === 'global' 
        ? await leaderboardAPI.getGlobal(20)
        : await leaderboardAPI.getToday(20);
      setLeaderboard(response.leaderboard || []);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRank = async () => {
    if (!user) return;
    try {
      const response = await leaderboardAPI.getUserRank(user.id);
      setUserRank(response.rank);
    } catch (error) {
      console.error('Failed to fetch user rank:', error);
    }
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

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
            {user && (
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {user.username}
              </span>
            )}
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem', maxWidth: '900px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            🏆 Leaderboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
            Compete with top learners around the world
          </p>
        </div>

        {/* User Rank Card */}
        {userRank && (
          <div className="user-rank-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="rank-badge">
                {getMedalEmoji(parseInt(userRank.rank))}
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Your Rank</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                  #{userRank.rank} - {userRank.total_score} points
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="leaderboard-tabs">
          <button
            onClick={() => setActiveTab('global')}
            className={`tab-button ${activeTab === 'global' ? 'active' : ''}`}
            suppressHydrationWarning
          >
            🌍 All Time
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`tab-button ${activeTab === 'today' ? 'active' : ''}`}
            suppressHydrationWarning
          >
            ⚡ Today
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="leaderboard-card">
          {isLoading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No data available yet
            </div>
          ) : (
            <div className="leaderboard-list">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`leaderboard-item ${user?.id === entry.id ? 'highlight' : ''} ${index < 3 ? 'top-three' : ''}`}
                >
                  <div className="leaderboard-rank">
                    {getMedalEmoji(parseInt(entry.rank))}
                  </div>
                  <div className="leaderboard-user">
                    <div className="leaderboard-username">{entry.username}</div>
                    <div className="leaderboard-stats">
                      {activeTab === 'global' ? (
                        <>
                          {entry.total_quizzes || 0} quizzes • {parseFloat(entry.avg_percentage || 0).toFixed(1)}% avg
                        </>
                      ) : (
                        <>
                          {entry.quizzes_today || 0} quizzes today
                        </>
                      )}
                    </div>
                  </div>
                  <div className="leaderboard-score">
                    {activeTab === 'global' ? entry.total_score : entry.score_today} pts
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