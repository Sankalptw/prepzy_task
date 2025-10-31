'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signup(username, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
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
          <h2>Create Account</h2>
          <p>Start your learning journey today</p>
        </div>

        {/* Signup Form */}
        <div className="form-box">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-box">
                <span>⚠️</span>
                <p className="error-text">{error}</p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  className="form-input"
                  placeholder="johndoe"
                  suppressHydrationWarning
                />
              </div>
            </div>

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
                  suppressHydrationWarning
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
                  minLength={8}
                  className="form-input"
                  placeholder="••••••••"
                  suppressHydrationWarning
                />
              </div>
              <p className="helper-text">
                Must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              suppressHydrationWarning
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="form-footer">
            <p>
              Already have an account?{' '}
              <Link href="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}