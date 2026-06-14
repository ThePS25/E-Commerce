import { useEffect, useState } from 'react';
import { Tag } from 'antd';
import DashboardLayout from '@/components/DashboardLayout';
import EmptyState from '@/components/EmptyState';
import PageTransition from '@/components/PageTransition';
import { orderApi } from '@/api/orderApi';
import { getProductPhotoUrl } from '@/api/axiosClient';
import { formatPrice } from '@/utils/formatters';
import { userMenuItems } from '@/utils/menuItems';

const statusColor = { 'Not Process': 'default', Processing: 'processing', Shipped: 'blue', Delivered: 'success', Cancel: 'error' };

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getUserOrders()
      .then(({ data }) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <div className="page-content app-container">
        <DashboardLayout menuItems={userMenuItems} title="My Orders">
          {loading ? (
            <div className="page-loader"><div className="spinner-border text-primary" /></div>
          ) : orders.length === 0 ? (
            <EmptyState title="No orders yet" description="Your order history will appear here." />
          ) : (
            orders.map((order, i) => (
              <div key={order._id} className="card mb-4 border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <strong>Order #{i + 1}</strong>
                  <Tag color={statusColor[order.status]}>{order.status}</Tag>
                </div>
                <div className="card-body">
                  <p className="text-muted small mb-3">
                    {new Date(order.createdAt).toLocaleDateString()} · {order.products?.length} items
                    {order.payment?.method === 'cod' && ' · Pay on Delivery'}
                    {order.payment?.couponCode && ` · Coupon: ${order.payment.couponCode}`}
                  </p>
                  <div className="row g-3">
                    {order.products?.map((p) => (
                      <div key={p._id} className="col-6 col-md-3">
                        <img src={getProductPhotoUrl(p._id)} alt={p.name} className="rounded" style={{ height: 80, objectFit: 'cover', width: '100%' }} />
                        <p className="small mt-1 mb-0">{p.name}</p>
                        <p className="small text-muted">{formatPrice(p.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </DashboardLayout>
      </div>
    </PageTransition>
  );
};

export default Orders;
