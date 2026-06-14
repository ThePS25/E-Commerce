import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import PageTransition from '@/components/PageTransition';
import { authApi } from '@/api/authApi';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateUser } from '@/store/authSlice';
import useAuth from '@/hooks/useAuth';
import { userMenuItems } from '@/utils/menuItems';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: typeof user.address === 'string' ? user.address : JSON.stringify(user.address || ''),
        password: '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: form.name, phone: form.phone, address: form.address };
      if (form.password) payload.password = form.password;
      const { data } = await authApi.updateProfile(payload);
      if (data.success) {
        dispatch(updateUser(data.updatedUser));
        toast.success('Profile updated!');
      }
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="page-content app-container">
        <DashboardLayout menuItems={userMenuItems} title="Profile">
          <form onSubmit={handleSubmit} className="checkout__form" style={{ maxWidth: 480 }}>
            {['name', 'email', 'phone', 'address'].map((field) => (
              <input
                key={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                disabled={field === 'email'}
              />
            ))}
            <input type="password" placeholder="New password (optional)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="submit" className="btn btn-brand" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </DashboardLayout>
      </div>
    </PageTransition>
  );
};

export default Profile;
