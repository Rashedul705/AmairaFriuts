'use client';

import { useState } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage('A password reset link has been sent to your email. Please check your inbox and spam folders.');
      setEmail('');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else {
        setError(err.message || 'Failed to send password reset email.');
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
            <span style={{ fontSize: '3rem' }}>🔒</span>
            <h2 style={{ marginTop: '0.5rem', color: 'var(--primary)' }}>Reset Password</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>We will send you a password reset link</p>
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

          {message && (
            <div style={{ 
              backgroundColor: 'var(--primary-light)', 
              color: 'var(--primary)', 
              padding: '0.75rem 1rem', 
              borderRadius: '0.5rem', 
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              border: '1px solid var(--border-color)'
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleResetSubmit} style={{ marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: '2rem' }}>
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
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Remember your password?{' '}
            <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </section>
  );
}
