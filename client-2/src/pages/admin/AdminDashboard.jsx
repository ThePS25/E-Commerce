import { useEffect, useState } from 'react';
import { FiDollarSign, FiPackage, FiUsers, FiTrendingUp } from 'react-icons/fi';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import PageTransition from '@/components/PageTransition';
import { productApi } from '@/api/productApi';
import { orderApi } from '@/api/orderApi';
import { categoryApi } from '@/api/categoryApi';
import { formatPrice } from '@/utils/formatters';
import { adminMenuItems } from '@/utils/menuItems';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, categories: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([
      productApi.getCount(),
      orderApi.getAllOrders(),
      categoryApi.getAll(),
    ]).then(([countRes, ordersRes, catRes]) => {
      const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      const revenue = orders.reduce((sum, o) =>
        sum + (o.products?.reduce((s, p) => s + (p.price || 0), 0) || 0), 0);
      setStats({
        products: countRes.data?.total || 0,
        orders: orders.length,
        categories: catRes.data?.category?.length || 0,
        revenue,
      });
    }).catch(() => {});
  }, []);

  return (
    <PageTransition>
      <div className="page-content app-container">
        <DashboardLayout menuItems={adminMenuItems} title="Admin Dashboard">
          <div className="row g-4 mb-4">
            <div className="col-sm-6 col-lg-3"><StatCard icon={FiPackage} label="Products" value={stats.products} color="primary" /></div>
            <div className="col-sm-6 col-lg-3"><StatCard icon={FiTrendingUp} label="Orders" value={stats.orders} color="secondary" /></div>
            <div className="col-sm-6 col-lg-3"><StatCard icon={FiUsers} label="Categories" value={stats.categories} color="accent" /></div>
            <div className="col-sm-6 col-lg-3"><StatCard icon={FiDollarSign} label="Revenue" value={formatPrice(stats.revenue)} color="success" trend="All time" /></div>
          </div>
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
            <h5>Revenue Overview</h5>
            <div className="d-flex align-items-end gap-2 mt-4" style={{ height: 120 }}>
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)', borderRadius: 6, opacity: 0.7 + i * 0.04 }} />
              ))}
            </div>
            <p className="text-muted small mt-3 mb-0">Weekly revenue chart (illustrative)</p>
          </div>
        </DashboardLayout>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
