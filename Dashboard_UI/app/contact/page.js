'use client';

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! We will contact you back shortly.");
  };

  return (
    <section className="section-padding">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="text-center" style={{ marginBottom: '1rem' }}>Contact Us</h1>
        <p className="text-center" style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
          Have a question about our fruits or deliveries? Get in touch with our team!
        </p>

        <div className="grid grid-2" style={{ gap: '3rem' }}>
          {/* Info */}
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Office Address</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              <strong>Amaira Fruits Ltd.</strong><br />
              Road 11, Banani, Dhaka-1213,<br />
              Bangladesh.
            </p>
            <h3 style={{ marginBottom: '1rem' }}>Direct Support</h3>
            <p style={{ marginBottom: '0.5rem' }}>📞 Phone: <strong>+880 1740-414134</strong></p>
            <p style={{ marginBottom: '0.5rem' }}>✉️ Email: <strong>sales@amairafruits.com</strong></p>
            <p style={{ marginBottom: '1.5rem' }}>💬 WhatsApp: <strong>+880 1740-414134</strong></p>
          </div>

          {/* Form */}
          <div className="card" style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name</label>
                <input type="text" className="form-control" placeholder="e.g. Rahat Rahman" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-control" placeholder="e.g. name@email.com" required />
              </div>
              <div className="form-group">
                <label>Your Message</label>
                <textarea className="form-control" rows="4" placeholder="How can we help you?" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
