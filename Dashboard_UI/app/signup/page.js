'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function CustomerSignUp() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Set user display name
      await updateProfile(user, {
        displayName: name.trim()
      });

      const token = await user.getIdToken();

      localStorage.setItem('userToken', token);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', name.trim());
      localStorage.setItem('userUID', user.uid);

      alert('Account created successfully!');
      router.push('/');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already registered.');
      } else {
        setError(err.message || 'Registration failed.');
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
            <span style={{ fontSize: '3rem' }}>🌱</span>
            <h2 style={{ marginTop: '0.5rem', color: 'var(--primary)' }}>Create Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Join the Amaira Fruits family</p>
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

          <form onSubmit={handleSignUpSubmit} style={{ marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Enter your name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
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
            <div className="form-group">
              <label>Password (Min. 6 characters)</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Create password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label>Confirm Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Confirm password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </section>
  );
}
