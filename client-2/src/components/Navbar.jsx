import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Badge, Dropdown } from 'antd';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import SearchBar from './SearchBar';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { selectCartCount } from '@/store/cartSlice';
import useAuth from '@/hooks/useAuth';
import { logout } from '@/store/authSlice';
import { categoryApi } from '@/api/categoryApi';
import { SITE_NAME } from '@/utils/constants';
import './Navbar.scss';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useAppSelector(selectCartCount);
  const wishlistCount = useAppSelector((s) => s.wishlist.items.length);
  const { isAuthenticated, user, isAdmin } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    categoryApi.getAll().then(({ data }) => setCategories(data?.category || [])).catch(() => {});
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const userMenu = {
    items: [
      { key: 'dashboard', label: 'Dashboard', onClick: () => navigate('/dashboard') },
      { key: 'orders', label: 'Orders', onClick: () => navigate('/dashboard/orders') },
      { key: 'wishlist', label: 'Wishlist', onClick: () => navigate('/dashboard/wishlist') },
      { key: 'profile', label: 'Profile', onClick: () => navigate('/dashboard/profile') },
      ...(isAdmin ? [{ key: 'admin', label: 'Admin Panel', onClick: () => navigate('/admin') }] : []),
      { type: 'divider' },
      { key: 'logout', label: 'Logout', danger: true, onClick: () => { dispatch(logout()); navigate('/'); } },
    ],
  };

  const categoryMenu = {
    items: categories.map((c) => ({
      key: c._id,
      label: c.name,
      onClick: () => navigate(`/products?category=${c.slug}`),
    })),
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="app-container navbar__inner">
        <Link to="/" className="navbar__logo">
          <img src="/images/sitelogo.png" alt={SITE_NAME} />
          <span>{SITE_NAME}</span>
        </Link>

        <nav className={`navbar__nav ${mobileOpen ? 'open' : ''}`}>
          <NavLink to="/" end onClick={() => setMobileOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setMobileOpen(false)}>Shop</NavLink>
          <Dropdown menu={categoryMenu} trigger={['hover']} placement="bottom">
            <span className="navbar__dropdown-trigger">Categories</span>
          </Dropdown>
          <NavLink to="/products?sort=newest" onClick={() => setMobileOpen(false)}>Deals</NavLink>
        </nav>

        <div className="navbar__search">
          <SearchBar compact />
        </div>

        <div className="navbar__actions">
          <Link to="/dashboard/wishlist" className="navbar__action" aria-label="Wishlist">
            <Badge count={wishlistCount} size="small" offset={[-2, 2]}>
              <FiHeart size={20} />
            </Badge>
          </Link>
          <Link to="/cart" className="navbar__action" aria-label="Cart">
            <Badge count={cartCount} size="small" offset={[-2, 2]}>
              <FiShoppingCart size={20} />
            </Badge>
          </Link>
          {isAuthenticated ? (
            <Dropdown menu={userMenu} trigger={['click']} placement="bottomRight">
              <button type="button" className="navbar__user-btn">
                <FiUser size={18} />
                <span className="d-none d-md-inline">{user?.name?.split(' ')[0]}</span>
              </button>
            </Dropdown>
          ) : (
            <Link to="/auth/login" className="btn btn-brand navbar__login-btn">
              Sign In
            </Link>
          )}
          <button
            type="button"
            className="navbar__mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
