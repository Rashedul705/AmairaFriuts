import HomeProductSection from '@/components/HomeProductSection';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let products = [];
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const res = await fetch(`${apiUrl}/api/products`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        products = data;
      }
    }
  } catch (error) {
    console.error("Failed fetching products:", error);
  }

  return (
    <div>
      {/* Immersive Hero Banner */}
      <section className="hero">
        <Image 
          src="/assets/hero-orchard.jpg" 
          alt="Amaira Fruits Orchard" 
          fill 
          priority 
          style={{ objectFit: 'cover', zIndex: -2 }} 
        />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(to bottom, rgba(19,93,39,0.4) 0%, rgba(19,93,39,0.65) 50%, rgba(19,93,39,0.9) 100%)', zIndex: -1 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-content">
            <span className="badge badge-accent" style={{ marginBottom: '1rem', display: 'inline-block', fontWeight: 'bold' }}>
              🍒 Season 2026 · Pre-order Open
            </span>
            <h1 style={{ fontSize: '3.75rem', fontWeight: '800', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Amaira Fruits Ltd.</h1>
            <p style={{ fontSize: '1.2rem', textShadow: '0 1px 2px rgba(0,0,0,0.3)', marginBottom: '2.5rem' }}>
              A fruit-only agri initiative delivering safer fruits — picked, sorted, and packed straight from our registered gardens to your table.
            </p>
            <div className="hero-buttons">
              <a href="#shop" className="btn btn-accent" style={{ padding: '0.75rem 1.5rem', fontWeight: 'bold', textAlign: 'center', minWidth: '250px' }}>
                Try Our Fruits
              </a>
              <a href="/about" className="btn btn-outline" style={{ borderColor: 'white', color: 'white', padding: '0.75rem 1.5rem', textAlign: 'center', minWidth: '250px' }}>
                Our Contracted Gardens
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Products Section */}
      <HomeProductSection initialProducts={products} />

      {/* Why Choose Us - Floating numbers layout */}
      <section style={{ backgroundColor: 'var(--bg-card)', padding: '6rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Why we are different</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>A safer way to enjoy fruit</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '4rem' }}>
              From orchard inspection to your doorstep, every step is built around food safety and quality.
            </p>
          </div>
          
          <div className="grid grid-4">
            <div className="why-different-card">
              <span className="why-different-number">01</span>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', marginTop: '0.5rem' }}>Registered Safe Garden</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                We collect fruits only from our registered, harmful-chemical-free contracted gardens.
              </p>
            </div>
            <div className="why-different-card">
              <span className="why-different-number">02</span>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', marginTop: '0.5rem' }}>Premium Quality Product</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Only premium-standard fruits make it through our sort, for your best experience.
              </p>
            </div>
            <div className="why-different-card">
              <span className="why-different-number">03</span>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', marginTop: '0.5rem' }}>Premium Packaging</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Gift-grade packaging — beautiful to receive, safe enough for long-distance travel.
              </p>
            </div>
            <div className="why-different-card">
              <span className="why-different-number">04</span>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', marginTop: '0.5rem' }}>Garden Fresh Delivery</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Pre-ordered, picked at peak ripeness and shipped fast — garden to table in 42–72 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Statistics Banner */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div>
              <div className="stats-number">50K+</div>
              <div className="stats-label">Happy Customers</div>
            </div>
            <div>
              <div className="stats-number">50+</div>
              <div className="stats-label">Registered Gardens</div>
            </div>
            <div>
              <div className="stats-number">100%</div>
              <div className="stats-label">Quality Assured</div>
            </div>
            <div>
              <div className="stats-number">42–72H</div>
              <div className="stats-label">Estimated Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Premium Fruits */}
      <section style={{ padding: '6rem 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
            <div>
              <span style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Premium Quality</span>
              <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>Gift Premium Fruits!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '1rem', lineHeight: '1.7' }}>
                We all want to send attractive gifts to loved ones, office colleagues, or partners — gifts that delight at first sight and again with the first bite.
              </p>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1rem', lineHeight: '1.7' }}>
                From Amaira Fruits, we deliver sweet, juicy mangoes straight from the orchard, wrapped in elegant gift-grade packaging — sent directly to your loved one's doorstep.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="/gift" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontWeight: 'bold' }}>Gift Now!</a>
                <a href="#shop" className="btn btn-outline" style={{ padding: '0.75rem 1.5rem' }}>Explore Catalogue</a>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '-1.5rem', borderRadius: '2rem', backgroundColor: 'rgba(240, 168, 0, 0.12)', filter: 'blur(40px)', zIndex: '-1' }}></div>
              <Image 
                src="/assets/gift-box.jpg" 
                alt="Premium mango gift box packaging" 
                width={800}
                height={600}
                style={{ width: '100%', height: 'auto', borderRadius: '1.5rem', boxShadow: 'var(--shadow-premium)', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Farmers Training Workshop Cards */}
      <section style={{ backgroundColor: 'var(--bg-card)', padding: '6rem 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Behind the Scenes</span>
            <h2 style={{ fontSize: '2.25rem', marginTop: '0.5rem' }}>Training programs with mango farmers</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '4rem' }}>
              To ensure safe mango supply, we run regular field workshops on Good Agricultural Practices (GAP) across our contracted orchards.
            </p>
          </div>
          
          <div className="grid grid-2" style={{ gap: '2rem', marginBottom: '3.5rem' }}>
            <div className="workshop-card">
              <h3>Contract Type 1 — Before Harvest</h3>
              <ul className="workshop-list">
                <li><strong>Orchard inspection:</strong> Our team visits selected farmers and inspects their orchards.</li>
                <li><strong>Agreement:</strong> A formal contract is signed covering price, timeline and quality.</li>
                <li><strong>Training:</strong> Field meetings & workshops on safe mango production.</li>
                <li><strong>Collection:</strong> Fruits are harvested at the right time and shipped to collection points.</li>
              </ul>
            </div>
            <div className="workshop-card">
              <h3>Contract Type 2 — Before Collection</h3>
              <ul className="workshop-list">
                <li><strong>Orchard inspection:</strong> Initial selection followed by detailed quality checks.</li>
                <li><strong>Agreement:</strong> Mutually agreed price, timeline and quality standards.</li>
                <li><strong>Guidance:</strong> Continuous advisory to avoid unnecessary pesticide use.</li>
                <li><strong>Collection:</strong> Picked at peak ripeness and packed gently for transport.</li>
              </ul>
            </div>
          </div>
          
          {/* Action callout banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: '1.75rem 2rem', borderRadius: '1.25rem', gap: '1.5rem', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '1rem', color: 'var(--text-main)', margin: 0 }}>
              <strong>Contact for contracting:</strong> Have an orchard? Let's talk.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="tel:01740414134" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', padding: '0.65rem 1.25rem' }}>
                📞 01740414134
              </a>
              <a href="mailto:hello@premiumfruits.com" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', padding: '0.65rem 1.25rem' }}>
                ✉️ hello@premiumfruits.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Community Reviews & Moments Gallery */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Customer Reviews</span>
            <h2 style={{ fontSize: '2.25rem', marginTop: '0.5rem' }}>Real feedback from happy customers</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '4rem' }}>
              Stories, unboxings and reactions shared by our community across Bangladesh.
            </p>
          </div>
          
          {/* Mock Video Cards */}
          <div className="grid grid-3" style={{ gap: '1.5rem', marginBottom: '5rem' }}>
            <div className="review-video-card">
              <div className="review-video-thumbnail">
                <button className="review-video-play-btn" aria-label="Play video">▶</button>
              </div>
              <div className="review-video-info">
                <h4 className="review-video-title">Healthy & Safe Premium Mangoes</h4>
                <p className="review-video-author">Premium Fruits</p>
              </div>
            </div>
            <div className="review-video-card">
              <div className="review-video-thumbnail">
                <button className="review-video-play-btn" aria-label="Play video">▶</button>
              </div>
              <div className="review-video-info">
                <h4 className="review-video-title">Full Review & Unboxing</h4>
                <p className="review-video-author">Village Life and Living</p>
              </div>
            </div>
            <div className="review-video-card">
              <div className="review-video-thumbnail">
                <button className="review-video-play-btn" aria-label="Play video">▶</button>
              </div>
              <div className="review-video-info">
                <h4 className="review-video-title">Why Premium is Our Mango</h4>
                <p className="review-video-author">Explore with Hasan</p>
              </div>
            </div>
          </div>

          {/* Square Moments wall grid */}
          <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '4rem' }}>
            <h3 className="text-center" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Customer Moments</h3>
            <p className="text-center" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '3rem' }}>
              21+ verified reviews from across the country
            </p>
            
            <div className="moments-gallery-grid">
              {[
                "https://images.unsplash.com/photo-1553279768-865429fa0078",
                "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2",
                "https://images.unsplash.com/photo-1569870499742-763d0974da37",
                "https://images.unsplash.com/photo-1589135233689-d91d9cc7d8ff",
                "https://images.unsplash.com/photo-1596003906949-67221c37965c",
                "https://images.unsplash.com/photo-1528825871115-3581a5387919"
              ].map((src, idx) => (
                <div key={idx} className="moment-gallery-item" style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden' }}>
                  <Image 
                    src={`${src}?w=300`} 
                    alt="Customer unboxing moment" 
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
