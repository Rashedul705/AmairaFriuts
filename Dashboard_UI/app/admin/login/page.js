'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      router.push('/admin/dashboard');
    }
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sign in via Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      
      // Fetch user ID Token to secure backend requests
      const token = await userCredential.user.getIdToken();

      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUsername', userCredential.user.email);
      
      router.push('/admin/dashboard');
    } catch (err) {
      console.error(err);
      // Friendly messages for Firebase codes
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Check your internet connection.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
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
            <span style={{ fontSize: '3rem' }}>🔑</span>
            <h2 style={{ marginTop: '0.5rem', color: 'var(--primary)' }}>Admin Portal</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Amaira Fruits Store Manager</p>
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

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="Enter email (e.g. admin@amairafruits.com)" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="form-group" style={{ marginBottom: '2rem' }}>
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
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
