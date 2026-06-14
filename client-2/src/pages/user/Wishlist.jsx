import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProductGrid from '@/components/ProductGrid';
import EmptyState from '@/components/EmptyState';
import DashboardLayout from '@/components/DashboardLayout';
import PageTransition from '@/components/PageTransition';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { addToCart } from '@/store/cartSlice';
import { userMenuItems } from '@/utils/menuItems';

const Wishlist = () => {
  const items = useAppSelector((s) => s.wishlist.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAddAll = () => {
    items.forEach((item) => dispatch(addToCart(item)));
    toast.success('All items added to cart');
  };

  return (
    <PageTransition>
      <div className="page-content app-container">
        <DashboardLayout menuItems={userMenuItems} title="My Wishlist">
          {items.length === 0 ? (
            <EmptyState
              title="Wishlist is empty"
              description="Save products you love for later."
              action={() => navigate('/products')}
              actionLabel="Browse Products"
            />
          ) : (
            <>
              <button type="button" className="btn btn-brand mb-4" onClick={handleAddAll}>Add All to Cart</button>
              <ProductGrid products={items} />
            </>
          )}
        </DashboardLayout>
      </div>
    </PageTransition>
  );
};

export default Wishlist;
