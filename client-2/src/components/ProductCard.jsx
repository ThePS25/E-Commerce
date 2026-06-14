import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { getProductPhotoUrl } from '@/api/axiosClient';
import { formatPrice, truncateText } from '@/utils/formatters';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { addToCart } from '@/store/cartSlice';
import { toggleWishlist, selectWishlistIds } from '@/store/wishlistSlice';
import toast from 'react-hot-toast';
import './ProductCard.scss';

const ProductCard = memo(({ product, index = 0 }) => {
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector(selectWishlistIds);
  const isWishlisted = wishlistIds.includes(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
    toast.success('Added to cart');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -6 }}
    >
      <Link to={`/products/${product.slug}`} className="product-card__link">
        <div className="product-card__image-wrap">
          <img
            src={getProductPhotoUrl(product._id)}
            alt={product.name}
            loading="lazy"
            className="product-card__image"
          />
          <button
            type="button"
            className={`product-card__wishlist ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlist}
            aria-label="Toggle wishlist"
          >
            <FiHeart />
          </button>
        </div>
        <div className="product-card__body">
          {product.category?.name && (
            <span className="product-card__category">{product.category.name}</span>
          )}
          <h3 className="product-card__title">{product.name}</h3>
          <p className="product-card__desc">{truncateText(product.description, 80)}</p>
          <div className="product-card__footer">
            <span className="product-card__price">{formatPrice(product.price)}</span>
            <button
              type="button"
              className="product-card__cart-btn"
              onClick={handleAddToCart}
              aria-label="Add to cart"
            >
              <FiShoppingCart />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
