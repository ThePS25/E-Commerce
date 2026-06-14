import { memo } from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.scss';

const ProductGrid = memo(({ products, viewMode = 'grid' }) => (
  <div className={`product-grid product-grid--${viewMode}`}>
    {products.map((product, index) => (
      <ProductCard key={product._id} product={product} index={index} />
    ))}
  </div>
));

ProductGrid.displayName = 'ProductGrid';
export default ProductGrid;
