'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState('Admin');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const storedUsername = localStorage.getItem('adminUsername');
    
    if (!token) {
      router.push('/admin/login');
    } else if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    router.push('/');
  };

  return (
    <div style={{ 
      backgroundColor: 'var(--primary)', 
      color: '#ffffff', 
      padding: '1rem 0',
      marginBottom: '2rem',
      borderRadius: '0.5rem',
      boxShadow: 'var(--shadow-md)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: '800', fontSize: '1.1rem', borderRight: '1px solid rgba(255,255,255,0.2)', paddingRight: '1.5rem' }}>
            ⚙️ Control Panel
          </span>
          <Link href="/admin/dashboard" className={`btn btn-secondary ${pathname === '/admin/dashboard' ? 'active' : ''}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: pathname === '/admin/dashboard' ? 'var(--primary)' : 'white', backgroundColor: pathname === '/admin/dashboard' ? 'white' : 'transparent' }}>
            Overview
          </Link>
          <Link href="/admin/products" className={`btn btn-secondary ${pathname === '/admin/products' ? 'active' : ''}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: pathname === '/admin/products' ? 'var(--primary)' : 'white', backgroundColor: pathname === '/admin/products' ? 'white' : 'transparent' }}>
            Products
          </Link>
          <Link href="/admin/orders" className={`btn btn-secondary ${pathname === '/admin/orders' ? 'active' : ''}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: pathname === '/admin/orders' ? 'var(--primary)' : 'white', backgroundColor: pathname === '/admin/orders' ? 'white' : 'transparent' }}>
            Orders
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Logged in as: <strong>{username}</strong></span>
          <button onClick={handleLogout} className="btn btn-accent" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
