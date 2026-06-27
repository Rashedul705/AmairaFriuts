'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderID = searchParams.get('orderID');
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderID) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const res = await fetch(`${apiUrl}/api/orders/track/${encodeURIComponent(orderID)}`);
        const data = await res.json();
        
        if (res.ok && data.length > 0) {
          const orderData = data[0];
          setOrder(orderData); // Tracking returns an array

          const transactionId = orderData.order_number || orderID;
          const storageKey = 'gtm_purchased_' + transactionId;
          
          if (!sessionStorage.getItem(storageKey)) {
            sessionStorage.setItem(storageKey, '1');
            
            const customerName = orderData.customer_snapshot?.name || '';
            const nameParts = customerName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            const phone = orderData.customer_snapshot?.phone || '';
            const address = orderData.customer_snapshot?.address || '';

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ ecommerce: null });
            window.dataLayer.push({
              event: 'purchase',
              ecommerce: {
                transaction_id: transactionId,
                value: orderData.total,
                currency: 'BDT',
                items: (orderData.items || []).map(item => ({
                  item_id: item.product_id || item._id,
                  item_name: item.product_name || item.name,
                  category: item.variant_name || 'Uncategorized',
                  price: item.price_per_kg || item.price,
                  quantity: item.quantity_kg || item.quantity
                }))
              },
              orderData: {
                customer: {
                  billing: {
                    email: "",
                    phone: phone,
                    first_name: firstName,
                    last_name: lastName,
                    country: "Bangladesh",
                    city: address,
                    postal_code: ""
                  }
                }
              }
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch order details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderID]);

  const getStatusStepIndex = (status) => {
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <div className="section-padding" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ 
          backgroundColor: 'var(--bg-card)', 
          padding: '3rem', 
          borderRadius: '1rem', 
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)'
        }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Thank You!</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
              Your order has been placed successfully. We are processing your fresh fruits and will dispatch them shortly.
            </p>
          </div>
          
          {orderID && !loading && (
            <div style={{ 
              backgroundColor: 'var(--secondary)', 
              padding: '1.5rem', 
              borderRadius: '0.5rem', 
              marginBottom: '2rem',
              border: '1px dashed var(--primary)',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Your Order Number</p>
              <h2 style={{ color: 'var(--primary)', margin: '0.5rem 0 0 0', letterSpacing: '1px' }}>
                {orderID}
              </h2>
            </div>
          )}

          {/* Tracking System Integration */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              Loading tracking information...
            </div>
          ) : order ? (
            <div style={{ marginTop: '3rem', marginBottom: '2rem' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>Live Order Tracking</h3>
              
              {/* Timeline Stepper */}
              {order.order_status !== 'cancelled' ? (
                <div style={{ position: 'relative', marginBottom: '2.5rem', padding: '0 1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                    
                    {/* Connecting Line */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '1rem', 
                      left: '5%', 
                      right: '5%', 
                      height: '4px', 
                      backgroundColor: '#e2e8f0', 
                      zIndex: 1 
                    }}></div>
                    
                    {/* Progress Line */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '1rem', 
                      left: '5%', 
                      width: `${getStatusStepIndex(order.order_status) * 33.33}%`, 
                      height: '4px', 
                      backgroundColor: 'var(--primary)', 
                      zIndex: 2, 
                      transition: 'width 0.5s ease-in-out'
                    }}></div>

                    {/* Nodes */}
                    {STATUS_STEPS.map((step, idx) => {
                      const isActive = idx <= getStatusStepIndex(order.order_status);
                      return (
                        <div key={step} style={{ 
                          zIndex: 3, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          width: '25%' 
                        }}>
                          <div style={{ 
                            width: '2.5rem', 
                            height: '2.5rem', 
                            borderRadius: '50%', 
                            backgroundColor: isActive ? 'var(--primary)' : '#e2e8f0', 
                            color: isActive ? '#ffffff' : 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            border: '3px solid #ffffff',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}>
                            {isActive ? '✓' : idx + 1}
                          </div>
                          <span style={{ 
                            fontSize: '0.8rem', 
                            fontWeight: '600', 
                            marginTop: '0.5rem',
                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                            textAlign: 'center',
                            textTransform: 'capitalize'
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
                  backgroundColor: '#ffebee', color: '#c62828', padding: '1rem', 
                  borderRadius: '0.5rem', fontWeight: '700', textAlign: 'center' 
                }}>
                  🛑 This order has been CANCELLED.
                </div>
              )}
            </div>
          ) : null}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <Link href="/track" className="btn btn-outline">
              Track Another Order
            </Link>
            <Link href="/shop" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="section-padding" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>Loading your order details...</div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
