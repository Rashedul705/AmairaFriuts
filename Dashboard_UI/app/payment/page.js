'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function PaymentPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState(null);
  const [shippingFee, setShippingFee] = useState(80);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Retrieve checkout data from local storage ONCE on mount
    const savedData = localStorage.getItem('checkoutData');
    if (!savedData) {
      // If no data, redirect back to checkout
      router.push('/checkout');
      return;
    }
    
    const parsedData = JSON.parse(savedData);
    setFormData(parsedData);
  }, [router]);

  useEffect(() => {
    // Re-calculate shipping fee based on retrieved district whenever cart changes
    if (formData && cartItems && cartItems.length > 0) {
      let fee = formData.district.toLowerCase() === 'dhaka' ? 80 : 150;
      const hasFreeDelivery = cartItems.some(item => item.freeDelivery);
      if (hasFreeDelivery) fee = 0;
      setShippingFee(fee);
    }
  }, [cartItems, formData]);

  if (!formData || !cartItems || cartItems.length === 0) {
    return (
      <div className="section-padding text-center">
        <p>Loading payment details...</p>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      
      const orderItems = cartItems.map(item => ({
        productId: item._id,
        productTitle: item.title,
        variant: item.selectedVariant ? item.selectedVariant.label : item.category,
        quantity: item.quantity,
        price: item.selectedVariant ? item.selectedVariant.price : (item.pricePerKg || item.price_per_kg || item.basePrice)
      }));

      const res = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          paymentMethod,
          items: orderItems,
          abandonedCartId: localStorage.getItem('abandonedCartId') || undefined
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      // Clean up and redirect on success
      clearCart();
      localStorage.removeItem('checkoutData');
      localStorage.removeItem('abandonedCartId');
      router.push(`/order-success?orderID=${data.orderID}`);

    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-padding">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
          <h2 style={{ margin: 0 }}>Secure Checkout</h2>
          <span style={{ color: 'var(--text-muted)' }}>&gt; Step 2: Payment</span>
        </div>

        {error && (
          <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '0.5rem', marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        <div className="cart-container">
          {/* Payment Methods */}
          <div className="cart-items-list">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Select Payment Method</h3>
              <Link href="/checkout" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'underline' }}>
                Edit Shipping Info
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Cash on Delivery */}
              <label 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '1.5rem', 
                  border: paymentMethod === 'COD' ? '2px solid var(--primary)' : '1px solid var(--border-color)', 
                  borderRadius: '0.75rem', 
                  backgroundColor: paymentMethod === 'COD' ? 'var(--secondary)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="COD" 
                  checked={paymentMethod === 'COD'} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                  style={{ width: '20px', height: '20px' }}
                />
                <div>
                  <strong style={{ display: 'block', fontSize: '1.1rem' }}>Cash on Delivery (COD)</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pay conveniently when your fresh fruits arrive.</span>
                </div>
              </label>

              {/* bKash (Mockup) */}
              <label 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '1.5rem', 
                  border: paymentMethod === 'bKash' ? '2px solid #e2136e' : '1px solid var(--border-color)', 
                  borderRadius: '0.75rem', 
                  backgroundColor: paymentMethod === 'bKash' ? '#fdf2f6' : 'transparent',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="bKash" 
                  checked={paymentMethod === 'bKash'} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                  style={{ width: '20px', height: '20px' }}
                />
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '1.1rem', color: '#e2136e' }}>bKash Payment</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pay seamlessly with your bKash wallet.</span>
                </div>
                <div style={{ fontWeight: 'bold', color: '#e2136e', fontSize: '1.5rem' }}>bKash</div>
              </label>

              {/* Cards (Mockup) */}
              <label 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '1.5rem', 
                  border: paymentMethod === 'Card' ? '2px solid var(--primary)' : '1px solid var(--border-color)', 
                  borderRadius: '0.75rem', 
                  backgroundColor: paymentMethod === 'Card' ? 'var(--secondary)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="Card" 
                  checked={paymentMethod === 'Card'} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                  style={{ width: '20px', height: '20px' }}
                />
                <div>
                  <strong style={{ display: 'block', fontSize: '1.1rem' }}>Credit / Debit Card</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Visa, MasterCard, Amex via secure gateway.</span>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>💳</div>
              </label>
            </div>
            
            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fcfaf1', borderRadius: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <strong>Delivering to:</strong> {formData.customerName} - {formData.phone}<br/>
              {formData.shippingAddress}, {formData.district}
            </div>

          </div>

          {/* Order Summary */}
          <div style={{ alignSelf: 'start' }}>
            <div className="cart-summary">
              <h3>Final Review</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                {cartItems.map((item, idx) => {
                  const itemPrice = item.selectedVariant ? item.selectedVariant.price : (item.pricePerKg || item.price_per_kg || item.basePrice);
                  const itemLabel = item.selectedVariant ? `(${item.selectedVariant.label})` : '';
                  return (
                    <div key={item.cartItemId || idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                      <span>{item.title} {itemLabel} <span style={{ color: 'var(--text-muted)' }}>x{item.quantity}</span></span>
                      <span>৳ {itemPrice * item.quantity}</span>
                    </div>
                  );
                })}
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
              <div className="summary-total" style={{ borderTop: '2px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
                <span>Total to Pay</span>
                <span style={{ fontSize: '1.5rem' }}>৳ {cartTotal + shippingFee}</span>
              </div>
              
              <button 
                onClick={handlePlaceOrder}
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.1rem' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing Order...' : 'Place Order Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
