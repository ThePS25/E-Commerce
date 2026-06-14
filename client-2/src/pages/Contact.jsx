import PageTransition from '@/components/PageTransition';

const Contact = () => (
  <PageTransition>
    <div className="page-content app-container">
      <div className="row g-5">
        <div className="col-lg-6">
          <h1>Contact Us</h1>
          <p className="text-muted">We&apos;d love to hear from you. Reach out anytime.</p>
          <form className="checkout__form" onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Your Name" required />
            <input type="email" placeholder="Email" required />
            <textarea placeholder="Message" rows={5} required style={{ padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: 12 }} />
            <button type="submit" className="btn btn-brand">Send Message</button>
          </form>
        </div>
        <div className="col-lg-6">
          <img src="/images/contactus.png" alt="Contact" className="img-fluid rounded-4" loading="lazy" />
        </div>
      </div>
    </div>
  </PageTransition>
);

export default Contact;
