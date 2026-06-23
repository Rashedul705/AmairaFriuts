'use client';

import { useState, useEffect } from 'react';

export default function GTMDebugPanel() {
  const [events, setEvents] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [lastEventTime, setLastEventTime] = useState(null);
  const [timeAgo, setTimeAgo] = useState('No events');

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;

    const TARGET_EVENTS = ['view_item', 'add_to_cart', 'begin_checkout', 'purchase'];

    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];

    // Capture existing events in case some were pushed before component mounted
    const existingEvents = window.dataLayer.filter(item => item && TARGET_EVENTS.includes(item.event));
    if (existingEvents.length > 0) {
      setEvents(existingEvents.map(e => ({ ...e, _timestamp: new Date() })).reverse());
      setLastEventTime(new Date());
    }

    // Override push method to capture events in real-time
    const originalPush = window.dataLayer.push;
    window.dataLayer.push = function(...args) {
      const item = args[0];
      if (item && TARGET_EVENTS.includes(item.event)) {
        const newEvent = { ...item, _timestamp: new Date() };
        // We put the new event at the top of the array
        setEvents(prev => [newEvent, ...prev]);
        setLastEventTime(new Date());
      }
      return originalPush.apply(window.dataLayer, args);
    };

    return () => {
      // Restore original push when unmounting
      window.dataLayer.push = originalPush;
    };
  }, []);

  useEffect(() => {
    if (!lastEventTime) return;
    
    // Update the "time ago" string every second
    const interval = setInterval(() => {
      const diffInSeconds = Math.floor((new Date() - lastEventTime) / 1000);
      if (diffInSeconds < 60) {
        setTimeAgo(`${diffInSeconds}s ago`);
      } else {
        const mins = Math.floor(diffInSeconds / 60);
        setTimeAgo(`${mins}m ago`);
      }
    }, 1000);
    
    // Initial call right away
    const diffInSeconds = Math.floor((new Date() - lastEventTime) / 1000);
    setTimeAgo(diffInSeconds < 60 ? `${diffInSeconds}s ago` : `${Math.floor(diffInSeconds / 60)}m ago`);
    
    return () => clearInterval(interval);
  }, [lastEventTime]);

  if (process.env.NODE_ENV !== 'development') return null;

  const clearEvents = () => {
    setEvents([]);
    setLastEventTime(null);
    setTimeAgo('No events');
  };

  const isRecent = lastEventTime && (new Date() - lastEventTime) < 5000; // blink green if event happened in last 5s

  const renderSafe = (val) => {
    if (val === null || val === undefined) return 'N/A';
    if (typeof val === 'object') {
      return val.id || val._id || val.title || val.name || JSON.stringify(val);
    }
    return String(val);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: isMinimized ? '220px' : '350px',
      maxHeight: isMinimized ? '40px' : '80vh',
      backgroundColor: '#1e293b',
      color: '#f8fafc',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
      zIndex: 99999,
      fontFamily: 'monospace, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      border: '1px solid #334155'
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 15px',
        backgroundColor: '#0f172a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        borderBottom: isMinimized ? 'none' : '1px solid #334155'
      }} onClick={() => setIsMinimized(!isMinimized)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: lastEventTime ? '#22c55e' : '#64748b',
            boxShadow: isRecent ? '0 0 8px #22c55e' : 'none',
            transition: 'all 0.3s'
          }} />
          <span style={{ fontWeight: 'bold', fontSize: '13px' }}>
            GTM Debug
            {!isMinimized && <span style={{ marginLeft: '8px', fontSize: '11px', color: '#94a3b8', fontWeight: 'normal' }}>{timeAgo}</span>}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isMinimized && <span style={{ fontSize: '11px', color: '#22c55e' }}>{timeAgo}</span>}
          <span style={{ color: '#94a3b8', fontSize: '10px' }}>{isMinimized ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '5px' }}>
            <span style={{ color: '#94a3b8' }}>Total Events: {events.length}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); clearEvents(); }}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold'
              }}
            >
              Clear
            </button>
          </div>

          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>Waiting for events...</div>
          ) : (
            events.map((ev, i) => (
              <div key={i} style={{
                backgroundColor: '#334155',
                padding: '12px',
                borderRadius: '6px',
                borderLeft: '4px solid #3b82f6'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid #475569', paddingBottom: '6px' }}>
                  <strong style={{ fontSize: '13px', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{ev.event}</strong>
                  <span style={{ color: '#94a3b8', fontSize: '10px' }}>{ev._timestamp.toLocaleTimeString()}</span>
                </div>
                
                {ev.ecommerce && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {ev.event === 'purchase' && ev.ecommerce.transaction_id && (
                      <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>Trans ID: {renderSafe(ev.ecommerce.transaction_id)}</div>
                    )}
                    <div style={{ color: '#f8fafc', fontWeight: '500' }}>
                      Value: <span style={{ color: '#34d399' }}>{renderSafe(ev.ecommerce.currency)} {renderSafe(ev.ecommerce.value)}</span>
                    </div>
                    {ev.ecommerce.items && ev.ecommerce.items.length > 0 && (
                      <div style={{ marginTop: '4px' }}>
                        <div style={{ color: '#94a3b8', marginBottom: '4px', fontSize: '11px' }}>Items ({ev.ecommerce.items.length}):</div>
                        {ev.ecommerce.items.map((item, idx) => (
                          <div key={idx} style={{ 
                            padding: '6px', 
                            backgroundColor: '#1e293b',
                            borderRadius: '4px',
                            marginBottom: '4px',
                            color: '#e2e8f0'
                          }}>
                            <div style={{ fontWeight: '500', marginBottom: '2px' }}>{renderSafe(item.item_name)} <span style={{ color: '#fbbf24' }}>(x{renderSafe(item.quantity)})</span></div>
                            <div style={{ fontSize: '10px', color: '#94a3b8' }}>ID: {renderSafe(item.item_id)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
