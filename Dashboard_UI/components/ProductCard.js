'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const LiveCountdown = dynamic(() => import('./LiveCountdown'), { ssr: false });

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Use first image or a premium fallback fruit image
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500";

  const displayPrice = product.pricePerKg || product.price_per_kg || product.basePrice;
  const expiryDate = product.price_expiry_date;

  return (
    <div className="card animate-slide-up">
      <div className="product-img-wrapper">
        {!product.inStock && (
          <span className="free-del-badge" style={{ backgroundColor: '#dc3545', right: '10px', left: 'auto' }}>Out of Stock</span>
        )}
        {product.freeDelivery && (
          <span className="free-del-badge">Free Delivery</span>
        )}
        <Link href={`/product/${product.slug}`} style={{ display: 'block', width: '100%', height: '100%', position: 'relative' }}>
          <Image 
            src={imageUrl} 
            alt={product.title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
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
        <div className="product-prices" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="price-current">৳ {displayPrice} / kg</span>
          {expiryDate && <LiveCountdown expiryDateString={expiryDate} />}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            disabled={!product.inStock || isProcessing}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isProcessing || !product.inStock) return;
              setIsProcessing(true);
              
              addToCart(product);
              
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({ ecommerce: null });
              window.dataLayer.push({
                event: 'add_to_cart',
                ecommerce: {
                  currency: 'BDT',
                  value: displayPrice,
                  items: [{
                    item_id: product._id || product.slug,
                    item_name: product.title,
                    item_category: product.category,
                    price: displayPrice,
                    quantity: 1
                  }]
                }
              });
              
              setTimeout(() => setIsProcessing(false), 500);
            }}
            className={`btn ${product.inStock ? 'btn-outline' : ''}`} 
            style={{ flex: 1, padding: '0.6rem 0.5rem', fontSize: '0.9rem', opacity: product.inStock && !isProcessing ? 1 : 0.5, cursor: product.inStock && !isProcessing ? 'pointer' : 'not-allowed', backgroundColor: product.inStock ? 'transparent' : '#eee', color: product.inStock ? 'var(--primary)' : '#999', border: product.inStock ? '2px solid var(--primary)' : '2px solid #ccc' }}
          >
            {isProcessing ? 'Adding...' : 'Add to Cart'}
          </button>
          <button 
            disabled={!product.inStock || isProcessing}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isProcessing || !product.inStock) return;
              setIsProcessing(true);
              
              addToCart(product);

              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({ ecommerce: null });
              window.dataLayer.push({
                event: 'add_to_cart',
                ecommerce: {
                  currency: 'BDT',
                  value: displayPrice,
                  items: [{
                    item_id: product._id || product.slug,
                    item_name: product.title,
                    item_category: product.category,
                    price: displayPrice,
                    quantity: 1
                  }]
                }
              });

              window.location.href = '/checkout';
            }} 
            className="btn btn-primary" 
            style={{ flex: 1, padding: '0.6rem 0.5rem', fontSize: '0.9rem', opacity: product.inStock && !isProcessing ? 1 : 0.5, cursor: product.inStock && !isProcessing ? 'pointer' : 'not-allowed' }}
          >
            {isProcessing ? 'Wait...' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
