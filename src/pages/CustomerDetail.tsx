import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    customers, 
    addCustomerPreference, 
    addFollowUpRecord, 
    addTransferRecord, 
    transferRecords,
    activityRecords,
    outfitRecommendations,
    addActivityRecord,
    products
  } = useApp();
  const customer = customers.find(c => c.id === id);
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showAppointmentPopup, setShowAppointmentPopup] = useState(false);
  const [showTransferPopup, setShowTransferPopup] = useState(false);
  const [note, setNote] = useState('');
  const [preferenceText, setPreferenceText] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [transferColor, setTransferColor] = useState('');
  const [transferSize, setTransferSize] = useState('');
  const [transferFromStore, setTransferFromStore] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');

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

  const customerActivities = activityRecords.filter(a => a.customerId === id);
  const customerTransfers = transferRecords.filter(t => t.customerId === id);
  const customerOutfitRecs = outfitRecommendations.filter(o => o.customerId === id);

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      'fitting_added': '👕',
      'fitting_purchased': '💰',
      'fitting_abandoned': '❌',
      'outfit_recommended': '👗',
      'care_sent': '❤️',
      'appointment_created': '📅',
      'transfer_requested': '📦',
      'preference_updated': '📝',
      'note_added': '📋'
    };
    return icons[type] || '📌';
  };

  const getActivityColor = (type: string) => {
    const colors: Record<string, string> = {
      'fitting_added': '#1989fa',
      'fitting_purchased': '#07c160',
      'fitting_abandoned': '#ee0a24',
      'outfit_recommended': '#ff976a',
      'care_sent': '#ff6034',
      'appointment_created': '#7232dd',
      'transfer_requested': '#00b578',
      'preference_updated': '#969799',
      'note_added': '#646566'
    };
    return colors[type] || '#969799';
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
        addFollowUpRecord({
          customerId: customer.id,
          customerName: customer.name,
          type: 'care',
          content: '会员关怀问候',
          date: new Date().toLocaleDateString('zh-CN'),
          status: 'today'
        });
        addActivityRecord({
          customerId: customer.id,
          customerName: customer.name,
          type: 'care_sent',
          title: '发送会员关怀',
          content: '会员关怀问候已发送',
          time: new Date().toLocaleString('zh-CN')
        });
        alert('已发送会员关怀，可在会员跟进中查看');
        break;
      case 'appointment':
        setShowAppointmentPopup(true);
        break;
      case 'deal':
        alert('已登记成交记录');
        break;
      case 'transfer':
        setShowTransferPopup(true);
        break;
      case 'note':
        setShowNotePopup(true);
        break;
    }
  };

  const handleSavePreference = () => {
    if (preferenceText.trim()) {
      addCustomerPreference(customer.id, preferenceText.trim());
      setPreferenceText('');
      alert('偏好标签已添加');
    }
    setShowNotePopup(false);
  };

  const handleSaveAppointment = () => {
    if (!appointmentDate || !appointmentTime) {
      alert('请选择日期和时间');
      return;
    }
    addFollowUpRecord({
      customerId: customer.id,
      customerName: customer.name,
      type: 'appointment',
      content: `预约到店: ${appointmentDate} ${appointmentTime}`,
      date: `${appointmentDate} ${appointmentTime}`,
      status: 'today'
    });
    addActivityRecord({
      customerId: customer.id,
      customerName: customer.name,
      type: 'appointment_created',
      title: '预约到店',
      content: `预约时间: ${appointmentDate} ${appointmentTime}`,
      time: new Date().toLocaleString('zh-CN')
    });
    setShowAppointmentPopup(false);
    setAppointmentDate('');
    setAppointmentTime('');
    alert('预约已创建，可在会员跟进中查看');
  };

  const handleSaveTransfer = () => {
    if (!selectedProduct || !transferColor || !transferSize || !transferFromStore) {
      alert('请填写完整调货信息');
      return;
    }
    const product = products.find(p => p.id === selectedProduct);
    if (product) {
      addTransferRecord({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        customerId: customer.id,
        customerName: customer.name,
        size: transferSize,
        color: transferColor,
        fromStore: transferFromStore,
        toStore: '本店',
        status: 'pending',
        createTime: new Date().toLocaleString('zh-CN')
      });
      setShowTransferPopup(false);
      setSelectedProduct('');
      setTransferColor('');
      setTransferSize('');
      setTransferFromStore('');
      alert('调货申请已提交');
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
    <div className="page-container" style={{ paddingBottom: '80px' }}>
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
            <div style={{ color: '#969799', fontSize: '12px', marginTop: '2px' }}>
              最后到店：{customer.lastVisit}
            </div>
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
            <div className="cell-label">{customer.sizes.top || '未记录'}</div>
          </div>
        </div>
        <div className="cell">
          <div className="cell-content">
            <div className="cell-title">下装</div>
            <div className="cell-label">{customer.sizes.bottom || '未记录'}</div>
          </div>
        </div>
        <div className="cell">
          <div className="cell-content">
            <div className="cell-title">鞋码</div>
            <div className="cell-label">{customer.sizes.shoes || '未记录'}</div>
          </div>
        </div>
      </div>

      <div className="card-section">
        <div className="section-header">
          <span className="section-title">风格偏好</span>
          <span 
            style={{ fontSize: '13px', color: '#1989fa', cursor: 'pointer' }}
            onClick={() => setShowNotePopup(true)}
          >
            + 添加
          </span>
        </div>
        <div style={{ padding: '0 16px 16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {customer.preferences.map((pref, index) => (
            <span key={index} className="tag tag-primary tag-plain">{pref}</span>
          ))}
          {customer.preferences.length === 0 && (
            <span style={{ fontSize: '13px', color: '#969799' }}>暂无偏好记录</span>
          )}
        </div>
      </div>

      {customerOutfitRecs.length > 0 && (
        <div className="card-section">
          <div className="section-header">
            <span className="section-title">搭配推荐</span>
          </div>
          {customerOutfitRecs.map(rec => (
            <div key={rec.id} className="cell">
              <img 
                src={rec.outfitImage} 
                alt="" 
                style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }}
              />
              <div className="cell-content">
                <div className="cell-title">{rec.outfitName}</div>
                <div className="cell-label">{rec.recommendTime} · {rec.outfitProducts.length}件单品</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#ee0a24', fontWeight: 600 }}>¥{rec.totalPrice}</div>
                <div style={{ fontSize: '12px', color: rec.feedback ? '#07c160' : '#969799' }}>
                  {rec.feedback ? (
                    rec.feedback === 'like' ? '喜欢' :
                    rec.feedback === 'considering' ? '待考虑' :
                    rec.feedback === 'tried' ? '已试穿' : '不喜欢'
                  ) : '待反馈'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {customerTransfers.length > 0 && (
        <div className="card-section">
          <div className="section-header">
            <span className="section-title">调货记录</span>
          </div>
          {customerTransfers.map(record => (
            <div key={record.id} className="cell">
              <img 
                src={record.productImage} 
                alt="" 
                style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }}
              />
              <div className="cell-content">
                <div className="cell-title">{record.productName}</div>
                <div className="cell-label">{record.color} {record.size} · {record.createTime}</div>
              </div>
              <span 
                className="cell-value"
                style={{ 
                  color: record.status === 'completed' ? '#07c160' : record.status === 'processing' ? '#ff976a' : '#1989fa',
                  fontSize: '12px'
                }}
              >
                {record.status === 'pending' ? '待处理' : record.status === 'processing' ? '调货中' : '已到货'}
              </span>
            </div>
          ))}
        </div>
      )}

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

      <div className="card-section">
        <div className="section-header">
          <span className="section-title">接待时间线</span>
        </div>
        <div style={{ padding: '16px' }}>
          {customerActivities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#969799', fontSize: '14px' }}>
              暂无接待记录
            </div>
          ) : (
            <div style={{ position: 'relative', paddingLeft: '24px' }}>
              <div style={{ 
                position: 'absolute', 
                left: '7px', 
                top: '8px', 
                bottom: '8px', 
                width: '2px', 
                background: '#ebedf0' 
              }} />
              {customerActivities.map((activity) => (
                <div key={activity.id} style={{ position: 'relative', marginBottom: '16px' }}>
                  <div style={{ 
                    position: 'absolute', 
                    left: '-24px', 
                    top: '2px', 
                    width: '16px', 
                    height: '16px', 
                    borderRadius: '50%', 
                    background: getActivityColor(activity.type),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px'
                  }}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div style={{ background: '#f7f8fa', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 500, fontSize: '14px' }}>{activity.title}</span>
                      <span style={{ fontSize: '12px', color: '#969799' }}>{activity.time}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#646566' }}>{activity.content}</div>
                    {activity.amount && (
                      <div style={{ marginTop: '4px', fontSize: '13px', color: '#ee0a24', fontWeight: 500 }}>
                        ¥{activity.amount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="偏好标签（如：简约通勤、喜欢蓝色）" 
                  value={preferenceText}
                  onChange={(e) => setPreferenceText(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button 
                  className="btn btn-default"
                  style={{ flex: 1 }}
                  onClick={() => setShowNotePopup(false)}
                >
                  取消
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleSavePreference}
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAppointmentPopup && (
        <div className="popup-mask" onClick={() => setShowAppointmentPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>预约到店</div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', marginBottom: '6px' }}>预约日期</div>
                <input
                  type="date"
                  className="input-field"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', marginBottom: '6px' }}>预约时间</div>
                <input
                  type="time"
                  className="input-field"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-default"
                  style={{ flex: 1 }}
                  onClick={() => setShowAppointmentPopup(false)}
                >
                  取消
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleSaveAppointment}
                >
                  确认预约
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTransferPopup && (
        <div className="popup-mask" onClick={() => setShowTransferPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>申请调货</div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', marginBottom: '6px' }}>选择商品</div>
                <select
                  className="input-field"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="">请选择商品</option>
                  {products.slice(0, 6).map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              {selectedProduct && (
                <>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '14px', marginBottom: '6px' }}>颜色</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {products.find(p => p.id === selectedProduct)?.colors.map(c => (
                        <button
                          key={c}
                          className={`tag ${transferColor === c ? 'tag-primary' : 'tag-default'}`}
                          onClick={() => setTransferColor(c)}
                          style={{ cursor: 'pointer' }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '14px', marginBottom: '6px' }}>尺码</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {products.find(p => p.id === selectedProduct)?.sizes.map(s => (
                        <button
                          key={s.size}
                          className={`tag ${transferSize === s.size ? 'tag-primary' : 'tag-default'}`}
                          onClick={() => setTransferSize(s.size)}
                          style={{ cursor: 'pointer' }}
                        >
                          {s.size} ({s.stock > 0 ? `库存${s.stock}` : '缺货'})
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', marginBottom: '6px' }}>来源门店</div>
                <select
                  className="input-field"
                  value={transferFromStore}
                  onChange={(e) => setTransferFromStore(e.target.value)}
                >
                  <option value="">请选择门店</option>
                  <option value="中心店">中心店</option>
                  <option value="万达店">万达店</option>
                  <option value="银泰店">银泰店</option>
                  <option value="万象城店">万象城店</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-default"
                  style={{ flex: 1 }}
                  onClick={() => setShowTransferPopup(false)}
                >
                  取消
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleSaveTransfer}
                >
                  提交申请
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
