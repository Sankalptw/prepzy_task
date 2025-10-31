'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        {/* Logo */}
        <div className="form-header">
          <Link href="/" style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <div className="nav-logo" style={{ justifyContent: 'center' }}>
              <span>🧠</span>
              <span>Smart Quiz Arena</span>
            </div>
          </Link>
          <h2>Welcome Back</h2>
          <p>Login to continue your learning journey</p>
        </div>

        {/* Login Form */}
        <div className="form-box">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-box">
                <span>⚠️</span>
                <p className="error-text">{error}</p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="form-footer">
            <p>
              Don't have an account?{' '}
              <Link href="/signup">Sign up</Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Demo: sankalp@example.com / Test123456
          </p>
        </div>
      </div>
    </div>
  );
}