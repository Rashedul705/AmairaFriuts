'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

const BD_DISTRICTS = [
  "Dhaka", "Chittagong", "Rajshahi", "Sylhet", "Khulna", "Barisal", 
  "Rangpur", "Mymensingh", "Comilla", "Gazipur", "Narayanganj", 
  "Bogura", "Dinajpur", "Jessore", "Cox's Bazar", "Feni"
];

export default function ProductDetails() {
  const { slug } = useParams();
  const router = useRouter();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Checkout Form States
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  
  // Order Success Modal/Overlay State
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const res = await fetch(`${apiUrl}/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          // Set default variant if available
          if (data.variants && data.variants.length > 0) {
            setSelectedVariant(data.variants[0]);
          } else {
            setSelectedVariant({ label: "Regular Base Price", price: data.basePrice });
          }
        } else {
          // Fallback check
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
        // Fallback check on catch
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
      // Auto-prefill customer name if logged in
      const storedName = localStorage.getItem('userName');
      if (storedName) {
        setCustomerName(storedName);
      }
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

  // Calculate pricing summary
  const unitPrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const subtotal = unitPrice * quantity;
  
  let shippingFee = 0;
  if (!product.freeDelivery) {
    shippingFee = district.toLowerCase() === 'dhaka' ? 80 : 150;
  }
  const grandTotal = subtotal + shippingFee;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!customerName.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!phone.trim()) {
      alert('Please enter your phone number');
      return;
    }
    // BD Phone validation: starts with 01, has 11 digits
    const cleanPhone = phone.replace(/[^\d]/g, '');
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      alert('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01712345678)');
      return;
    }
    if (!shippingAddress.trim()) {
      alert('Please enter your shipping address');
      return;
    }

    setSubmitLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const customerUID = localStorage.getItem('userUID') || undefined;

      const orderPayload = {
        customerName,
        phone: cleanPhone,
        district,
        shippingAddress,
        productId: product._id,
        variant: selectedVariant ? selectedVariant.label : "Regular",
        quantity,
        paymentMethod,
        customerUID
      };

      const res = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (res.ok) {
        setOrderSuccess(data);
      } else {
        alert(data.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      alert('Error connecting to the server. Placing order failed.');
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500";

  return (
    <section className="section-padding">
      <div className="container">
        
        {/* Success view */}
        {orderSuccess ? (
          <div className="animate-slide-up" style={{ 
            maxWidth: '600px', 
            margin: '0 auto', 
            padding: '3rem', 
            backgroundColor: '#ffffff', 
            borderRadius: '1rem', 
            border: '2px solid var(--primary)', 
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <span style={{ fontSize: '4rem' }}>🎉</span>
            <h1 style={{ fontSize: '2rem', margin: '1rem 0' }}>Order Placed Successfully!</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Thank you, <strong>{orderSuccess.customerName}</strong>. Your order has been placed.
            </p>
            
            <div style={{ 
              backgroundColor: 'var(--primary-light)', 
              padding: '1.5rem', 
              borderRadius: '0.5rem', 
              marginBottom: '2rem',
              border: '1px solid var(--border-color)'
            }}>
              <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', color: 'var(--primary)' }}>
                Your Tracking ID
              </span>
              <h2 style={{ fontSize: '2.25rem', letterSpacing: '2px', color: 'var(--primary)', margin: '0.5rem 0' }}>
                {orderSuccess.orderID}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Keep this ID safe to track your order details online.
              </p>
            </div>

            <p style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>
              <strong>Payment Method:</strong> Cash on Delivery (COD)<br />
              <strong>Total Amount:</strong> ৳ {orderSuccess.totalAmount}
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => router.push('/track')} className="btn btn-secondary">
                Track Order
              </button>
              <button onClick={() => router.push('/')} className="btn btn-primary">
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
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
                  <li>Payment is strictly Cash on Delivery (COD).</li>
                  <li>Package weight and quality guaranteed.</li>
                </ul>
              </div>
            </div>

            {/* Express Checkout section */}
            <div>
              <div className="checkout-card">
                <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1.5rem', textAlign: 'center', borderBottom: '2px dashed var(--primary)', paddingBottom: '0.75rem' }}>
                  ⚡ Express Checkout Form
                </h2>
                
                <form onSubmit={handleCheckoutSubmit}>
                  
                  {/* Variant Selection */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="variant-selector">
                      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary)' }}>Select Variant:</label>
                      {product.variants.map((v, i) => (
                        <div 
                          key={i}
                          className={`variant-option ${selectedVariant && selectedVariant.label === v.label ? 'selected' : ''}`}
                          onClick={() => setSelectedVariant(v)}
                        >
                          <span>{v.label}</span>
                          <span>৳ {v.price}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label>Quantity:</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button 
                        type="button" 
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="btn btn-secondary" 
                        style={{ padding: '0.5rem 1rem', borderRadius: '0.25rem' }}
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="form-control" 
                        style={{ width: '4.5rem', textAlign: 'center', padding: '0.5rem' }} 
                        min="1"
                      />
                      <button 
                        type="button" 
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="btn btn-secondary" 
                        style={{ padding: '0.5rem 1rem', borderRadius: '0.25rem' }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="form-group">
                    <label>Your Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Rahat Rahman" 
                      className="form-control"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Mobile Number *</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. 017XXXXXXXX" 
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>District *</label>
                    <select 
                      className="form-control"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    >
                      {BD_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label>Full Delivery Address *</label>
                    <textarea 
                      placeholder="House No, Road Name, Area Name" 
                      className="form-control"
                      rows="3"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                    ></textarea>
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
                    <div style={{ display: 'flex', justifyBetween: 'space-between', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>Subtotal:</span>
                      <span>৳ {subtotal}</span>
                    </div>
                    <div style={{ display: 'flex', justifyBetween: 'space-between', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>Shipping Fee ({district}):</span>
                      <span>৳ {shippingFee}</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyBetween: 'space-between', 
                      justifyContent: 'space-between', 
                      fontWeight: '700', 
                      fontSize: '1.1rem',
                      color: 'var(--primary)',
                      borderTop: '1px dashed var(--border-color)',
                      paddingTop: '0.5rem',
                      marginTop: '0.5rem'
                    }}>
                      <span>Total Amount:</span>
                      <span>৳ {grandTotal}</span>
                    </div>
                  </div>

                  {/* Payment Method COD */}
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label>Payment Method</label>
                    <div className="variant-option selected" style={{ cursor: 'default' }}>
                      <span>🤝 Cash On Delivery (COD)</span>
                      <span>Select</span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-accent" 
                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                    disabled={submitLoading}
                  >
                    {submitLoading ? 'Placing Order...' : 'Confirm Order (অর্ডার করুন)'}
                  </button>

                </form>
              </div>
            </div>
            
          </div>
        )}

      </div>
    </section>
  );
}
