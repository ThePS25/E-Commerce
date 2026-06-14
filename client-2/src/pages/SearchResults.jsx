import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '@/components/ProductGrid';
import { ProductGridSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import PageTransition from '@/components/PageTransition';
import { productApi } from '@/api/productApi';
import { useNavigate } from 'react-router-dom';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    productApi.search(q)
      .then(({ data }) => setResults(Array.isArray(data) ? data : []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <PageTransition>
      <div className="page-content app-container">
        <h1>Search Results</h1>
        <p className="text-muted mb-4">
          {loading ? 'Searching...' : `${results.length} results for "${q}"`}
        </p>
        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : results.length === 0 ? (
          <EmptyState
            title="No products found"
            description={`We couldn't find anything matching "${q}".`}
            action={() => navigate('/products')}
            actionLabel="Browse All Products"
          />
        ) : (
          <ProductGrid products={results} />
        )}
      </div>
    </PageTransition>
  );
};

export default SearchResults;
