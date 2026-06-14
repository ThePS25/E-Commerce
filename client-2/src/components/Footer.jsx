import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMail } from 'react-icons/fi';
import { SITE_NAME, SITE_TAGLINE } from '@/utils/constants';
import './Footer.scss';

const Footer = () => (
  <footer className="footer">
    <div className="app-container">
      <div className="footer__grid">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <img src="/images/sitelogo.png" alt={SITE_NAME} />
            <span>{SITE_NAME}</span>
          </Link>
          <p>{SITE_TAGLINE}</p>
          <div className="footer__social">
            <a href="#" aria-label="Facebook"><FiFacebook /></a>
            <a href="#" aria-label="Instagram"><FiInstagram /></a>
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
            <a href="#" aria-label="Email"><FiMail /></a>
          </div>
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products?sort=newest">New Arrivals</Link></li>
            <li><Link to="/products?sort=price-asc">Best Deals</Link></li>
          </ul>
        </div>
        <div>
          <h4>Support</h4>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/policy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4>Account</h4>
          <ul>
            <li><Link to="/auth/login">Sign In</Link></li>
            <li><Link to="/dashboard/orders">Track Order</Link></li>
            <li><Link to="/dashboard/wishlist">Wishlist</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
