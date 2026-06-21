'use client';

import { useState, useEffect } from 'react';

export default function LiveCountdown({ expiryDateString }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!expiryDateString) return;

    const expiryTime = new Date(expiryDateString).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = expiryTime - now;

      if (distance <= 0) {
        setTimeLeft('Offer Expired');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer(); // Initial call
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId); // Cleanup
  }, [expiryDateString]);

  if (!expiryDateString || !timeLeft) return null;

  return (
    <span style={{ 
      fontSize: '0.8rem', 
      color: '#ff6b6b', 
      marginLeft: '0.5rem', 
      fontWeight: '600',
      backgroundColor: '#ffeeee',
      padding: '0.2rem 0.5rem',
      borderRadius: '0.25rem',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem'
    }}>
      ⏳ Price valid for {timeLeft}
    </span>
  );
}
