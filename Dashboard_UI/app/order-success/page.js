'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderID = searchParams.get('orderID');

  return (
    <div className="section-padding" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ 
          backgroundColor: 'var(--bg-card)', 
          padding: '3rem', 
          borderRadius: '1rem', 
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h1 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Order Placed Successfully!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Thank you for your purchase. We are processing your order and will contact you shortly.
          </p>
          
          {orderID && (
            <div style={{ 
              backgroundColor: 'var(--secondary)', 
              padding: '1.5rem', 
              borderRadius: '0.5rem', 
              marginBottom: '2rem',
              border: '1px dashed var(--primary)'
            }}>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Your Tracking ID</p>
              <h2 style={{ color: 'var(--primary)', margin: '0.5rem 0 0 0', letterSpacing: '1px' }}>
                {orderID}
              </h2>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/shop" className="btn btn-outline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
