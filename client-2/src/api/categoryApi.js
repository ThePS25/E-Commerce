import axiosClient from './axiosClient';

export const categoryApi = {
  getAll: () => axiosClient.get('/category/get-category'),
  getBySlug: (slug) => axiosClient.get(`/category/single-category/${slug}`),
  create: (data) => axiosClient.post('/category/create-category', data),
  update: (id, data) => axiosClient.put(`/category/update-category/${id}`, data),
  delete: (id) => axiosClient.delete(`/category/delete-category/${id}`),
};

export default categoryApi;
