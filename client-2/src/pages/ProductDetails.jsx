import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar, FiTruck, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ProductGrid from '@/components/ProductGrid';
import { ProductGridSkeleton } from '@/components/LoadingSkeleton';
import PageTransition from '@/components/PageTransition';
import { productApi } from '@/api/productApi';
import { getProductPhotoUrl } from '@/api/axiosClient';
import { formatPrice } from '@/utils/formatters';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { addToCart } from '@/store/cartSlice';
import { toggleWishlist, selectWishlistIds } from '@/store/wishlistSlice';
import './ProductDetails.scss';

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(false);
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector(selectWishlistIds);
  const isWishlisted = product ? wishlistIds.includes(product._id) : false;

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    productApi.getBySlug(slug)
      .then(({ data }) => {
        setProduct(data.product);
        return productApi.getRelated(data.product._id, data.product.category._id);
      })
      .then(({ data }) => setRelated(data?.products || []))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="page-content app-container">
        <ProductGridSkeleton count={1} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-content app-container text-center">
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-brand mt-3">Back to Shop</Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="page-content app-container product-details">
        <div className="product-details__grid">
          <div
            className={`product-details__gallery ${zoom ? 'zoomed' : ''}`}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <img src={getProductPhotoUrl(product._id)} alt={product.name} />
          </div>

          <div className="product-details__info">
            {product.category?.name && (
              <span className="product-details__category">{product.category.name}</span>
            )}
            <h1>{product.name}</h1>
            <div className="product-details__rating">
              {[1, 2, 3, 4, 5].map((s) => (
                <FiStar key={s} fill="#F59E0B" color="#F59E0B" size={16} />
              ))}
              <span>(128 reviews)</span>
            </div>
            <p className="product-details__price">{formatPrice(product.price)}</p>
            <p className="product-details__desc">{product.description}</p>

            <div className="product-details__meta">
              <span><FiTruck /> Free shipping over $50</span>
              <span><FiShield /> Secure checkout</span>
            </div>

            <div className="product-details__actions">
              <button
                type="button"
                className="btn btn-brand"
                onClick={() => { dispatch(addToCart(product)); toast.success('Added to cart'); }}
              >
                <FiShoppingCart /> Add to Cart
              </button>
              <button
                type="button"
                className={`btn btn-brand-outline ${isWishlisted ? 'active' : ''}`}
                onClick={() => { dispatch(toggleWishlist(product)); toast.success(isWishlisted ? 'Removed' : 'Added to wishlist'); }}
              >
                <FiHeart /> {isWishlisted ? 'Wishlisted' : 'Wishlist'}
              </button>
            </div>

            <div className="product-details__specs">
              <div><strong>Quantity:</strong> {product.quantity} in stock</div>
              <div><strong>Shipping:</strong> {product.shipping ? 'Available' : 'Pickup only'}</div>
            </div>
          </div>
        </div>

        <section className="product-details__reviews">
          <h2>Customer Reviews</h2>
          <div className="reviews-placeholder">
            <p>Reviews feature coming soon. Be the first to share your experience!</p>
          </div>
        </section>

        {related.length > 0 && (
          <section className="product-details__related">
            <h2>Related Products</h2>
            <ProductGrid products={related} />
          </section>
        )}
      </div>
    </PageTransition>
  );
};

export default ProductDetails;
