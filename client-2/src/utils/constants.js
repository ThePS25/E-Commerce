export const PRICE_RANGES = [
  { id: 0, name: '$0 – $19', array: [0, 19] },
  { id: 1, name: '$20 – $39', array: [20, 39] },
  { id: 2, name: '$40 – $59', array: [40, 59] },
  { id: 3, name: '$60 – $79', array: [60, 79] },
  { id: 4, name: '$80 – $99', array: [80, 99] },
  { id: 5, name: '$100+', array: [100, 9999] },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A–Z' },
];

export const ORDER_STATUSES = [
  'Not Process',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancel',
];

export const PRODUCTS_PER_PAGE = 6;

export const SITE_NAME = 'ZooPHii';
export const SITE_TAGLINE = 'Premium pet care, delivered with love';

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah M.',
    pet: 'Golden Retriever',
    text: 'ZooPHii has become our go-to for quality pet food and toys. Fast delivery and great prices!',
    rating: 5,
  },
  {
    id: 2,
    name: 'James K.',
    pet: 'Persian Cat',
    text: 'The product selection is amazing. My cat loves everything we ordered. Highly recommend!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily R.',
    pet: 'Beagle',
    text: 'Customer service is top-notch. They helped me find the perfect food for my sensitive pup.',
    rating: 5,
  },
];

export const CATEGORY_ICONS = {
  default: '🐾',
  dog: '🐕',
  cat: '🐈',
  bird: '🐦',
  fish: '🐠',
  small: '🐹',
};
