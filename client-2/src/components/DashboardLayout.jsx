import { NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { toggleSidebar, setSidebarOpen } from '@/store/uiSlice';
import './DashboardLayout.scss';

const DashboardLayout = ({ children, menuItems, title }) => {
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const dispatch = useAppDispatch();

  return (
    <div className="dashboard-layout">
      <button
        type="button"
        className="dashboard-layout__toggle"
        onClick={() => dispatch(toggleSidebar())}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <FiX /> : <FiMenu />}
      </button>

      {sidebarOpen && (
        <div
          className="dashboard-layout__overlay"
          onClick={() => dispatch(setSidebarOpen(false))}
          role="presentation"
        />
      )}

      <aside className={`dashboard-layout__sidebar ${sidebarOpen ? 'open' : ''}`}>
        <nav>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => dispatch(setSidebarOpen(false))}
            >
              {item.icon && <item.icon size={18} />}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="dashboard-layout__main">
        {title && <h1 className="dashboard-layout__title">{title}</h1>}
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
