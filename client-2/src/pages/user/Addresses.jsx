import DashboardLayout from '@/components/DashboardLayout';
import PageTransition from '@/components/PageTransition';
import useAuth from '@/hooks/useAuth';
import { userMenuItems } from '@/utils/menuItems';

const Addresses = () => {
  const { user } = useAuth();
  const address = typeof user?.address === 'string' ? user.address : JSON.stringify(user?.address || '');

  return (
    <PageTransition>
      <div className="page-content app-container">
        <DashboardLayout menuItems={userMenuItems} title="Address Book">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12, maxWidth: 480 }}>
            <h5>Default Address</h5>
            <p className="text-muted mb-1">{user?.name}</p>
            <p className="mb-1">{address || 'No address saved'}</p>
            <p className="text-muted small">{user?.phone}</p>
            <p className="text-muted small mt-3">Update your address in Profile settings.</p>
          </div>
        </DashboardLayout>
      </div>
    </PageTransition>
  );
};

export default Addresses;
