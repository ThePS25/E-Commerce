import './LoadingSkeleton.scss';

export const ProductCardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-card__image" />
    <div className="skeleton-card__body">
      <div className="skeleton skeleton-card__title" />
      <div className="skeleton skeleton-card__text" />
      <div className="skeleton skeleton-card__price" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 6 }) => (
  <div className="skeleton-grid">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const StatCardSkeleton = () => (
  <div className="skeleton-stat">
    <div className="skeleton skeleton-stat__value" />
    <div className="skeleton skeleton-stat__label" />
  </div>
);

const LoadingSkeleton = { ProductCardSkeleton, ProductGridSkeleton, StatCardSkeleton };
export default LoadingSkeleton;
