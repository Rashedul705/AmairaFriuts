// We will write the three static pages in a unified export or separate files.
// Let's write about/page.js first.
// Wait, we must write them as three separate calls or write them individually.
// Let's write about/page.js
export default function About() {
  return (
    <section className="section-padding">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="text-center" style={{ marginBottom: '2rem' }}>About Amaira Fruits</h1>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          Welcome to <strong>Amaira Fruits</strong>, your number one source for safe, fresh, and premium quality fruits. We are dedicated to providing you the very best of seasonal harvest, with a focus on chemical-free ripening, direct farmer sourcing, and hygienic packaging.
        </p>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          Founded in 2026, Amaira Fruits has come a long way from its beginnings in North Bengal. When we first started out, our passion for fresh farm fruits drove us to conduct extensive research and orchards testing so that Amaira Fruits can offer you the finest mangoes, dates, pickles, and combo packages directly at your doorstep in Dhaka.
        </p>
        <h2 style={{ marginTop: '3rem', marginBottom: '1rem' }}>Our Core Values</h2>
        <ul style={{ fontSize: '1.05rem', lineHeight: '1.8', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
          <li><strong>Quality Sourcing:</strong> Handpicked at the peak of maturity from premium orchards.</li>
          <li><strong>Hygienic Handling:</strong> Cleaned, sorted, and packed using food-grade materials.</li>
          <li><strong>Customer Trust:</strong> Cash on Delivery structure ensuring complete satisfaction before you pay.</li>
        </ul>
      </div>
    </section>
  );
}
