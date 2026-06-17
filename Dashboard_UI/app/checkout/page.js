'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    district: 'Dhaka',
    shippingAddress: '',
    paymentMethod: 'COD'
  });

  // Calculate Shipping (simplified logic: Dhaka = 80, Outside = 150. Free Delivery if any item has it)
  const [shippingFee, setShippingFee] = useState(80);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) return;
    
    let fee = formData.district.toLowerCase() === 'dhaka' ? 80 : 150;
    
    // Check if any item has free delivery
    const hasFreeDelivery = cartItems.some(item => item.freeDelivery);
    if (hasFreeDelivery) fee = 0;
    
    setShippingFee(fee);
  }, [formData.district, cartItems]);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="section-padding text-center">
        <div className="container">
          <h2>Your cart is empty</h2>
          <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>Please add some items to your cart before checking out.</p>
          <Link href="/shop" className="btn btn-primary">Go to Shop</Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      
      const orderItems = cartItems.map(item => ({
        productId: item._id,
        variant: item.category, // Assuming category as variant fallback for now
        quantity: item.quantity
      }));

      const res = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: orderItems
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      // Success
      clearCart();
      router.push(`/order-success?orderID=${data.orderID}`);

    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-padding">
      <div className="container">
        <h2 style={{ marginBottom: '2rem', borderBottom: '2px solid var(--primary-light)', paddingBottom: '1rem' }}>Secure Checkout</h2>
        
        {error && (
          <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '0.5rem', marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        <div className="cart-container">
          {/* Checkout Form */}
          <div className="cart-items-list">
            <h3 style={{ marginBottom: '1.5rem' }}>Shipping Details</h3>
            <form id="checkout-form" onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Full Name *</label>
                  <input 
                    type="text" 
                    name="customerName"
                    required 
                    value={formData.customerName}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Phone Number *</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required 
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}
                    placeholder="e.g. 01712345678"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>District/City *</label>
                <select 
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}
                >
                  <option value="Dhaka">Dhaka (৳80)</option>
                  <option value="Chittagong">Chittagong (৳150)</option>
                  <option value="Rajshahi">Rajshahi (৳150)</option>
                  <option value="Sylhet">Sylhet (৳150)</option>
                  <option value="Khulna">Khulna (৳150)</option>
                  <option value="Barisal">Barisal (৳150)</option>
                  <option value="Rangpur">Rangpur (৳150)</option>
                  <option value="Mymensingh">Mymensingh (৳150)</option>
                  <option value="Other">Other (৳150)</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Detailed Address *</label>
                <textarea 
                  name="shippingAddress"
                  required 
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  rows="3"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}
                  placeholder="House, Road, Block, Area..."
                />
              </div>

              <h3 style={{ marginBottom: '1rem', marginTop: '2rem' }}>Payment Method</h3>
              <div style={{ padding: '1rem', border: '1px solid var(--primary)', borderRadius: '0.5rem', backgroundColor: 'var(--secondary)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  <input type="radio" name="paymentMethod" value="COD" checked readOnly />
                  Cash on Delivery (COD)
                </label>
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pay safely when your order arrives.</p>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div style={{ alignSelf: 'start' }}>
            <div className="cart-summary">
              <h3>Order Summary</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                {cartItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <span>{item.title} <span style={{ color: 'var(--text-muted)' }}>x{item.quantity}</span></span>
                    <span>৳ {item.basePrice * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span style={{ fontWeight: '600' }}>৳ {cartTotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span style={{ color: 'var(--primary)', fontWeight: '600' }}>
                  {shippingFee === 0 ? 'Free' : `৳ ${shippingFee}`}
                </span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>৳ {cartTotal + shippingFee}</span>
              </div>
              
              <button 
                type="submit"
                form="checkout-form"
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
