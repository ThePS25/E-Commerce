import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { loginUser, clearError } from '@/store/authSlice';
import useAuth from '@/hooks/useAuth';
import './AuthPages.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useAuth();
  const from = location.state || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back!');
      navigate(from);
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <div className="auth-form">
      <h1>Sign In</h1>
      <p className="auth-form__subtitle">Welcome back! Enter your credentials.</p>
      {error && <div className="auth-form__error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="auth-form__field">
          <FiMail className="auth-form__icon" />
          <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </div>
        <div className="auth-form__field">
          <FiLock className="auth-form__icon" />
          <input type={showPass ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="button" className="auth-form__toggle" onClick={() => setShowPass(!showPass)}>
            {showPass ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        <div className="auth-form__links">
          <Link to="/auth/forgot-password">Forgot password?</Link>
        </div>
        <button type="submit" className="btn btn-brand w-100" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-form__divider"><span>or continue with</span></div>
      <div className="auth-form__social">
        <button type="button" disabled title="Coming soon"><FaGoogle /> Google</button>
        <button type="button" disabled title="Coming soon"><FaFacebook /> Facebook</button>
      </div>
      <p className="auth-form__footer">Don&apos;t have an account? <Link to="/auth/signup">Sign up</Link></p>
    </div>
  );
};

export default Login;
