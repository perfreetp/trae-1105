import { useParams, useNavigate } from 'react-router-dom';
import { customers } from '../data/mockData';
import { useState } from 'react';

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const customer = customers.find(c => c.id === id);
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [note, setNote] = useState('');

  if (!customer) {
    return <div className="page-container">顾客不存在</div>;
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case '金卡会员': return 'warning';
      case '银卡会员': return 'primary';
      default: return 'default';
    }
  };

  const handleAction = (action: string) => {
    setShowActionSheet(false);
    switch (action) {
      case 'call':
        alert(`拨打电话: ${customer.phone}`);
        break;
      case 'message':
        alert('发送消息');
        break;
      case 'care':
        alert('已发送会员关怀短信');
        break;
      case 'appointment':
        alert('已创建预约提醒');
        break;
      case 'deal':
        alert('已登记成交记录');
        break;
      case 'transfer':
        alert('已提交调货申请');
        break;
      case 'note':
        setShowNotePopup(true);
        break;
    }
  };

  const actions = [
    { name: '拨打电话', icon: '📞', action: 'call' },
    { name: '发送消息', icon: '💬', action: 'message' },
    { name: '发送关怀', icon: '❤️', action: 'care' },
    { name: '预约到店', icon: '📅', action: 'appointment' },
    { name: '登记成交', icon: '💰', action: 'deal' },
    { name: '申请调货', icon: '📦', action: 'transfer' },
    { name: '记录偏好', icon: '📝', action: 'note' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="navbar">
          <span className="navbar-back" onClick={() => navigate(-1)}>‹</span>
          <span className="navbar-title">会员详情</span>
        </div>
      </div>

      <div style={{ padding: '16px', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={customer.avatar}
            alt=""
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '18px', fontWeight: 600 }}>{customer.name}</span>
              <span className={`tag tag-${getLevelColor(customer.level)}`}>{customer.level}</span>
            </div>
            <div style={{ color: '#646566', fontSize: '14px' }}>{customer.phone}</div>
          </div>
        </div>
      </div>

      <div className="card-section">
        <div className="section-header">
          <span className="section-title">账户信息</span>
        </div>
        <div style={{ display: 'flex', padding: '0 16px 16px' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 600, color: '#1989fa' }}>{customer.points}</div>
            <div style={{ fontSize: '12px', color: '#969799' }}>积分</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 600, color: '#ee0a24' }}>{customer.coupons.length}</div>
            <div style={{ fontSize: '12px', color: '#969799' }}>优惠券</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 600, color: '#07c160' }}>¥{customer.totalSpent}</div>
            <div style={{ fontSize: '12px', color: '#969799' }}>累计消费</div>
          </div>
        </div>
      </div>

      <div className="card-section">
        <div className="section-header">
          <span className="section-title">尺码记录</span>
        </div>
        <div className="cell">
          <div className="cell-content">
            <div className="cell-title">上衣</div>
            <div className="cell-label">{customer.sizes.top}</div>
          </div>
        </div>
        <div className="cell">
          <div className="cell-content">
            <div className="cell-title">下装</div>
            <div className="cell-label">{customer.sizes.bottom}</div>
          </div>
        </div>
        <div className="cell">
          <div className="cell-content">
            <div className="cell-title">鞋码</div>
            <div className="cell-label">{customer.sizes.shoes}</div>
          </div>
        </div>
      </div>

      <div className="card-section">
        <div className="section-header">
          <span className="section-title">风格偏好</span>
        </div>
        <div style={{ padding: '0 16px 16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {customer.preferences.map((pref, index) => (
            <span key={index} className="tag tag-primary tag-plain">{pref}</span>
          ))}
        </div>
      </div>

      <div className="card-section">
        <div className="section-header">
          <span className="section-title">可用优惠券</span>
        </div>
        {customer.coupons.map((coupon) => (
          <div key={coupon.id} className="cell">
            <div className="cell-content">
              <div className="cell-title">{coupon.name}</div>
              <div className="cell-label">{coupon.expireDate}到期</div>
            </div>
            <span className="cell-value" style={{ color: '#ee0a24', fontWeight: 600 }}>
              {coupon.discount}
            </span>
          </div>
        ))}
        {customer.coupons.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#969799', fontSize: '14px' }}>
            暂无可用优惠券
          </div>
        )}
      </div>

      <div className="card-section">
        <div className="section-header">
          <span className="section-title">消费记录</span>
        </div>
        {customer.visitHistory.map((record, index) => (
          <div key={index} className="cell">
            <div className="cell-content">
              <div className="cell-title">{record.items.join('、')}</div>
              <div className="cell-label">{record.date}</div>
            </div>
            <span className="cell-value" style={{ color: '#ee0a24' }}>¥{record.amount}</span>
          </div>
        ))}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', padding: '12px 16px', borderTop: '1px solid #ebedf0', zIndex: 50 }}>
        <button className="btn btn-primary btn-block" onClick={() => setShowActionSheet(true)}>
          快捷操作
        </button>
      </div>

      {showActionSheet && (
        <div className="popup-mask" onClick={() => setShowActionSheet(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '16px', textAlign: 'center', fontWeight: 600, borderBottom: '1px solid #ebedf0' }}>
              选择操作
            </div>
            {actions.map((item, index) => (
              <div
                key={index}
                className="cell"
                onClick={() => handleAction(item.action)}
              >
                <span className="cell-icon">{item.icon}</span>
                <div className="cell-content">
                  <div className="cell-title">{item.name}</div>
                </div>
              </div>
            ))}
            <div
              className="cell"
              onClick={() => setShowActionSheet(false)}
              style={{ background: '#f7f8fa' }}
            >
              <div className="cell-content" style={{ textAlign: 'center' }}>
                <div className="cell-title" style={{ color: '#646566' }}>取消</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNotePopup && (
        <div className="popup-mask" onClick={() => setShowNotePopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>记录顾客偏好</div>
              <textarea
                className="input-field textarea"
                placeholder="请输入顾客的偏好、需求或其他备注信息"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <div style={{ marginTop: '16px' }}>
                <input type="text" className="input-field" placeholder="偏好标签（多个用逗号分隔）" />
              </div>
              <button
                className="btn btn-primary btn-block"
                style={{ marginTop: '16px' }}
                onClick={() => {
                  alert('偏好记录已保存');
                  setShowNotePopup(false);
                }}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
