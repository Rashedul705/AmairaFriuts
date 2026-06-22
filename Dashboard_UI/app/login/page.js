'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function CustomerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If logged in, redirect to home
    const token = localStorage.getItem('userToken');
    if (token) {
      router.push('/');
    }
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      // Store token and details
      localStorage.setItem('userToken', token);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.displayName || 'Customer');
      localStorage.setItem('userUID', user.uid);
      
      router.push('/');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      localStorage.setItem('userToken', token);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.displayName || 'Customer');
      localStorage.setItem('userUID', user.uid);

      router.push('/');
    } catch (err) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google Sign-In failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-padding" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '450px' }}>
        <div className="card animate-slide-up" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img src="/logo.png" alt="Amaira Fruits" style={{ height: '60px', width: 'auto', margin: '0 auto' }} />
            <h2 style={{ marginTop: '0.5rem', color: 'var(--primary)' }}>Customer Login</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Welcome back to Amaira Fruits</p>
          </div>

          {error && (
            <div style={{ 
              backgroundColor: '#ffebee', 
              color: '#c62828', 
              padding: '0.75rem 1rem', 
              borderRadius: '0.5rem', 
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              border: '1px solid #ffcdd2'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} style={{ marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="Enter email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
              <Link href="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-muted)' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
            <span style={{ padding: '0 0.75rem', fontSize: '0.8rem', fontWeight: '600' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          </div>

          {/* Google Button */}
          <button 
            type="button" 
            onClick={handleGoogleLogin} 
            className="btn btn-outline" 
            style={{ width: '100%', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.91c1.7-1.56 2.68-3.86 2.68-6.57z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.24c-.8.54-1.84.87-3.05.87-2.35 0-4.33-1.58-5.04-3.71H.92v2.3C2.4 15.98 5.48 18 9 18z"/>
              <path fill="#FBBC05" d="M3.96 10.74A5.4 5.4 0 0 1 3.6 9c0-.6.1-1.18.27-1.74V4.96H.92A8.99 8.99 0 0 0 0 9c0 1.46.35 2.85.92 4.04l3.04-2.3z"/>
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.4 2.02.92 4.96l3.04 2.3C4.67 5.16 6.65 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            New to Amaira Fruits?{' '}
            <Link href="/signup" style={{ color: 'var(--primary)', fontWeight: '700' }}>
              Sign Up
            </Link>
          </p>

        </div>
      </div>
    </section>
  );
}
