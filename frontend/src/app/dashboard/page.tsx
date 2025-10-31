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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchTopics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await topicsAPI.getAll();
        setTopics(response.topics || []);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch topics';
        console.error('Failed to fetch topics:', error);
        setError(errorMessage);
        setTopics([]);
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
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <p>Loading topics...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Navbar */}
      <nav>
        <div className="nav-container">
          <Link href="/dashboard" className="nav-logo">
            <span>🧠</span>
            <span>Smart Quiz Arena</span>
          </Link>
          <div className="nav-links">
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Welcome, {user?.username}!
            </span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
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

      {/* Dashboard Content */}
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Choose a Topic
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
            Select a topic to start your quiz journey
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            borderLeft: '4px solid #dc2626',
            padding: '1rem',
            marginBottom: '2rem',
            borderRadius: '0.375rem'
          }}>
            <p style={{ color: '#991b1b', margin: 0 }}>
              <strong>Error:</strong> {error}
            </p>
            <p style={{ color: '#991b1b', margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
              Make sure your backend API is running and accessible.
            </p>
          </div>
        )}

        {/* Topics Grid */}
        {!error && (
          <div className="topics-grid">
            {topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/quiz/${topic.slug}`}
                className="topic-card"
                style={{ textDecoration: 'none' }}
              >
                <div className="topic-icon">{topic.icon}</div>
                <h3 className="topic-title">{topic.name}</h3>
                <p className="topic-description">{topic.description}</p>
                <div className="topic-meta">
                  <span className="topic-badge">{topic.difficulty}</span>
                  <span className="topic-questions">{topic.question_count} questions</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!error && topics.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            color: 'var(--text-secondary)' 
          }}>
            <p>No topics available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}