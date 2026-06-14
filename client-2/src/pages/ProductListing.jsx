import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Select, Pagination } from 'antd';
import { FiGrid, FiList, FiSliders } from 'react-icons/fi';
import FilterPanel from '@/components/FilterPanel';
import ProductGrid from '@/components/ProductGrid';
import { ProductGridSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import PageTransition from '@/components/PageTransition';
import { productApi } from '@/api/productApi';
import { categoryApi } from '@/api/categoryApi';
import { SORT_OPTIONS, PRODUCTS_PER_PAGE } from '@/utils/constants';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setViewMode, toggleFilters } from '@/store/uiSlice';
import './ProductListing.scss';

const sortProducts = (products, sort) => {
  const list = [...products];
  switch (sort) {
    case 'price-asc': return list.sort((a, b) => a.price - b.price);
    case 'price-desc': return list.sort((a, b) => b.price - a.price);
    case 'name-asc': return list.sort((a, b) => a.name.localeCompare(b.name));
    default: return list;
  }
};

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [checked, setChecked] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const viewMode = useAppSelector((s) => s.ui.viewMode);
  const filtersOpen = useAppSelector((s) => s.ui.filtersOpen);
  const dispatch = useAppDispatch();

  const page = Number(searchParams.get('page') || 1);
  const sort = searchParams.get('sort') || 'newest';
  const categorySlug = searchParams.get('category');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      if (checked.length || priceRange) {
        const { data } = await productApi.filter({ checked, radio: priceRange ? priceRange : [] });
        setProducts(data?.products || []);
        setTotal(data?.products?.length || 0);
      } else if (categorySlug) {
        const { data } = await productApi.getByCategory(categorySlug);
        setProducts(data?.products || []);
        setTotal(data?.products?.length || 0);
      } else {
        const [listRes, countRes] = await Promise.all([
          productApi.getPaginated(page),
          productApi.getCount(),
        ]);
        setProducts(listRes.data?.products || []);
        setTotal(countRes.data?.total || 0);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, checked, priceRange, categorySlug]);

  useEffect(() => {
    categoryApi.getAll().then(({ data }) => setCategories(data?.category || [])).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const sorted = useMemo(() => sortProducts(products, sort), [products, sort]);

  const handleReset = () => {
    setChecked([]);
    setPriceRange(null);
    setSearchParams({});
  };

  return (
    <PageTransition>
      <div className="page-content app-container product-listing">
        <div className="product-listing__header">
          <div>
            <h1>Shop All Products</h1>
            <p className="text-muted">{total} products found</p>
          </div>
          <div className="product-listing__controls">
            <button
              type="button"
              className="product-listing__filter-btn d-lg-none"
              onClick={() => dispatch(toggleFilters())}
            >
              <FiSliders /> Filters
            </button>
            <Select
              value={sort}
              onChange={(v) => setSearchParams({ ...Object.fromEntries(searchParams), sort: v, page: '1' })}
              options={SORT_OPTIONS}
              style={{ width: 180 }}
            />
            <div className="product-listing__view-toggle">
              <button
                type="button"
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => dispatch(setViewMode('grid'))}
                aria-label="Grid view"
              >
                <FiGrid />
              </button>
              <button
                type="button"
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => dispatch(setViewMode('list'))}
                aria-label="List view"
              >
                <FiList />
              </button>
            </div>
          </div>
        </div>

        <div className="product-listing__layout">
          <div className={`product-listing__filters ${filtersOpen ? 'open' : ''}`}>
            <FilterPanel
              categories={categories}
              checked={checked}
              priceRange={priceRange}
              onCategoryChange={setChecked}
              onPriceChange={setPriceRange}
              onReset={handleReset}
            />
          </div>

          <div className="product-listing__results">
            {loading ? (
              <ProductGridSkeleton count={6} />
            ) : sorted.length === 0 ? (
              <EmptyState
                title="No products found"
                description="Try adjusting your filters or browse all products."
                action={handleReset}
                actionLabel="Clear Filters"
              />
            ) : (
              <>
                <ProductGrid products={sorted} viewMode={viewMode} />
                {!checked.length && !priceRange && !categorySlug && (
                  <div className="product-listing__pagination">
                    <Pagination
                      current={page}
                      total={total}
                      pageSize={PRODUCTS_PER_PAGE}
                      onChange={(p) => setSearchParams({ ...Object.fromEntries(searchParams), page: String(p) })}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductListing;
