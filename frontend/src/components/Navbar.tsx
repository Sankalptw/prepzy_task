'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href={user ? '/dashboard' : '/'} className="nav-logo">
          <span className="nav-logo-icon">🧠</span>
          <span>Smart Quiz Arena</span>
        </Link>

        <div className="nav-links">
          {user ? (
            <>
              <Link 
                href="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                📚 Dashboard
              </Link>
              <Link 
                href="/leaderboard" 
                className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}
              >
                🏆 Leaderboard
              </Link>
              <Link 
                href="/profile" 
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              >
                👤 Profile
              </Link>
              
              <div className="nav-user-info">
                <div className="nav-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="nav-username">{user.username}</span>
              </div>
              
              <button onClick={handleLogout} className="btn btn-secondary btn-small">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary btn-small">
                Login
              </Link>
              <Link href="/signup" className="btn btn-primary btn-small">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}