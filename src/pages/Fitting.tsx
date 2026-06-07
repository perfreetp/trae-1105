import { useState } from 'react';
import { fittingRecords, customers } from '../data/mockData';

export default function Fitting() {
  const [activeTab, setActiveTab] = useState(0);
  const [records, setRecords] = useState(fittingRecords);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<string | null>(null);

  const tabs = ['全部', '试衣中', '已购买', '未购买'];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'trying': return '试衣中';
      case 'purchased': return '已购买';
      case 'abandoned': return '未购买';
      default: return status;
    }
  };

  const getStatusType = (status: string) => {
    switch (status) {
      case 'trying': return 'warning';
      case 'purchased': return 'success';
      case 'abandoned': return 'danger';
      default: return 'default';
    }
  };

  const filteredRecords = records.filter(r => {
    if (activeTab === 0) return true;
    if (activeTab === 1) return r.status === 'trying';
    if (activeTab === 2) return r.status === 'purchased';
    if (activeTab === 3) return r.status === 'abandoned';
    return true;
  });

  const openStatusDialog = (recordId: string) => {
    setCurrentRecord(recordId);
    setShowStatusDialog(true);
  };

  const updateStatus = () => {
    if (currentRecord && status) {
      setRecords(prev => prev.map(r => 
        r.id === currentRecord ? { ...r, status: status as any, note } : r
      ));
      setShowStatusDialog(false);
      setStatus('');
      setNote('');
      alert('状态已更新');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="navbar">
          <span className="navbar-title">试衣记录</span>
        </div>
        <div className="tabs">
          {tabs.map((tab, index) => (
            <div
              key={tab}
              className={`tab-item ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px' }}>
        <button className="btn btn-primary btn-block" onClick={() => setShowCreate(true)}>
          ➕ 新建试衣清单
        </button>
      </div>

      <div style={{ padding: '0 12px' }}>
        <div className="card-section" style={{ margin: 0 }}>
          {filteredRecords.map(record => (
            <div
              key={record.id}
              className="cell"
              onClick={() => {
                if (record.status === 'trying') {
                  openStatusDialog(record.id);
                }
              }}
            >
              <span className="cell-icon">👤</span>
              <div className="cell-content">
                <div className="cell-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {record.customerName}
                  <span className={`tag tag-${getStatusType(record.status)}`} style={{ fontSize: '11px' }}>
                    {getStatusText(record.status)}
                  </span>
                </div>
                <div className="cell-label">
                  <div style={{ fontSize: '12px', color: '#646566' }}>
                    {record.products.map(p => `${p.productName}(${p.color} ${p.size})`).join('、')}
                  </div>
                  <div style={{ fontSize: '11px', color: '#969799', marginTop: '2px' }}>
                    {record.createdAt}
                  </div>
                  {record.note && (
                    <div style={{ fontSize: '11px', color: '#ff976a', marginTop: '2px' }}>
                      备注：{record.note}
                    </div>
                  )}
                </div>
              </div>
              {record.status === 'trying' && (
                <span className="cell-value">›</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {showCreate && (
        <div className="popup-mask" onClick={() => setShowCreate(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()} style={{ height: '80%' }}>
            <div style={{ padding: '16px', height: '100%', overflowY: 'auto' }}>
              <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>新建试衣清单</div>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>选择顾客</div>
                <div
                  className="input-field"
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  onClick={() => setShowCustomerPicker(true)}
                >
                  <span style={{ color: selectedCustomer ? '#323233' : '#969799' }}>
                    {selectedCustomer ? customers.find(c => c.id === selectedCustomer)?.name : '请选择顾客'}
                  </span>
                  <span>›</span>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>添加商品</div>
                <button className="btn btn-default btn-small">➕ 扫码/搜索添加</button>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>已选商品</div>
                <div style={{ background: '#f7f8fa', borderRadius: '8px', padding: '12px' }}>
                  <div className="cell" style={{ padding: '8px 0', background: 'transparent' }}>
                    <div className="cell-content">
                      <div className="cell-title">羊毛混纺双排扣大衣</div>
                      <div className="cell-label">驼色 M</div>
                    </div>
                    <span className="cell-value">¥3580</span>
                  </div>
                  <div className="cell" style={{ padding: '8px 0', background: 'transparent', borderBottom: 'none' }}>
                    <div className="cell-content">
                      <div className="cell-title">羊绒圆领针织衫</div>
                      <div className="cell-label">米白 M</div>
                    </div>
                    <span className="cell-value">¥1280</span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>备注</div>
                <textarea
                  className="input-field textarea"
                  placeholder="请输入备注信息"
                />
              </div>

              <button
                className="btn btn-primary btn-block"
                style={{ position: 'sticky', bottom: '0' }}
                onClick={() => {
                  setShowCreate(false);
                  alert('试衣清单已创建');
                }}
              >
                创建试衣清单
              </button>
            </div>
          </div>
        </div>
      )}

      {showCustomerPicker && (
        <div className="popup-mask" onClick={() => setShowCustomerPicker(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '16px', textAlign: 'center', fontWeight: 600, borderBottom: '1px solid #ebedf0' }}>
              选择顾客
            </div>
            {customers.map(customer => (
              <div
                key={customer.id}
                className="cell"
                onClick={() => {
                  setSelectedCustomer(customer.id);
                  setShowCustomerPicker(false);
                }}
              >
                <img
                  src={customer.avatar}
                  alt=""
                  style={{ width: '32px', height: '32px', borderRadius: '50%', marginRight: '12px' }}
                />
                <div className="cell-content">
                  <div className="cell-title">{customer.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showStatusDialog && (
        <div className="popup-mask center" onClick={() => setShowStatusDialog(false)}>
          <div className="popup-content center" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '20px' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', textAlign: 'center' }}>
                更新状态
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <div
                    className={`radio-item ${status === 'purchased' ? 'checked' : ''}`}
                    onClick={() => setStatus('purchased')}
                  >
                    <span className="radio-circle"></span>
                    <span>成交购买</span>
                  </div>
                </div>
                <div>
                  <div
                    className={`radio-item ${status === 'abandoned' ? 'checked' : ''}`}
                    onClick={() => setStatus('abandoned')}
                  >
                    <span className="radio-circle"></span>
                    <span>未购买</span>
                  </div>
                </div>
              </div>
              <textarea
                className="input-field textarea"
                placeholder="请输入成交/流失原因"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{ marginBottom: '16px' }}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn btn-default"
                  style={{ flex: 1 }}
                  onClick={() => setShowStatusDialog(false)}
                >
                  取消
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={updateStatus}
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
