import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { signupUser } from '@/store/authSlice';
import useAuth from '@/hooks/useAuth';
import './AuthPages.scss';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '', answer: '' });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signupUser(form));
    if (signupUser.fulfilled.match(result)) {
      toast.success('Account created! Please sign in.');
      navigate('/auth/login');
    } else {
      toast.error(result.payload || 'Signup failed');
    }
  };

  const fields = [
    { name: 'name', icon: FiUser, placeholder: 'Full Name', type: 'text' },
    { name: 'email', icon: FiMail, placeholder: 'Email', type: 'email' },
    { name: 'password', icon: FiLock, placeholder: 'Password', type: 'password' },
    { name: 'phone', icon: FiPhone, placeholder: 'Phone', type: 'tel' },
    { name: 'address', icon: FiMapPin, placeholder: 'Address', type: 'text' },
    { name: 'answer', icon: FiLock, placeholder: 'Favorite sport (security question)', type: 'text' },
  ];

  return (
    <div className="auth-form auth-form--wide">
      <h1>Create Account</h1>
      <p className="auth-form__subtitle">Join thousands of happy pet parents.</p>

      <form onSubmit={handleSubmit}>
        {fields.map(({ name, icon: Icon, placeholder, type }) => (
          <div key={name} className="auth-form__field">
            <Icon className="auth-form__icon" />
            <input type={type} name={name} placeholder={placeholder} value={form[name]} onChange={handleChange} required />
          </div>
        ))}
        <button type="submit" className="btn btn-brand w-100" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      <p className="auth-form__footer">Already have an account? <Link to="/auth/login">Sign in</Link></p>
    </div>
  );
};

export default Signup;
