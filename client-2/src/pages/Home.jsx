import { useEffect, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import HeroBanner from '@/components/HeroBanner';
import SectionHeader from '@/components/SectionHeader';
import CategoryCard from '@/components/CategoryCard';
import ProductGrid from '@/components/ProductGrid';
import { ProductGridSkeleton } from '@/components/LoadingSkeleton';
import PageTransition from '@/components/PageTransition';
import { productApi } from '@/api/productApi';
import { categoryApi } from '@/api/categoryApi';
import { TESTIMONIALS } from '@/utils/constants';
import './Home.scss';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([productApi.getAll(), categoryApi.getAll()])
      .then(([prodRes, catRes]) => {
        setProducts(prodRes.data?.products || []);
        setCategories(catRes.data?.category || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const trending = products.slice(0, 4);
  const bestSellers = [...products].sort((a, b) => b.price - a.price).slice(0, 4);

  return (
    <PageTransition>
      <HeroBanner />

      <section className="section app-container">
        <SectionHeader title="Shop by Category" subtitle="Find the perfect products for your pet" linkTo="/products" />
        <div className="home-categories">
          {categories.slice(0, 6).map((cat, i) => (
            <CategoryCard key={cat._id} category={cat} index={i} />
          ))}
        </div>
      </section>

      <section className="section app-container home-promo">
        <div className="home-promo__banner">
          <div>
            <span className="badge-new">Limited Offer</span>
            <h2>Up to 30% off premium pet food</h2>
            <p>Stock up on nutrition your pets love. Offer ends soon.</p>
            <Link to="/products" className="btn btn-brand">Shop the Sale</Link>
          </div>
          <img src="/images/bannerff.png" alt="Promotional banner" loading="lazy" />
        </div>
      </section>

      <section className="section app-container">
        <SectionHeader title="Trending Now" subtitle="Popular picks this week" linkTo="/products" />
        {loading ? <ProductGridSkeleton count={4} /> : <ProductGrid products={trending} />}
      </section>

      <section className="section app-container">
        <SectionHeader title="Best Sellers" subtitle="Top-rated by pet parents" linkTo="/products?sort=price-desc" />
        {loading ? <ProductGridSkeleton count={4} /> : <ProductGrid products={bestSellers} />}
      </section>

      <section className="section app-container home-testimonials">
        <SectionHeader title="What Pet Parents Say" align="center" />
        <div className="home-testimonials__grid">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              className="testimonial-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="testimonial-card__stars">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <FiStar key={j} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <p>&ldquo;{t.text}&rdquo;</p>
              <div className="testimonial-card__author">
                <strong>{t.name}</strong>
                <span>{t.pet} owner</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section app-container">
        <div className="newsletter">
          <h2>Join the ZooPHii pack</h2>
          <p>Get exclusive deals, pet care tips, and new product alerts.</p>
          <form className="newsletter__form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" aria-label="Email for newsletter" />
            <button type="submit" className="btn btn-brand">Subscribe</button>
          </form>
        </div>
      </section>
    </PageTransition>
  );
};

export default memo(Home);
