'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Navbar */}
      <nav>
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <span>🧠</span>
            <span>Smart Quiz Arena</span>
          </Link>
          <div className="nav-links">
            {user ? (
              <>
                <Link href="/dashboard" className="btn btn-secondary">
                  Dashboard
                </Link>
                <Link href="/dashboard" className="btn btn-primary">
                  Start Quiz
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link href="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>
            Test Your Knowledge,
            <span className="highlight">Level Up Your Skills</span>
          </h1>
          <p>
            An adaptive quiz platform with intelligent insights. Questions get harder as you improve. 
            Compete with others and track your progress.
          </p>
          <div className="hero-buttons">
            <Link href={user ? '/dashboard' : '/signup'} className="btn btn-primary btn-large">
              {user ? 'Go to Dashboard' : 'Get Started'} →
            </Link>
            <Link href="#features" className="btn btn-outline btn-large">
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="stats">
            <div>
              <div className="stat-number">40+</div>
              <div className="stat-label">Questions</div>
            </div>
            <div>
              <div className="stat-number">4</div>
              <div className="stat-label">Topics</div>
            </div>
            <div>
              <div className="stat-number">3</div>
              <div className="stat-label">Difficulty Levels</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Smart Quiz Arena?</h2>
            <p>We combine adaptive learning with social features to make studying effective and engaging.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon icon-blue">⚡</div>
              <h3>Adaptive Difficulty</h3>
              <p>Questions automatically adjust to your skill level. Get easier questions when struggling, harder ones when excelling.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-green">📈</div>
              <h3>Smart Analytics</h3>
              <p>Get detailed insights on your performance. Know your strengths and areas that need improvement.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-purple">🏆</div>
              <h3>Compete & Learn</h3>
              <p>See how you rank against other learners. Track your progress and celebrate achievements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to Get Started?</h2>
            <p>Join now and start improving your skills today.</p>
            <Link href={user ? '/dashboard' : '/signup'} className="btn btn-large">
              {user ? 'Start a Quiz' : 'Create Free Account'} →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <p>&copy; 2025 Smart Quiz Arena. Built for Prepzy.ai challenge.</p>
        </div>
      </footer>
    </div>
  );
}