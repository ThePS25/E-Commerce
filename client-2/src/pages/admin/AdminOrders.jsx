import { useEffect, useState } from 'react';
import { Table, Select, Tag } from 'antd';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import PageTransition from '@/components/PageTransition';
import { orderApi } from '@/api/orderApi';
import { ORDER_STATUSES } from '@/utils/constants';
import { adminMenuItems } from '@/utils/menuItems';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    orderApi.getAllOrders()
      .then(({ data }) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await orderApi.updateStatus(orderId, status);
      toast.success('Status updated');
      fetch();
    } catch {
      toast.error('Update failed');
    }
  };

  const columns = [
    { title: 'Order ID', dataIndex: '_id', render: (id) => id.slice(-6).toUpperCase() },
    { title: 'Buyer', dataIndex: ['buyer', 'name'] },
    { title: 'Items', dataIndex: 'products', render: (p) => p?.length },
    { title: 'Date', dataIndex: 'createdAt', render: (d) => new Date(d).toLocaleDateString() },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status, record) => (
        <Select
          value={status}
          size="small"
          style={{ width: 130 }}
          onChange={(v) => handleStatusChange(record._id, v)}
          options={ORDER_STATUSES.map((s) => ({ value: s, label: s }))}
        />
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'payment',
      render: (p) => {
        if (p?.method === 'cod') return <Tag color="orange">Pay on Delivery</Tag>;
        if (p?.success) return <Tag color="success">Paid Online</Tag>;
        return <Tag color="default">Pending</Tag>;
      },
    },
  ];

  return (
    <PageTransition>
      <div className="page-content app-container">
        <DashboardLayout menuItems={adminMenuItems} title="Orders">
          <Table columns={columns} dataSource={orders} rowKey="_id" loading={loading} scroll={{ x: 700 }} />
        </DashboardLayout>
      </div>
    </PageTransition>
  );
};

export default AdminOrders;
