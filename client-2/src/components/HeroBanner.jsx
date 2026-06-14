import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { SITE_TAGLINE } from '@/utils/constants';
import './HeroBanner.scss';

const HeroBanner = () => (
  <section className="hero">
    <div className="hero__bg" />
    <div className="app-container hero__content">
      <motion.div
        className="hero__text"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="badge-new hero__badge">New Collection 2026</span>
        <h1 className="hero__title">
          Everything your <span className="gradient-text">best friend</span> deserves
        </h1>
        <p className="hero__subtitle">{SITE_TAGLINE}</p>
        <div className="hero__actions">
          <Link to="/products" className="btn btn-brand hero__cta">
            Shop Now <FiArrowRight />
          </Link>
          <Link to="/products?sort=newest" className="btn btn-brand-outline">
            Explore Deals
          </Link>
        </div>
        <div className="hero__stats">
          <div><strong>500+</strong><span>Products</span></div>
          <div><strong>50K+</strong><span>Happy Pets</span></div>
          <div><strong>4.9★</strong><span>Rating</span></div>
        </div>
      </motion.div>
      <motion.div
        className="hero__visual"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <img src="/images/bannerfff.png" alt="Happy pets" loading="eager" />
      </motion.div>
    </div>
  </section>
);

export default HeroBanner;
