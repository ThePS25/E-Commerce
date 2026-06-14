import { useAppSelector } from './useAppDispatch';

export const useAuth = () => {
  const auth = useAppSelector((state) => state.auth);
  const isAdmin = auth.user?.role === 1;
  return { ...auth, isAdmin };
};

export default useAuth;
