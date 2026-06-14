import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authApi } from '@/api/authApi';
import './AuthPages.scss';

const ForgotPassword = () => {
  const [form, setForm] = useState({ email: '', answer: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.forgotPassword(form);
      if (data.success) {
        toast.success('Password reset successfully!');
        navigate('/auth/login');
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Reset failed. Check your email and security answer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h1>Reset Password</h1>
      <p className="auth-form__subtitle">Enter your email and security answer to reset.</p>

      <form onSubmit={handleSubmit}>
        <div className="auth-form__field">
          <FiMail className="auth-form__icon" />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="auth-form__field">
          <FiLock className="auth-form__icon" />
          <input type="text" placeholder="Favorite sport (security answer)" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} required />
        </div>
        <div className="auth-form__field">
          <FiLock className="auth-form__icon" />
          <input type="password" placeholder="New password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} required />
        </div>
        <button type="submit" className="btn btn-brand w-100" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      <p className="auth-form__footer"><Link to="/auth/login">Back to Sign In</Link></p>
    </div>
  );
};

export default ForgotPassword;
