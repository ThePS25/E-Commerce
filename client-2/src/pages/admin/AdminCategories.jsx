import { useEffect, useState } from 'react';
import { Table, Button, Input, Popconfirm, Modal } from 'antd';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import PageTransition from '@/components/PageTransition';
import { categoryApi } from '@/api/categoryApi';
import { adminMenuItems } from '@/utils/menuItems';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');

  const fetch = () => {
    categoryApi.getAll()
      .then(({ data }) => setCategories(data?.category || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    try {
      if (editId) {
        await categoryApi.update(editId, { name });
        toast.success('Category updated');
      } else {
        await categoryApi.create({ name });
        toast.success('Category created');
      }
      setModalOpen(false);
      setName('');
      setEditId(null);
      fetch();
    } catch {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await categoryApi.delete(id);
      toast.success('Category deleted');
      fetch();
    } catch {
      toast.error('Delete failed');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Slug', dataIndex: 'slug' },
    {
      title: 'Actions',
      render: (_, record) => (
        <div className="d-flex gap-2">
          <Button size="small" onClick={() => { setEditId(record._id); setName(record.name); setModalOpen(true); }}>Edit</Button>
          <Popconfirm title="Delete?" onConfirm={() => handleDelete(record._id)}>
            <Button danger size="small">Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="page-content app-container">
        <DashboardLayout menuItems={adminMenuItems} title="Categories">
          <div className="d-flex justify-content-end mb-4">
            <Button type="primary" onClick={() => { setEditId(null); setName(''); setModalOpen(true); }}>Add Category</Button>
          </div>
          <Table columns={columns} dataSource={categories} rowKey="_id" loading={loading} />
          <Modal open={modalOpen} onCancel={() => setModalOpen(false)} onOk={handleSave} title={editId ? 'Edit Category' : 'New Category'}>
            <Input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} />
          </Modal>
        </DashboardLayout>
      </div>
    </PageTransition>
  );
};

export default AdminCategories;
