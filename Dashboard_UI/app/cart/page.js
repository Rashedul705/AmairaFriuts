'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cartItems, updateQuantity, updateVariant, removeFromCart, cartTotal, cartCount } = useCart();

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
              {cartItems.map((item) => {
                const itemPrice = item.selectedVariant ? item.selectedVariant.price : (item.pricePerKg || item.price_per_kg || item.basePrice);

                return (
                  <div key={item.cartItemId} className="cart-item" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    <Link href={`/product/${item.slug}`} style={{ flexShrink: 0 }}>
                      <img 
                        src={item.images && item.images.length > 0 ? item.images[0] : "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500"} 
                        alt={item.title} 
                        className="cart-item-img"
                        style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '0.5rem' }}
                      />
                    </Link>
                    
                    <div className="cart-item-info" style={{ flex: '1 1 300px' }}>
                      <Link href={`/product/${item.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h4 style={{ marginBottom: '0.25rem', fontSize: '1.1rem' }}>{item.title}</h4>
                      </Link>
                      <span className="product-category" style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.category}</span>
                      
                      {/* Variant Selection UI (The packaging feature) */}
                      {item.variants && item.variants.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                            Packaging Variant:
                          </label>
                          <select 
                            value={item.selectedVariant?.label || ''}
                            onChange={(e) => {
                              const newVar = item.variants.find(v => v.label === e.target.value);
                              if (newVar) {
                                updateVariant(item.cartItemId, newVar);
                              }
                            }}
                            style={{ 
                              padding: '0.5rem', 
                              borderRadius: '0.25rem', 
                              border: '1px solid var(--border-color)', 
                              backgroundColor: '#fff',
                              fontSize: '0.9rem',
                              width: '100%',
                              maxWidth: '250px',
                              cursor: 'pointer'
                            }}
                          >
                            {item.variants.map((v, i) => (
                              <option key={i} value={v.label}>
                                {v.label} - ৳ {v.price}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="cart-qty-controls" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: '0.25rem' }}>
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            style={{ border: 'none', background: 'none', padding: '0.5rem 1rem', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', opacity: item.quantity <= 1 ? 0.5 : 1, fontSize: '1.1rem' }}
                          >
                            -
                          </button>
                          <span style={{ fontWeight: 'bold', width: '30px', textAlign: 'center' }}>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            style={{ border: 'none', background: 'none', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '1.1rem' }}
                          >
                            +
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.cartItemId)}
                          style={{ border: 'none', background: 'none', color: '#ef4444', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-price" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)', textAlign: 'right', flexShrink: 0 }}>
                      ৳ {itemPrice * item.quantity}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div style={{ alignSelf: 'start' }}>
              <div className="cart-summary" style={{ position: 'sticky', top: '100px' }}>
                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span style={{ fontWeight: '600' }}>৳ {cartTotal}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Calculated at checkout</span>
                </div>
                <div className="summary-total" style={{ borderTop: '2px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem', fontSize: '1.25rem' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)' }}>৳ {cartTotal}</span>
                </div>
                <Link 
                  href="/checkout"
                  className="btn btn-primary" 
                  style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', display: 'block', textAlign: 'center', fontSize: '1.1rem' }}
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
