'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';

const MOCK_PRODUCTS = [
  {
    _id: "mock1",
    title: "Premium Haribhanga & Amropali Combo (5 Kg)",
    slug: "haribhanga-amropali-combo-5kg",
    description: "Harvested fresh from Rajshahi. Combination of sweet, fiberless Haribhanga and juicy, fragrant Amropali mangoes.",
    basePrice: 750,
    originalPrice: 890,
    images: ["https://images.unsplash.com/photo-1553279768-865429fa0078?w=500"],
    category: "Combo Package",
    inStock: true,
    freeDelivery: true,
    variants: [
      { label: "5 Kg Package", price: 750 },
      { label: "10 Kg Package", price: 1450 }
    ]
  },
  {
    _id: "mock2",
    title: "Rajshahi Fazli Mango Premium (10 Kg)",
    slug: "rajshahi-fazli-10kg",
    description: "Huge-sized, sweet Fazli mangoes straight from the tree. Safe and naturally ripened.",
    basePrice: 1250,
    originalPrice: 1450,
    images: ["https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500"],
    category: "Mango (আম)",
    inStock: true,
    freeDelivery: false,
    variants: [
      { label: "10 Kg Package", price: 1250 },
      { label: "20 Kg Package", price: 2400 }
    ]
  },
  {
    _id: "mock3",
    title: "Premium Medjool Dates (1 Kg Box)",
    slug: "medjool-dates-1kg",
    description: "Rich, soft, and extra-sweet imported Medjool dates. Great for daily energy.",
    basePrice: 850,
    originalPrice: 950,
    images: ["https://images.unsplash.com/photo-1569870499742-763d0974da37?w=500"],
    category: "Dates (খেজুর)",
    inStock: true,
    freeDelivery: false,
    variants: [
      { label: "1 Kg Box", price: 850 },
      { label: "2 Kg Package", price: 1650 }
    ]
  },
  {
    _id: "mock4",
    title: "Homemade Sweet & Sour Mango Pickle",
    slug: "mango-pickle-400g",
    description: "Prepared in mustard oil with aromatic spices. No preservatives added. Net weight: 400g.",
    basePrice: 280,
    originalPrice: 320,
    images: ["https://images.unsplash.com/photo-1589135233689-d91d9cc7d8ff?w=500"],
    category: "Pickle (আচার)",
    inStock: true,
    freeDelivery: false,
    variants: [
      { label: "400g Jar", price: 280 },
      { label: "1 Kg Premium Jar", price: 650 }
    ]
  }
];

