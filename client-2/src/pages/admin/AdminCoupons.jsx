import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Modal, Input, Select, Switch, InputNumber } from 'antd';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import PageTransition from '@/components/PageTransition';
import { couponApi } from '@/api/couponApi';
import { adminMenuItems } from '@/utils/menuItems';
import { formatCouponLabel } from '@/utils/formatters';
import './AdminForm.scss';

const emptyForm = {
  code: '',
  description: '',
  discountType: 'percent',
  discountValue: 10,
  minOrder: 0,
  maxUses: '',
  isActive: true,
  expiresAt: '',
};

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchCoupons = () => {
    couponApi.getAll()
      .then(({ data }) => setCoupons(data?.coupons || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCoupons(); }, []);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (coupon) => {
    setEditId(coupon._id);
    setForm({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrder: coupon.minOrder || 0,
      maxUses: coupon.maxUses ?? '',
      isActive: coupon.isActive,
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        code: form.code.toUpperCase(),
        maxUses: form.maxUses === '' ? null : Number(form.maxUses),
        expiresAt: form.expiresAt || null,
      };
      if (editId) {
        await couponApi.update(editId, payload);
        toast.success('Coupon updated');
      } else {
        await couponApi.create(payload);
        toast.success('Coupon created');
      }
      setModalOpen(false);
      fetchCoupons();
    } catch {
      toast.error('Could not save coupon');
    }
  };

  const handleDelete = async (id) => {
    try {
      await couponApi.delete(id);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch {
      toast.error('Delete failed');
    }
  };

  const columns = [
    { title: 'Code', dataIndex: 'code', render: (c) => <strong>{c}</strong> },
    { title: 'Description', dataIndex: 'description' },
    {
      title: 'Discount',
      render: (_, r) => formatCouponLabel(r),
    },
    { title: 'Min Order', dataIndex: 'minOrder', render: (v) => `$${v || 0}` },
    { title: 'Uses', render: (_, r) => `${r.usedCount}${r.maxUses ? ` / ${r.maxUses}` : ''}` },
    {
      title: 'Status',
      dataIndex: 'isActive',
      render: (active) => (active ? 'Active' : 'Inactive'),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <div className="d-flex gap-2">
          <Button size="small" onClick={() => openEdit(record)}>Edit</Button>
          <Popconfirm title="Delete coupon?" onConfirm={() => handleDelete(record._id)}>
            <Button danger size="small">Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="page-content app-container">
        <DashboardLayout menuItems={adminMenuItems} title="Coupon Codes">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <p className="text-muted mb-0">Create coupons that appear as suggestions during checkout.</p>
            <Button type="primary" onClick={openCreate}>Add Coupon</Button>
          </div>
          <Table columns={columns} dataSource={coupons} rowKey="_id" loading={loading} scroll={{ x: 800 }} />

          <Modal
            open={modalOpen}
            onCancel={() => setModalOpen(false)}
            onOk={handleSave}
            title={editId ? 'Edit Coupon' : 'New Coupon'}
            width={560}
          >
            <div className="admin-form" style={{ marginTop: 16 }}>
              <div className="admin-form__group">
                <label>Coupon Code</label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="PET10" />
              </div>
              <div className="admin-form__group">
                <label>Description (shown to users)</label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="10% off your first order" />
              </div>
              <div className="admin-form__row">
                <div className="admin-form__group">
                  <label>Discount Type</label>
                  <Select
                    style={{ width: '100%' }}
                    value={form.discountType}
                    onChange={(v) => setForm({ ...form, discountType: v })}
                    options={[
                      { value: 'percent', label: 'Percentage' },
                      { value: 'fixed', label: 'Fixed Amount' },
                    ]}
                  />
                </div>
                <div className="admin-form__group">
                  <label>Value</label>
                  <InputNumber style={{ width: '100%' }} min={0} value={form.discountValue} onChange={(v) => setForm({ ...form, discountValue: v })} />
                </div>
              </div>
              <div className="admin-form__row">
                <div className="admin-form__group">
                  <label>Minimum Order ($)</label>
                  <InputNumber style={{ width: '100%' }} min={0} value={form.minOrder} onChange={(v) => setForm({ ...form, minOrder: v })} />
                </div>
                <div className="admin-form__group">
                  <label>Max Uses (optional)</label>
                  <InputNumber style={{ width: '100%' }} min={1} value={form.maxUses} onChange={(v) => setForm({ ...form, maxUses: v ?? '' })} />
                </div>
              </div>
              <div className="admin-form__group">
                <label>Expiry Date (optional)</label>
                <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
              </div>
              <div className="admin-form__checkbox">
                <Switch checked={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} />
                <label>Active</label>
              </div>
            </div>
          </Modal>
        </DashboardLayout>
      </div>
    </PageTransition>
  );
};

export default AdminCoupons;
