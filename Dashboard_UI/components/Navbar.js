'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [customerName, setCustomerName] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    // Check local storage for session states on render and path changes
    const adminToken = localStorage.getItem('adminToken');
    setIsAdmin(!!adminToken);

    const userToken = localStorage.getItem('userToken');
    const storedName = localStorage.getItem('userName');
    if (userToken && storedName) {
      setCustomerName(storedName);
    } else {
      setCustomerName(null);
    }
    // Close mobile menu on page navigate
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleCustomerSignOut = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userUID');
    // Reload page to reset states
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="nav-wrapper">
            <Link href="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/logo.png" alt="Amaira Fruits" style={{ height: '40px', width: 'auto' }} />
            </Link>
            
            {/* Desktop Navigation */}
            <nav>
              <ul className="nav-links">
                <li>
                  <Link href="/" className={pathname === '/' ? 'active' : ''}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className={pathname.startsWith('/shop') ? 'active' : ''}>
                    Fruits
                  </Link>
                </li>
                <li>
                  <Link href="/gift" className={pathname === '/gift' ? 'active' : ''}>
                    Corporate Gift
                  </Link>
                </li>
                <li>
                  <Link href="/about" className={pathname === '/about' ? 'active' : ''}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/track" className={pathname === '/track' ? 'active' : ''}>
                    Track Order
                  </Link>
                </li>
                
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <Link href="/cart" className="cart-nav-link" style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '0.4rem', color: 'var(--primary)' }}>
                    <span style={{ fontSize: '1.25rem' }}>🛒</span>
                    {cartCount > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        backgroundColor: 'var(--accent)',
                        color: 'white',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        transform: 'translate(25%, -25%)'
                      }}>
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>
                

                {isAdmin && (
                  <li>
                    <Link href="/admin/dashboard" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                      Admin Area
                    </Link>
                  </li>
                )}

                {customerName ? (
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Link href="/account" className={pathname === '/account' ? 'active' : ''} style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '600', textDecoration: 'underline' }}>
                      Hi, {customerName.split(' ')[0]}
                    </Link>
                    <button onClick={handleCustomerSignOut} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      Sign Out
                    </button>
                  </li>
                ) : (
                  !isAdmin && (
                    <li>
                      <Link href="/login" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                        Login
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>

            {/* Mobile Hamburger Toggle Button */}
            <button className="hamburger" onClick={toggleMobileMenu} aria-label="Toggle Menu">
              <span style={{ transform: mobileMenuOpen ? 'rotate(45deg) translate(2px, 2px)' : 'none' }}></span>
              <span style={{ opacity: mobileMenuOpen ? '0' : '1', transform: mobileMenuOpen ? 'scale(0)' : 'none' }}></span>
              <span style={{ transform: mobileMenuOpen ? 'rotate(-45deg) translate(1px, -1px)' : 'none' }}></span>
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Sidebar Menu Drawer */}
      <div className={`drawer-backdrop ${mobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu}></div>
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <img src="/logo.png" alt="Amaira Fruits" style={{ height: '36px', width: 'auto' }} />
        </div>
        <ul className="drawer-links">
          <li>
            <Link href="/" className={pathname === '/' ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/shop" className={pathname.startsWith('/shop') ? 'active' : ''}>
              Fruits Shop
            </Link>
          </li>
          <li>
            <Link href="/gift" className={pathname === '/gift' ? 'active' : ''}>
              Corporate Gift
            </Link>
          </li>
          <li>
            <Link href="/about" className={pathname === '/about' ? 'active' : ''}>
              About Us
            </Link>
          </li>
          <li>
            <Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>
              Contact
            </Link>
          </li>
          <li>
            <Link href="/track" className={pathname === '/track' ? 'active' : ''}>
              Track Order
            </Link>
          </li>
          
          <li>
            <Link href="/cart" className={pathname === '/cart' ? 'active' : ''} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🛒 Cart</span>
              {cartCount > 0 && (
                <span className="badge badge-accent">{cartCount} items</span>
              )}
            </Link>
          </li>
          
          {isAdmin && (
            <li style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '1.5rem' }}>
              <Link href="/admin/dashboard" className="btn btn-secondary" style={{ width: '100%', padding: '0.6rem 1rem' }}>
                Admin Area
              </Link>
            </li>
          )}

          {customerName ? (
            <li style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link href="/account" style={{ fontWeight: '600', color: 'var(--primary)', textAlign: 'center', textDecoration: 'underline' }}>
                Hi, {customerName} (My Account)
              </Link>
              <button onClick={handleCustomerSignOut} className="btn btn-outline" style={{ width: '100%', padding: '0.6rem 1rem' }}>
                Sign Out
              </button>
            </li>
          ) : (
            !isAdmin && (
              <li style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link href="/login" className="btn btn-primary" style={{ width: '100%', padding: '0.6rem 1rem', textAlign: 'center' }}>
                  Sign In
                </Link>
                <Link href="/signup" className="btn btn-outline" style={{ width: '100%', padding: '0.6rem 1rem', textAlign: 'center' }}>
                  Register
                </Link>
              </li>
            )
          )}
        </ul>
      </div>
    </>
  );
}
