'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { topicsAPI } from '@/lib/api';
import { Topic } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchTopics = async () => {
      try {
        const response = await topicsAPI.getAll();
        setTopics(response.topics || []);
      } catch (error) {
        console.error('Failed to fetch topics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="loading-container" style={{ minHeight: '100vh' }}>
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <nav>
        <div className="nav-container">
          <Link href="/dashboard" className="nav-logo">
            <span>🧠</span>
            <span>Smart Quiz Arena</span>
          </Link>
          <div className="nav-links">
            <Link href="/leaderboard" className="btn btn-secondary">🏆 Leaderboard</Link>
            <Link href="/profile" className="btn btn-secondary">👤 Profile</Link>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Welcome, {user?.username}!
            </span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div className="page-header fade-in">
          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
            Choose Your Challenge
          </div>
          <h1 className="page-title">Available Quiz Topics</h1>
          <p className="page-subtitle">
            Select a topic to start your quiz journey. Track your progress and compete with others!
          </p>
        </div>

        {topics.length === 0 ? (
          <div className="empty-state">
            <p>No topics available yet.</p>
          </div>
        ) : (
          <div className="topics-grid slide-in-left">
            {topics.map((topic, index) => (
              <Link
                key={topic.id}
                href={`/quiz/${topic.slug}`}
                className="topic-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="topic-icon">{topic.icon}</span>
                <h3 className="topic-title">{topic.name}</h3>
                <p className="topic-description">{topic.description}</p>
                <div className="topic-meta">
                  <span className={`topic-badge ${topic.difficulty}`}>
                    {topic.difficulty}
                  </span>
                  <span className="topic-questions">
                    {topic.question_count} questions
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="theme-toggle"
        aria-label="Toggle theme"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </div>
  );
}