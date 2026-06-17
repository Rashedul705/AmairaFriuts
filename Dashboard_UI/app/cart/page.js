'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  if (!cartItems) return null;

  return (
    <div className="section-padding">
      <div className="container">
        <h2 style={{ marginBottom: '1.5rem', borderBottom: '2px solid var(--primary-light)', paddingBottom: '1rem' }}>
          Your Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
        </h2>

        {cartItems.length === 0 ? (
          <div className="text-center" style={{ padding: '4rem 0', backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px dashed var(--border-color)' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🛒</span>
            <h3 style={{ marginBottom: '1rem' }}>Your cart is empty</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Looks like you haven't added any fresh fruits yet.</p>
            <Link href="/shop" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-container">
            {/* Cart Items List */}
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <Link href={`/product/${item.slug}`}>
                    <img 
                      src={item.images && item.images.length > 0 ? item.images[0] : "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500"} 
                      alt={item.title} 
                      className="cart-item-img"
                    />
                  </Link>
                  <div className="cart-item-info">
                    <Link href={`/product/${item.slug}`}>
                      <h4>{item.title}</h4>
                    </Link>
                    <span className="product-category" style={{ display: 'block', marginBottom: '0.5rem' }}>{item.category}</span>
                    <div className="cart-qty-controls">
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        style={{ opacity: item.quantity <= 1 ? 0.5 : 1 }}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="cart-item-price">
                    ৳ {item.basePrice * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={{ alignSelf: 'start' }}>
              <div className="cart-summary">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span style={{ fontWeight: '600' }}>৳ {cartTotal}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Free</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>৳ {cartTotal}</span>
                </div>
                <Link 
                  href="/checkout"
                  className="btn btn-primary" 
                  style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem', display: 'block', textAlign: 'center' }}
                >
                  Proceed to Checkout
                </Link>
                <Link href="/shop" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'underline' }}>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
