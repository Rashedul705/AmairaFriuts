'use client';

import { useState } from 'react';

const STATUS_STEPS = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

export default function TrackOrder() {
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    setError('');
    setOrders([]);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await fetch(`${apiUrl}/api/orders/track/${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (res.ok) {
        setOrders(data);
      } else {
        setError(data.message || 'No orders found matching the details');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStepIndex = (status) => {
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <section className="section-padding" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="text-center" style={{ marginBottom: '1rem' }}>Track Your Order</h1>
        <p className="text-center" style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
          Enter your Order ID (e.g., AM-A1B2C) or the mobile phone number used during checkout.
        </p>

        {/* Tracking Search Form */}
        <div className="card" style={{ padding: '2rem', marginBottom: '3rem' }}>
          <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <input 
                type="text" 
                placeholder="Enter Order ID or Mobile Number" 
                className="form-control"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Track Status'}
            </button>
          </form>
        </div>

        {/* Search Results */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--primary)', fontWeight: '600' }}>
            Loading tracking information...
          </div>
        )}

        {searched && !loading && error && (
          <div style={{ 
            backgroundColor: '#ffebee', 
            border: '1px solid #ffcdd2', 
            color: '#c62828', 
            padding: '1.5rem', 
            borderRadius: '0.5rem', 
            textAlign: 'center' 
          }}>
            <p>{error}</p>
          </div>
        )}

        {searched && !loading && orders.length > 0 && (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {orders.map((order) => {
              const currentStep = getStatusStepIndex(order.orderStatus);
              const isCancelled = order.orderStatus === 'Cancelled';

              return (
                <div key={order._id} className="card" style={{ padding: '2rem', borderLeft: '5px solid var(--primary)' }}>
                  
                  {/* Order Header info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Order ID</span>
                      <h3 style={{ margin: 0 }}>{order.orderID}</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Date Placed</span>
                      <div style={{ fontWeight: '600' }}>{new Date(order.createdAt).toLocaleDateString('en-GB')}</div>
                    </div>
                  </div>

                  {/* Order Status Timeline (Stepper) */}
                  {!isCancelled ? (
                    <div style={{ marginBottom: '2.5rem', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '0.5rem' }}>
                        {/* Connecting Line */}
                        <div style={{ 
                          position: 'absolute', 
                          top: '50%', 
                          left: '5%', 
                          right: '5%', 
                          height: '4px', 
                          backgroundColor: '#e2e8f0', 
                          zIndex: 1, 
                          transform: 'translateY(-50%)' 
                        }}></div>
                        <div style={{ 
                          position: 'absolute', 
                          top: '50%', 
                          left: '5%', 
                          width: `${currentStep * 30}%`, 
                          height: '4px', 
                          backgroundColor: 'var(--primary)', 
                          zIndex: 2, 
                          transform: 'translateY(-50%)',
                          transition: 'width 0.5s ease-in-out'
                        }}></div>

                        {/* Step Nodes */}
                        {STATUS_STEPS.map((step, idx) => {
                          const isActive = idx <= currentStep;
                          return (
                            <div key={step} style={{ 
                              zIndex: 3, 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center',
                              width: '20%' 
                            }}>
                              <div style={{ 
                                width: '2rem', 
                                height: '2rem', 
                                borderRadius: '50%', 
                                backgroundColor: isActive ? 'var(--primary)' : '#e2e8f0', 
                                color: isActive ? '#ffffff' : 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '0.9rem',
                                border: '3px solid #ffffff',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}>
                                {isActive ? '✓' : idx + 1}
                              </div>
                              <span style={{ 
                                fontSize: '0.75rem', 
                                fontWeight: '600', 
                                marginTop: '0.5rem',
                                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                textAlign: 'center'
                              }}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div style={{ 
                      backgroundColor: '#ffebee', 
                      color: '#c62828', 
                      padding: '1rem', 
                      borderRadius: '0.5rem', 
                      fontWeight: '700', 
                      textAlign: 'center', 
                      marginBottom: '2rem' 
                    }}>
                      🛑 This order has been CANCELLED.
                    </div>
                  )}

                  {/* Order Details Body */}
                  <div className="grid grid-2" style={{ gap: '1.5rem', fontSize: '0.95rem' }}>
                    
                    {/* Items */}
                    <div>
                      <h4 style={{ marginBottom: '0.75rem' }}>Order Details</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span>Item:</span>
                        <strong>{order.productTitle}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span>Variant:</span>
                        <strong>{order.variant}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span>Quantity:</span>
                        <strong>{order.quantity} Pcs</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span>Shipping Fee:</span>
                        <strong>৳ {order.shippingFee}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', color: 'var(--primary)', fontSize: '1.1rem' }}>
                        <span>Total Paid:</span>
                        <strong>৳ {order.totalAmount}</strong>
                      </div>
                    </div>

                    {/* Customer */}
                    <div>
                      <h4 style={{ marginBottom: '0.75rem' }}>Delivery Address</h4>
                      <p style={{ marginBottom: '0.5rem' }}><strong>Customer Name:</strong> {order.customerName}</p>
                      <p style={{ marginBottom: '0.5rem' }}><strong>Phone Number:</strong> {order.phone}</p>
                      <p style={{ marginBottom: '0.5rem' }}><strong>District:</strong> {order.district}</p>
                      <p style={{ color: 'var(--text-muted)' }}>
                        <strong>Full Address:</strong> {order.shippingAddress}
                      </p>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
