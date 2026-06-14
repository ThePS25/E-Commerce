import { Outlet, Link } from 'react-router-dom';
import { SITE_NAME } from '@/utils/constants';
import './AuthLayout.scss';

const AuthLayout = () => (
  <div className="auth-layout">
    <div className="auth-layout__panel auth-layout__panel--brand">
      <Link to="/" className="auth-layout__logo">
        <img src="/images/sitelogo.png" alt={SITE_NAME} />
        <span>{SITE_NAME}</span>
      </Link>
      <h2>Welcome back, pet parent!</h2>
      <p>Sign in to track orders, manage wishlists, and get personalized recommendations.</p>
      <div className="auth-layout__features">
        <div>🐾 Curated pet products</div>
        <div>🚚 Fast & secure checkout</div>
        <div>💜 Loved by 50K+ pet parents</div>
      </div>
    </div>
    <div className="auth-layout__panel auth-layout__panel--form">
      <Outlet />
    </div>
  </div>
);

export default AuthLayout;
