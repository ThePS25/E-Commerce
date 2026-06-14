import { Link } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';

const About = () => (
  <PageTransition>
    <div className="page-content app-container">
      <div className="row align-items-center g-5">
        <div className="col-lg-6">
          <h1>About ZooPHii</h1>
          <p className="text-muted lead">Premium pet care products for the modern pet parent.</p>
          <p>We believe every pet deserves the best. ZooPHii curates high-quality food, toys, and accessories from trusted brands — delivered to your door with care.</p>
        </div>
        <div className="col-lg-6">
          <img src="/images/aboutus.png" alt="About ZooPHii" className="img-fluid rounded-4" loading="lazy" />
        </div>
      </div>
    </div>
  </PageTransition>
);

export default About;
