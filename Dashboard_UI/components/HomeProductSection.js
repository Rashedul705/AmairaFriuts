'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';

const CATEGORIES = [
  "All Products",
  "Combo Package",
  "Mango (আম)",
  "Dates (খেজুর)",
  "Pickle (আচার)"
];

export default function HomeProductSection({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts || []);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products when products, activeCategory, or searchQuery updates
  useEffect(() => {
    let filtered = products;

    if (activeCategory !== "All Products") {
      filtered = filtered.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) || 
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query))
      );
    }

    setFilteredProducts(filtered);
  }, [products, activeCategory, searchQuery]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleCategoryShortcutClick = (category) => {
    setActiveCategory(category);
    const el = document.getElementById('shop');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      {/* Floating Category Link Box overlapping Hero */}
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="floating-categories-box">
          <div className="category-shortcut-grid">
            <div className="category-shortcut-card" onClick={() => handleCategoryShortcutClick("All Products")}>
              <span className="category-shortcut-emoji">🍇</span>
              <span className="category-shortcut-title">All Products</span>
              <span className="category-shortcut-sub">সকল পণ্য</span>
            </div>
            <div className="category-shortcut-card" onClick={() => handleCategoryShortcutClick("Combo Package")}>
              <span className="category-shortcut-emoji">🧺</span>
              <span className="category-shortcut-title">Combo Package</span>
              <span className="category-shortcut-sub">কম্বো প্যাকেজ</span>
            </div>
            <div className="category-shortcut-card" onClick={() => handleCategoryShortcutClick("Mango (আম)")}>
              <span className="category-shortcut-emoji">🥭</span>
              <span className="category-shortcut-title">Mango</span>
              <span className="category-shortcut-sub">আম</span>
            </div>
            <div className="category-shortcut-card" onClick={() => handleCategoryShortcutClick("Dates (খেজুর)")}>
              <span className="category-shortcut-emoji">🌴</span>
              <span className="category-shortcut-title">Dates</span>
              <span className="category-shortcut-sub">খেজুর</span>
            </div>
            <div className="category-shortcut-card" onClick={() => handleCategoryShortcutClick("Pickle (আচার)")}>
              <span className="category-shortcut-emoji">🫙</span>
              <span className="category-shortcut-title">Pickle</span>
              <span className="category-shortcut-sub">আচার</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product categories section */}
      <section id="shop" className="section-padding" style={{ paddingTop: '7rem' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <span style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Shop the harvest</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '0.75rem' }}>Our Fruit Collection</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Hand-picked from our registered gardens. Free delivery across Bangladesh on every order.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <div style={{ height: '3px', width: '4rem', backgroundColor: 'var(--accent)', borderRadius: '2px' }}></div>
            </div>
          </div>

          {/* Instant Search Bar */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <span className="search-icon-inside">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search fresh fruits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={clearSearch} 
                  style={{ 
                    position: 'absolute', 
                    right: '1.25rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--text-muted)', 
                    cursor: 'pointer', 
                    fontSize: '1rem',
                    padding: '0.2rem'
                  }}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Sliding Category Menu */}
          <div className="category-container" style={{ marginBottom: '2.5rem' }}>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={`category-tab ${activeCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', border: '1px dashed var(--border-color)', borderRadius: '1rem' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No products found matching your criteria.</p>
              <button className="btn btn-primary" onClick={() => { handleCategoryClick("All Products"); setSearchQuery(""); }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
