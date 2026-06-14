import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Popconfirm } from 'antd';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import PageTransition from '@/components/PageTransition';
import { productApi } from '@/api/productApi';
import { getProductPhotoUrl } from '@/api/axiosClient';
import { formatPrice } from '@/utils/formatters';
import { adminMenuItems } from '@/utils/menuItems';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    productApi.getAll()
      .then(({ data }) => setProducts(data?.products || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (pid) => {
    try {
      await productApi.delete(pid);
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Delete failed');
    }
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      render: (_, record) => (
        <div className="d-flex align-items-center gap-2">
          <img src={getProductPhotoUrl(record._id)} alt="" width={40} height={40} className="rounded" style={{ objectFit: 'cover' }} />
          {record.name}
        </div>
      ),
    },
    { title: 'Price', dataIndex: 'price', render: (p) => formatPrice(p) },
    { title: 'Qty', dataIndex: 'quantity' },
    { title: 'Category', dataIndex: ['category', 'name'] },
    {
      title: 'Actions',
      render: (_, record) => (
        <div className="d-flex gap-2">
          <Link to={`/admin/products/${record.slug}/edit`} className="btn btn-sm btn-brand-outline">Edit</Link>
          <Popconfirm title="Delete product?" onConfirm={() => handleDelete(record._id)}>
            <Button danger size="small">Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="page-content app-container">
        <DashboardLayout menuItems={adminMenuItems} title="Products">
          <div className="d-flex justify-content-between mb-4">
            <span className="text-muted">{products.length} products</span>
            <Link to="/admin/products/create" className="btn btn-brand">Add Product</Link>
          </div>
          <Table columns={columns} dataSource={products} rowKey="_id" loading={loading} scroll={{ x: 600 }} />
        </DashboardLayout>
      </div>
    </PageTransition>
  );
};

export default AdminProducts;
