import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customers } from '../data/mockData';

export default function Customers() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getLevelColor = (level: string) => {
    switch (level) {
      case '金卡会员': return 'warning';
      case '银卡会员': return 'primary';
      default: return 'default';
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.includes(searchText) || c.phone.includes(searchText)
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="navbar">
          <span className="navbar-title">顾客档案</span>
        </div>
        <div className="search-box">
          <span>🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="搜索姓名/手机号"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {isRefreshing && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#969799' }}>
          刷新中...
        </div>
      )}

      <div style={{ padding: '12px' }}>
        <div className="card-section" style={{ margin: 0 }}>
          {filteredCustomers.map(customer => (
            <div
              key={customer.id}
              className="cell"
              onClick={() => navigate(`/customer/${customer.id}`)}
            >
              <img
                src={customer.avatar}
                alt=""
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginRight: '12px'
                }}
              />
              <div className="cell-content">
                <div className="cell-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 500 }}>{customer.name}</span>
                  <span className={`tag tag-${getLevelColor(customer.level)} tag-plain`}>
                    {customer.level}
                  </span>
                </div>
                <div className="cell-label">
                  <div style={{ marginBottom: '2px' }}>{customer.phone}</div>
                  <div>
                    <span style={{ marginRight: '12px' }}>积分: {customer.points}</span>
                    <span>消费: ¥{customer.totalSpent}</span>
                  </div>
                </div>
              </div>
              <span className="cell-value">›</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 12px 12px', textAlign: 'center' }}>
        <button 
          className="btn btn-default btn-small"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? '刷新中...' : '🔄 下拉刷新'}
        </button>
      </div>
    </div>
  );
}
