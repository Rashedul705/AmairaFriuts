'use client';

export default function CorporateGift() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Inquiry request submitted successfully! Our B2B relationship manager will contact you back with a custom catalog.");
  };

  return (
    <section className="section-padding">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="text-center" style={{ marginBottom: '1rem' }}>Corporate Fruit Gifting</h1>
        <p className="text-center" style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
          Delight your employees, business clients, and partners with premium orchard gift boxes.
        </p>

        <div className="card animate-slide-up" style={{ padding: '3rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem' }}>
            Submit Corporate Inquiry
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Company Name *</label>
                <input type="text" className="form-control" placeholder="e.g. Amaira Tech" required />
              </div>
              <div className="form-group">
                <label>Contact Person Name *</label>
                <input type="text" className="form-control" placeholder="e.g. Sujon Ahmed" required />
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label>Work Email *</label>
                <input type="email" className="form-control" placeholder="e.g. info@company.com" required />
              </div>
              <div className="form-group">
                <label>Mobile Number *</label>
                <input type="tel" className="form-control" placeholder="e.g. 017XXXXXXXX" required />
              </div>
            </div>

            <div className="form-group">
              <label>Estimated Quantity (Boxes) *</label>
              <select className="form-control" required>
                <option value="10-50">10 to 50 Boxes</option>
                <option value="50-100">50 to 100 Boxes</option>
                <option value="100-500">100 to 500 Boxes</option>
                <option value="500+">More than 500 Boxes</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label>Requirement Details / Message</label>
              <textarea className="form-control" rows="4" placeholder="Tell us about the fruits preferred, packing size, delivery locations, and estimated dates..."></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.05rem' }}>
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
