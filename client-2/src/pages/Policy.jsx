import { Link } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';

const Policy = () => (
  <PageTransition>
    <div className="page-content app-container" style={{ maxWidth: 720 }}>
      <h1>Privacy Policy</h1>
      <p className="text-muted">Last updated: June 2026</p>
      <p>At ZooPHii, we respect your privacy. This policy describes how we collect, use, and protect your personal information when you use our platform.</p>
      <h4>Information We Collect</h4>
      <p>We collect information you provide during registration, checkout, and when contacting support — including name, email, address, and payment details processed securely via Braintree.</p>
      <h4>How We Use Your Data</h4>
      <p>Your data is used to process orders, improve our services, and communicate important updates. We never sell your personal information to third parties.</p>
      <Link to="/" className="btn btn-brand-outline mt-3">Back to Home</Link>
    </div>
  </PageTransition>
);

export default Policy;
