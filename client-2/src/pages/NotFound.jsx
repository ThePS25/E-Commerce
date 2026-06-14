import { Link } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';

const NotFound = () => (
  <PageTransition>
    <div className="page-content app-container text-center">
      <h1 className="display-1 gradient-text">404</h1>
      <h2>Page not found</h2>
      <p className="text-muted mb-4">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link to="/" className="btn btn-brand">Go Home</Link>
    </div>
  </PageTransition>
);

export default NotFound;
