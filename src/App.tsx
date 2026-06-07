import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Tasks from './pages/Tasks';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Outfits from './pages/Outfits';
import Fitting from './pages/Fitting';
import FollowUp from './pages/FollowUp';
import Performance from './pages/Performance';
import CustomerDetail from './pages/CustomerDetail';
import ProductDetail from './pages/ProductDetail';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const hideTabbar = ['/customer', '/product'].some(path => 
    location.pathname.startsWith(path)
  );

  const menuItems = [
    { path: '/', name: '今日任务', icon: '📋' },
    { path: '/customers', name: '顾客档案', icon: '👥' },
    { path: '/products', name: '商品查询', icon: '🔍' },
    { path: '/outfits', name: '搭配推荐', icon: '👗' },
    { path: '/fitting', name: '试衣记录', icon: '🛍️' },
    { path: '/followup', name: '会员跟进', icon: '💬' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Routes>
          <Route path="/" element={<Tasks />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customer/:id" element={<CustomerDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/outfits" element={<Outfits />} />
          <Route path="/fitting" element={<Fitting />} />
          <Route path="/followup" element={<FollowUp />} />
          <Route path="/performance" element={<Performance />} />
        </Routes>
      </div>
      {!hideTabbar && (
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          background: '#fff', 
          borderTop: '1px solid #ebedf0',
          display: 'flex',
          paddingBottom: 'env(safe-area-inset-bottom)',
          zIndex: 100
        }}>
          {menuItems.map(item => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 0',
                cursor: 'pointer',
                color: location.pathname === item.path ? '#1989fa' : '#646566',
                fontSize: '10px'
              }}
            >
              <span style={{ fontSize: '20px', marginBottom: '2px' }}>{item.icon}</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
