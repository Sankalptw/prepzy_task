'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

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

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <span className="nav-logo-icon">🧠</span>
            <span>Smart Quiz Arena</span>
          </Link>
          <div className="nav-links">
            {user ? (
              <>
                <Link href="/dashboard" className="btn btn-secondary">
                  Dashboard
                </Link>
                <Link href="/dashboard" className="btn btn-primary">
                  Start Learning
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link href="/signup" className="btn btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '6rem 0', background: 'linear-gradient(135deg, var(--gray-50) 0%, var(--primary-blue-light) 100%)' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
              Learn Smarter, Score Higher!
            </div>
            
            <h1 style={{ fontSize: '3.5rem', fontWeight: '900', lineHeight: '1.1', marginBottom: '1.5rem', color: 'var(--gray-900)' }}>
              Master <span style={{ background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-orange-dark))', padding: '0.25rem 1.5rem', borderRadius: 'var(--radius-md)', color: 'white', display: 'inline-block', transform: 'rotate(-1deg)' }}>Any Subject</span> with Personalized Learning & Smart Practice
            </h1>
            
            <p style={{ fontSize: '1.25rem', color: 'var(--gray-600)', marginBottom: '2.5rem', lineHeight: '1.7' }}>
              Take smart quizzes, get instant AI-powered feedback, and compete on leaderboards. 
              Our adaptive system makes learning engaging and effective.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={user ? '/dashboard' : '/signup'} className="btn btn-primary btn-large">
                {user ? 'Go to Dashboard' : 'Try Quiz for Free'} →
              </Link>
              <Link href="#features" className="btn btn-outline btn-large">
                Explore Features →
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>40+</div>
                <div style={{ color: 'var(--gray-600)', fontWeight: '600' }}>Practice Questions</div>
              </div>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--accent-orange)', marginBottom: '0.5rem' }}>4</div>
                <div style={{ color: 'var(--gray-600)', fontWeight: '600' }}>Quiz Topics</div>
              </div>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--success)', marginBottom: '0.5rem' }}>3</div>
                <div style={{ color: 'var(--gray-600)', fontWeight: '600' }}>Difficulty Levels</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '6rem 0' }}>
        <div className="container">
          <div className="page-header">
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
              Why Choose Us
            </div>
            <h2 className="page-title">Features Tailored for Your Success</h2>
            <p className="page-subtitle">
              Explore AI-powered quizzes designed to make learning engaging and effective. 
              Master subjects with interactive lessons, instant feedback, and expert guidance.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            <div className="card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--gray-900)' }}>
                Adaptive Difficulty
              </h3>
              <p style={{ color: 'var(--gray-600)', lineHeight: '1.7' }}>
                Questions automatically adjust to your skill level. Get easier questions when struggling, 
                harder ones when excelling. Smart learning that grows with you.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--gray-900)' }}>
                Smart Analytics
              </h3>
              <p style={{ color: 'var(--gray-600)', lineHeight: '1.7' }}>
                Get detailed insights on your performance. Know your strengths and areas that need improvement 
                with AI-powered analysis and recommendations.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--gray-900)' }}>
                Compete & Learn
              </h3>
              <p style={{ color: 'var(--gray-600)', lineHeight: '1.7' }}>
                See how you rank against other learners. Track your progress, celebrate achievements, 
                and stay motivated with our global leaderboard.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--gray-900)' }}>
                Instant Feedback
              </h3>
              <p style={{ color: 'var(--gray-600)', lineHeight: '1.7' }}>
                Get immediate explanations for every answer. Learn from mistakes instantly with detailed 
                breakdowns and helpful tips for improvement.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--gray-900)' }}>
                Multiple Topics
              </h3>
              <p style={{ color: 'var(--gray-600)', lineHeight: '1.7' }}>
                From JavaScript to General Knowledge, practice across various subjects. 
                Build comprehensive knowledge and become well-rounded.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏱️</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--gray-900)' }}>
                Timed Practice
              </h3>
              <p style={{ color: 'var(--gray-600)', lineHeight: '1.7' }}>
                Practice under real exam conditions with timed questions. Build speed and accuracy 
                to perform better when it matters most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 0', background: 'var(--gray-50)' }}>
        <div className="container">
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary-blue), #00A3FF)', 
            borderRadius: 'var(--radius-xl)', 
            padding: '4rem 3rem', 
            textAlign: 'center',
            color: 'white',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>
              Ready to Level Up Your Skills?
            </h2>
            <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.95 }}>
              Join thousands of learners and start your journey to mastery today. It's free!
            </p>
            <Link 
              href={user ? '/dashboard' : '/signup'} 
              className="btn btn-large"
              style={{ 
                background: 'white', 
                color: 'var(--primary-blue)',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              {user ? 'Start a Quiz' : 'Create Free Account'} →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--white)', borderTop: '1px solid var(--gray-200)', padding: '2rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', color: 'var(--gray-600)' }}>
            <p style={{ marginBottom: '0.5rem', fontWeight: '600' }}>© 2025 Smart Quiz Arena</p>
            <p style={{ fontSize: '0.875rem' }}>Built for Prepzy.ai Full Stack Developer Challenge</p>
          </div>
        </div>
      </footer>

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