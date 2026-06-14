import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Select } from 'antd';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import PageTransition from '@/components/PageTransition';
import { productApi } from '@/api/productApi';
import { categoryApi } from '@/api/categoryApi';
import { getProductPhotoUrl } from '@/api/axiosClient';
import { adminMenuItems } from '@/utils/menuItems';
import './AdminForm.scss';

const UpdateProduct = () => {
  const { slug } = useParams();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    shipping: false,
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    categoryApi.getAll().then(({ data }) => setCategories(data?.category || []));
    productApi.getBySlug(slug).then(({ data }) => {
      const p = data.product;
      setProduct(p);
      setPhotoPreview(getProductPhotoUrl(p._id));
      setForm({
        name: p.name,
        description: p.description,
        price: p.price,
        quantity: p.quantity,
        category: p.category?._id,
        shipping: p.shipping,
      });
    });
  }, [slug]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    setPhoto(file || null);
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, k === 'shipping' ? String(v) : v));
    if (photo) fd.append('photo', photo);
    try {
      const { data } = await productApi.update(product._id, fd);
      if (data.success) {
        toast.success('Product updated!');
        navigate('/admin/products');
      }
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="page-loader">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="page-content app-container">
        <DashboardLayout menuItems={adminMenuItems} title="Edit Product">
          <div className="admin-form-panel">
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form__group">
                <label htmlFor="edit-name">Product Name</label>
                <input
                  id="edit-name"
                  className="admin-form__input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form__group">
                <label htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  className="admin-form__textarea"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form__row">
                <div className="admin-form__group">
                  <label htmlFor="edit-price">Price ($)</label>
                  <input
                    id="edit-price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="admin-form__input"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form__group">
                  <label htmlFor="edit-quantity">Quantity</label>
                  <input
                    id="edit-quantity"
                    type="number"
                    min="0"
                    className="admin-form__input"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="admin-form__group">
                <label htmlFor="edit-category">Category</label>
                <Select
                  id="edit-category"
                  style={{ width: '100%' }}
                  size="large"
                  value={form.category}
                  onChange={(v) => setForm({ ...form, category: v })}
                  options={categories.map((c) => ({ value: c._id, label: c.name }))}
                />
              </div>

              <div className="admin-form__checkbox">
                <input
                  type="checkbox"
                  id="edit-shipping"
                  checked={form.shipping}
                  onChange={(e) => setForm({ ...form, shipping: e.target.checked })}
                />
                <label htmlFor="edit-shipping">Shipping available</label>
              </div>

              <div className="admin-form__file">
                <label htmlFor="edit-photo">Product Photo</label>
                <input id="edit-photo" type="file" accept="image/*" onChange={handlePhotoChange} />
                {photoPreview && (
                  <img src={photoPreview} alt="Preview" className="admin-form__preview" />
                )}
              </div>

              <div className="admin-form__actions">
                <button type="button" className="btn btn-brand-outline" onClick={() => navigate('/admin/products')}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-brand" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </DashboardLayout>
      </div>
    </PageTransition>
  );
};

export default UpdateProduct;
