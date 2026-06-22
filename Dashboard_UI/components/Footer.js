'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <img src="/logo.png" alt="Amaira Fruits" style={{ height: '40px', width: 'auto' }} />
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '350px' }}>
              Amaira Fruits (AF) is an Agritech Premium Fruit chain bringing fresh, safe, and handpicked quality fruits from the best orchards directly to your doorstep.
            </p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/shop">Fruits Shop</a></li>
              <li><a href="/gift">Corporate Gifts</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/track">Track Order</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact Info</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>📞 Phone: +880 1740-414134</p>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>✉️ Email: sales@amairafruits.com</p>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>📍 Address: Banani, Dhaka, Bangladesh</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} Amaira Fruits. All rights reserved. Made for premium quality fruit delivery.</p>
        </div>
      </div>
    </footer>
  );
}
