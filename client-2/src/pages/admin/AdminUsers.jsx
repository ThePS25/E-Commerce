import DashboardLayout from '@/components/DashboardLayout';
import EmptyState from '@/components/EmptyState';
import PageTransition from '@/components/PageTransition';
import { adminMenuItems } from '@/utils/menuItems';

const AdminUsers = () => (
  <PageTransition>
    <div className="page-content app-container">
      <DashboardLayout menuItems={adminMenuItems} title="Users">
        <EmptyState
          title="User management"
          description="The backend does not expose a user listing API. User management can be added when the API is available."
        />
      </DashboardLayout>
    </div>
  </PageTransition>
);

export default AdminUsers;
