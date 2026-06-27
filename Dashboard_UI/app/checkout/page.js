'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

const DISTRICTS_BD = [
  "Bagerhat", "Bandarban", "Barguna", "Barisal", "Bhola", "Bogra", "Brahmanbaria", 
  "Chandpur", "Chapainawabganj", "Chattogram", "Chuadanga", "Comilla", "Cox's Bazar", 
  "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj", 
  "Habiganj", "Jamalpur", "Jashore", "Jhalokati", "Jhenaidah", "Joypurhat", 
  "Khagrachari", "Khulna", "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", 
  "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar", 
  "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", 
  "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh", 
  "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur", 
  "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet", 
  "Tangail", "Thakurgaon"
].sort();

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal } = useCart();
  
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    district: 'Dhaka',
    shippingAddress: ''
  });

  // Calculate Shipping (simplified logic: Dhaka = 80, Outside = 150. Free Delivery if any item has it)
  const [shippingFee, setShippingFee] = useState(80);
  const hasTrackedCheckout = useRef(false);

  useEffect(() => {
    // Check local storage for previously entered info
    const savedData = localStorage.getItem('checkoutData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) return;
    
    let fee = formData.district.toLowerCase() === 'dhaka' ? 80 : 150;
    
    // Check if any item has free delivery
    const hasFreeDelivery = cartItems.some(item => item.freeDelivery);
    if (hasFreeDelivery) fee = 0;
    
    setShippingFee(fee);
  }, [formData.district, cartItems]);

  useEffect(() => {
    if (cartItems && cartItems.length > 0 && cartTotal > 0) {
      if (hasTrackedCheckout.current) return;
      hasTrackedCheckout.current = true;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push({
        event: 'begin_checkout',
        ecommerce: {
          currency: 'BDT',
          value: cartTotal,
          items: cartItems.map(item => ({
            item_id: item._id || item.slug,
            item_name: item.title,
            category: item.category,
            price: item.selectedVariant ? item.selectedVariant.price : (item.pricePerKg || item.price_per_kg || item.basePrice),
            quantity: item.quantity
          }))
        }
      });
    }
  }, [cartItems, cartTotal]);

  const [isSubmitting, setIsSubmitting] = useState(false);

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

    try {
      // Log abandoned cart to backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      
      const itemsToLog = cartItems.map(item => ({
        productId: item._id,
        productTitle: item.title,
        variant: item.selectedVariant ? item.selectedVariant.label : item.category,
        quantity: item.quantity,
        price: item.selectedVariant ? item.selectedVariant.price : (item.pricePerKg || item.price_per_kg || item.basePrice)
      }));

      const payload = {
        ...formData,
        items: itemsToLog,
        cartTotal: cartTotal,
        shippingFee: shippingFee
      };

      const res = await fetch(`${apiUrl}/api/orders/abandoned-carts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        // Save the ID so we can recover it on the payment page
        localStorage.setItem('abandonedCartId', data.abandonedCartId);
      }
    } catch (err) {
      console.error("Failed to log abandoned cart", err);
    }

    // Save to localStorage and move to payment step
    localStorage.setItem('checkoutData', JSON.stringify(formData));
    setIsSubmitting(false);
    router.push('/payment');
  };

  return (
    <div className="section-padding">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
          <h2 style={{ margin: 0 }}>Secure Checkout</h2>
          <span style={{ color: 'var(--text-muted)' }}>&gt; Step 1: Shipping Details</span>
        </div>

        <div className="cart-container">
          {/* Checkout Form */}
          <div className="cart-items-list">
            <h3 style={{ marginBottom: '1.5rem' }}>Where should we deliver?</h3>
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
                  {DISTRICTS_BD.map(zila => (
                    <option key={zila} value={zila}>
                      {zila}
                    </option>
                  ))}
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
            </form>
          </div>

          {/* Order Summary */}
          <div style={{ alignSelf: 'start' }}>
            <div className="cart-summary">
              <h3>Order Summary</h3>
              
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
                {isSubmitting ? 'Loading...' : 'Continue to Payment'}
              </button>

              <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Need help with your order? <br/>
                <a 
                  href="https://wa.me/8801740414134?text=I%20need%20help%20with%20my%20checkout"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#25D366', fontWeight: 'bold', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}
                >
                  💬 Chat with us on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
