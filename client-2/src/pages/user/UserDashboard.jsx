import { Link } from 'react-router-dom';
import { FiPackage, FiHeart, FiShoppingBag } from 'react-icons/fi';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import PageTransition from '@/components/PageTransition';
import { userMenuItems } from '@/utils/menuItems';
import useAuth from '@/hooks/useAuth';
import { useAppSelector } from '@/hooks/useAppDispatch';

const UserDashboard = () => {
  const { user } = useAuth();
  const cartCount = useAppSelector((s) => s.cart.items.length);
  const wishlistCount = useAppSelector((s) => s.wishlist.items.length);

  return (
    <PageTransition>
      <div className="page-content app-container">
        <DashboardLayout menuItems={userMenuItems} title={`Welcome, ${user?.name?.split(' ')[0] || 'User'}!`}>
          <div className="row g-4 mb-4">
            <div className="col-md-4"><StatCard icon={FiShoppingBag} label="Cart Items" value={cartCount} color="primary" /></div>
            <div className="col-md-4"><StatCard icon={FiHeart} label="Wishlist" value={wishlistCount} color="secondary" /></div>
            <div className="col-md-4"><StatCard icon={FiPackage} label="Orders" value="—" color="accent" /></div>
          </div>
          <div className="d-flex gap-3 flex-wrap">
            <Link to="/dashboard/orders" className="btn btn-brand">View Orders</Link>
            <Link to="/products" className="btn btn-brand-outline">Continue Shopping</Link>
          </div>
        </DashboardLayout>
      </div>
    </PageTransition>
  );
};

export default UserDashboard;
