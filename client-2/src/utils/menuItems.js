import { FiHome, FiPackage, FiHeart, FiUser, FiSettings, FiMapPin, FiTag } from 'react-icons/fi';

export const userMenuItems = [
  { path: '/dashboard', label: 'Overview', icon: FiHome, end: true },
  { path: '/dashboard/orders', label: 'Orders', icon: FiPackage },
  { path: '/dashboard/wishlist', label: 'Wishlist', icon: FiHeart },
  { path: '/dashboard/profile', label: 'Profile', icon: FiUser },
  { path: '/dashboard/addresses', label: 'Addresses', icon: FiMapPin },
  { path: '/dashboard/settings', label: 'Settings', icon: FiSettings },
];

export const adminMenuItems = [
  { path: '/admin', label: 'Dashboard', icon: FiHome, end: true },
  { path: '/admin/products', label: 'Products', icon: FiPackage },
  { path: '/admin/categories', label: 'Categories', icon: FiMapPin },
  { path: '/admin/coupons', label: 'Coupons', icon: FiTag },
  { path: '/admin/orders', label: 'Orders', icon: FiPackage },
  { path: '/admin/users', label: 'Users', icon: FiUser },
];
