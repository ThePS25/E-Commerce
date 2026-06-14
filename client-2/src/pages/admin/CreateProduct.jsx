import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select } from 'antd';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import PageTransition from '@/components/PageTransition';
import { productApi } from '@/api/productApi';
import { categoryApi } from '@/api/categoryApi';
import { adminMenuItems } from '@/utils/menuItems';
import './AdminForm.scss';

const CreateProduct = () => {
  const [categories, setCategories] = useState([]);
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
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    setPhoto(file || null);
    setPhotoPreview(file ? URL.createObjectURL(file) : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) {
      toast.error('Please select a category');
      return;
    }
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, k === 'shipping' ? String(v) : v));
    if (photo) fd.append('photo', photo);
    try {
      const { data } = await productApi.create(fd);
      if (data.success) {
        toast.success('Product created!');
        navigate('/admin/products');
      }
    } catch {
      toast.error('Create failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="page-content app-container">
        <DashboardLayout menuItems={adminMenuItems} title="Create Product">
          <div className="admin-form-panel">
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form__group">
                <label htmlFor="product-name">Product Name</label>
                <input
                  id="product-name"
                  className="admin-form__input"
                  placeholder="e.g. Premium Dog Food"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form__group">
                <label htmlFor="product-description">Description</label>
                <textarea
                  id="product-description"
                  className="admin-form__textarea"
                  placeholder="Describe the product..."
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form__row">
                <div className="admin-form__group">
                  <label htmlFor="product-price">Price ($)</label>
                  <input
                    id="product-price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="admin-form__input"
                    placeholder="29.99"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form__group">
                  <label htmlFor="product-quantity">Quantity</label>
                  <input
                    id="product-quantity"
                    type="number"
                    min="0"
                    className="admin-form__input"
                    placeholder="100"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="admin-form__group">
                <label htmlFor="product-category">Category</label>
                <Select
                  id="product-category"
                  className="admin-form__select"
                  placeholder="Select a category"
                  style={{ width: '100%' }}
                  size="large"
                  value={form.category || undefined}
                  onChange={(v) => setForm({ ...form, category: v })}
                  options={categories.map((c) => ({ value: c._id, label: c.name }))}
                />
              </div>

              <div className="admin-form__checkbox">
                <input
                  type="checkbox"
                  id="shipping"
                  checked={form.shipping}
                  onChange={(e) => setForm({ ...form, shipping: e.target.checked })}
                />
                <label htmlFor="shipping">Shipping available</label>
              </div>

              <div className="admin-form__file">
                <label htmlFor="product-photo">Product Photo</label>
                <input
                  id="product-photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                {photoPreview && (
                  <img src={photoPreview} alt="Preview" className="admin-form__preview" />
                )}
              </div>

              <div className="admin-form__actions">
                <button type="button" className="btn btn-brand-outline" onClick={() => navigate('/admin/products')}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-brand" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </DashboardLayout>
      </div>
    </PageTransition>
  );
};

export default CreateProduct;
