'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminOrdersRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>
      Redirecting to Customer Orders in Dashboard...
    </div>
  );
}
