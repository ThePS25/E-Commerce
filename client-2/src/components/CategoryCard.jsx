import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORY_ICONS } from '@/utils/constants';
import './CategoryCard.scss';

const getIcon = (name = '') => {
  const lower = name.toLowerCase();
  if (lower.includes('dog')) return CATEGORY_ICONS.dog;
  if (lower.includes('cat')) return CATEGORY_ICONS.cat;
  if (lower.includes('bird')) return CATEGORY_ICONS.bird;
  if (lower.includes('fish')) return CATEGORY_ICONS.fish;
  return CATEGORY_ICONS.default;
};

const CategoryCard = ({ category, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.06 }}
    whileHover={{ y: -4 }}
  >
    <Link to={`/products?category=${category.slug}`} className="category-card">
      <span className="category-card__icon">{getIcon(category.name)}</span>
      <span className="category-card__name">{category.name}</span>
    </Link>
  </motion.div>
);

export default CategoryCard;
