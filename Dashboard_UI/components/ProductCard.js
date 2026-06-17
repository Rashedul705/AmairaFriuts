'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  // Use first image or a premium fallback fruit image
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500";

  return (
    <div className="card animate-slide-up">
      <div className="product-img-wrapper">
        {product.freeDelivery && (
          <span className="free-del-badge">Free Delivery</span>
        )}
        <Link href={`/product/${product.slug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          <img 
            src={imageUrl} 
            alt={product.title} 
            className="product-img" 
            loading="lazy" 
          />
        </Link>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link href={`/product/${product.slug}`}>
          <h3 className="product-title" title={product.title}>{product.title}</h3>
        </Link>
        {product.description && (
          <p style={{ 
            fontSize: '0.85rem', 
            color: 'var(--text-muted)', 
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '2.55rem',
            lineHeight: '1.275rem'
          }}>
            {product.description}
          </p>
        )}
        <div className="product-prices">
          <span className="price-current">৳ {product.basePrice}</span>
          {product.originalPrice && (
            <span className="price-old">৳ {product.originalPrice}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }} 
            className="btn btn-outline" 
            style={{ flex: 1, padding: '0.6rem 0.5rem', fontSize: '0.9rem' }}
          >
            Add to Cart
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
              window.location.href = '/checkout';
            }} 
            className="btn btn-primary" 
            style={{ flex: 1, padding: '0.6rem 0.5rem', fontSize: '0.9rem' }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