export default function ProductDetails() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Checkout Form States
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const res = await fetch(`${apiUrl}/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          if (data.variants && data.variants.length > 0) {
            setSelectedVariant(data.variants[0]);
          } else {
            setSelectedVariant({ label: "Regular Base Price", price: data.basePrice });
          }
        } else {
          const mock = MOCK_PRODUCTS.find(p => p.slug === slug);
          if (mock) {
            setProduct(mock);
            if (mock.variants && mock.variants.length > 0) {
              setSelectedVariant(mock.variants[0]);
            } else {
              setSelectedVariant({ label: "Regular Base Price", price: mock.basePrice });
            }
          } else {
            setError('Product not found');
          }
        }
      } catch (err) {
        const mock = MOCK_PRODUCTS.find(p => p.slug === slug);
        if (mock) {
          setProduct(mock);
          if (mock.variants && mock.variants.length > 0) {
            setSelectedVariant(mock.variants[0]);
          } else {
            setSelectedVariant({ label: "Regular Base Price", price: mock.basePrice });
          }
        } else {
          setError('Failed to load product details');
        }
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 0', color: 'var(--primary)', fontWeight: '600' }}>
        Loading product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
        <h2 style={{ color: 'red', marginBottom: '1.5rem' }}>{error || 'Product not found'}</h2>
        <a href="/" className="btn btn-primary">Return Home</a>
      </div>
    );
  }

  const unitPrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const subtotal = unitPrice * quantity;

  const handleAddToCart = () => {
    // When adding from the detail page, we push it N times.
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedVariant); 
    }
    alert(`${quantity}x ${product.title} added to cart!`);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedVariant);
    }
    router.push('/checkout');
  };

  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500";

  return (
    <section className="section-padding">
      <div className="container">
        <div className="detail-grid animate-slide-up">
          
          {/* Product description & gallery */}
          <div>
            <div className="product-img-wrapper" style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
              {product.freeDelivery && (
                <span className="free-del-badge">Free Delivery</span>
              )}
              <img src={imageUrl} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>{product.category}</span>
            <h1 style={{ marginBottom: '1rem' }}>{product.title}</h1>
            
            <div className="product-prices" style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)' }}>৳ {unitPrice}</span>
              {product.originalPrice && (
                <span style={{ fontSize: '1.25rem', textDecoration: 'line-through', color: 'var(--text-muted)', marginLeft: '1rem' }}>
                  ৳ {product.originalPrice}
                </span>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Product Description</h3>
              <p style={{ color: 'var(--text-main)', whiteSpace: 'pre-line', fontSize: '1rem', lineHeight: '1.7' }}>
                {product.description || "No description provided. Experience fresh harvest delivered under 24 hours."}
              </p>
            </div>

            <div style={{ marginTop: '2rem', backgroundColor: '#f1f5f9', padding: '1.5rem', borderRadius: '0.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Delivery Notes:</h4>
              <ul style={{ fontSize: '0.9rem', color: 'var(--text-main)', paddingLeft: '1.25rem' }}>
                <li>Orders placed before 4:00 PM are delivered next day.</li>
                <li>Payment is strictly Cash on Delivery (COD) or mobile banking.</li>
                <li>Package weight and quality guaranteed.</li>
              </ul>
            </div>
          </div>

          {/* Checkout & Action section */}
          <div>
            <div className="checkout-card" style={{ position: 'sticky', top: '100px' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1.5rem', textAlign: 'center', borderBottom: '2px dashed var(--primary)', paddingBottom: '0.75rem' }}>
                Purchase Options
              </h2>
              
              {/* Variant Selection */}
              {product.variants && product.variants.length > 0 && (
                <div className="variant-selector" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary)', display: 'block', marginBottom: '0.5rem' }}>Select Variant:</label>
                  {product.variants.map((v, i) => (
                    <div 
                      key={i}
                      className={`variant-option ${selectedVariant && selectedVariant.label === v.label ? 'selected' : ''}`}
                      onClick={() => setSelectedVariant(v)}
                      style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', backgroundColor: selectedVariant && selectedVariant.label === v.label ? 'var(--secondary)' : 'transparent' }}
                    >
                      <span style={{ fontWeight: selectedVariant && selectedVariant.label === v.label ? 'bold' : 'normal' }}>{v.label}</span>
                      <span style={{ fontWeight: 'bold' }}>৳ {v.price}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Quantity:</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="btn btn-secondary" 
                    style={{ padding: '0.5rem 1.25rem', borderRadius: '0.25rem', fontSize: '1.25rem' }}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="form-control" 
                    style={{ width: '5rem', textAlign: 'center', padding: '0.75rem', fontWeight: 'bold', fontSize: '1.1rem' }} 
                    min="1"
                  />
                  <button 
                    type="button" 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="btn btn-secondary" 
                    style={{ padding: '0.5rem 1.25rem', borderRadius: '0.25rem', fontSize: '1.25rem' }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div style={{ 
                backgroundColor: 'var(--bg-main)', 
                padding: '1rem', 
                borderRadius: '0.5rem', 
                marginBottom: '1.5rem',
                border: '1px solid var(--border-color)',
                fontSize: '0.9rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.25rem', color: 'var(--primary)' }}>
                  <span>Total Amount:</span>
                  <span>৳ {subtotal}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button 
                  onClick={handleAddToCart}
                  className="btn btn-outline" 
                  style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                >
                  Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                >
                  Buy Now
                </button>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
