'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';



const CATEGORIES = [
  "All Products",
  "Combo Package",
  "Mango (আম)",
  "Dates (খেজুর)",
  "Pickle (আচার)"
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const res = await fetch(`${apiUrl}/api/products`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setProducts(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

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

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <section className="section-padding" style={{ minHeight: '80vh' }}>
      <div className="container">
        <h1 className="text-center" style={{ marginBottom: '0.5rem' }}>Fresh Fruit Collection</h1>
        <p className="text-center" style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Explore our range of healthy, handpicked fruits and homemade food packages.
        </p>

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

        {/* Category Tabs */}
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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--primary)', fontWeight: '600' }}>
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', border: '1px dashed var(--border-color)', borderRadius: '1rem' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No products found matching your criteria.</p>
            <button className="btn btn-primary" onClick={() => { handleCategoryClick("All Products"); setSearchQuery(""); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-4 animate-slide-up">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
