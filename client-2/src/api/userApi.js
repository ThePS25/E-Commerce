import { authApi } from './authApi';

export const userApi = {
  updateProfile: (data) => authApi.updateProfile(data),
  verifySession: () => authApi.userAuth(),
  verifyAdmin: () => authApi.adminAuth(),
};

export default userApi;
