import DashboardLayout from '@/components/DashboardLayout';
import PageTransition from '@/components/PageTransition';
import { userMenuItems } from '@/utils/menuItems';

const Settings = () => (
  <PageTransition>
    <div className="page-content app-container">
      <DashboardLayout menuItems={userMenuItems} title="Settings">
        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12, maxWidth: 480 }}>
          <h5>Notifications</h5>
          <div className="form-check mb-2">
            <input className="form-check-input" type="checkbox" id="emailNotif" defaultChecked />
            <label className="form-check-label" htmlFor="emailNotif">Email notifications</label>
          </div>
          <div className="form-check mb-4">
            <input className="form-check-input" type="checkbox" id="promoNotif" defaultChecked />
            <label className="form-check-label" htmlFor="promoNotif">Promotional emails</label>
          </div>
          <h5>Preferences</h5>
          <p className="text-muted small">More settings coming soon.</p>
        </div>
      </DashboardLayout>
    </div>
  </PageTransition>
);

export default Settings;
