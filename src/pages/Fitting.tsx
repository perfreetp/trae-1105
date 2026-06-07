import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Fitting() {
  const navigate = useNavigate();
  const { fittingRecords, updateFittingRecord, addFollowUpRecord, updateCustomer } = useApp();
  const [activeTab, setActiveTab] = useState(0);
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<'purchased' | 'abandoned'>('purchased');
  const [reason, setReason] = useState('');

  const tabs = ['全部', '试衣中', '已购买', '未购买'];
  const statusMap: Record<string, 'all' | 'trying' | 'purchased' | 'abandoned'> = {
    '0': 'all',
    '1': 'trying',
    '2': 'purchased',
    '3': 'abandoned'
  };

  const filteredRecords = fittingRecords.filter(record => {
    const status = statusMap[activeTab];
    if (status === 'all') return true;
    return record.status === status;
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case 'trying': return '试衣中';
      case 'purchased': return '已购买';
      case 'abandoned': return '未购买';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'trying': return '#1989fa';
      case 'purchased': return '#07c160';
      case 'abandoned': return '#969799';
      default: return '#323233';
    }
  };

  const handleStatusUpdate = (recordId: string, status: 'purchased' | 'abandoned') => {
    setSelectedRecord(recordId);
    setNewStatus(status);
    setReason('');
    setShowStatusPopup(true);
  };

  const confirmStatusUpdate = () => {
    if (!selectedRecord) return;
    
    updateFittingRecord(selectedRecord, {
      status: newStatus,
      note: reason
    });

    const record = fittingRecords.find(r => r.id === selectedRecord);
    if (record && newStatus === 'purchased') {
      addFollowUpRecord({
        customerId: record.customerId,
        customerName: record.customerName,
        type: 'aftersale',
        content: `购买了${record.products.map(p => p.productName).join('、')}，3天后回访`,
        date: new Date().toLocaleDateString('zh-CN'),
        status: 'pending'
      });

      updateCustomer(record.customerId, {
        lastVisit: new Date().toLocaleDateString('zh-CN')
      });
    }

    setShowStatusPopup(false);
    alert(`已登记为${newStatus === 'purchased' ? '已购买' : '未购买'}`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="navbar">
          <span className="navbar-title">试衣记录</span>
          <span 
            style={{ position: 'absolute', right: '16px', fontSize: '14px', color: '#1989fa', cursor: 'pointer' }}
            onClick={() => navigate('/products')}
          >
            新建试衣
          </span>
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
        {filteredRecords.length === 0 ? (
          <div style={{ padding: '48px 16px', textAlign: 'center', color: '#969799' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>👗</div>
            <div>暂无试衣记录</div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>去商品详情页添加试衣清单吧</div>
          </div>
        ) : (
          filteredRecords.map(record => (
            <div key={record.id} className="card-section" style={{ margin: '0 0 12px 0' }}>
              <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ebedf0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 500 }}>{record.customerName}</span>
                  <span 
                    style={{ 
                      fontSize: '12px', 
                      color: getStatusColor(record.status),
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: record.status === 'trying' ? '#e8f3ff' : record.status === 'purchased' ? '#e8f9f1' : '#f7f8fa'
                    }}
                  >
                    {getStatusText(record.status)}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#969799' }}>{record.createdAt}</span>
              </div>
              
              {record.products.map((p, index) => (
                <div key={index} className="cell">
                  <div className="cell-content">
                    <div className="cell-title">{p.productName}</div>
                    <div className="cell-label">{p.color} / {p.size}</div>
                  </div>
                </div>
              ))}

              {record.note && (
                <div style={{ padding: '8px 16px', fontSize: '12px', color: '#969799', borderTop: '1px solid #f7f8fa' }}>
                  备注：{record.note}
                </div>
              )}

              {record.status === 'trying' && (
                <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', borderTop: '1px solid #ebedf0' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1 }}
                    onClick={() => handleStatusUpdate(record.id, 'purchased')}
                  >
                    登记成交
                  </button>
                  <button 
                    className="btn btn-default" 
                    style={{ flex: 1 }}
                    onClick={() => handleStatusUpdate(record.id, 'abandoned')}
                  >
                    登记未购买
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showStatusPopup && (
        <div className="popup-mask" onClick={() => setShowStatusPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
                {newStatus === 'purchased' ? '登记成交' : '登记未购买'}
              </div>
              
              {newStatus === 'abandoned' && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>流失原因</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    {['价格偏高', '尺码不合适', '款式不满意', '需要考虑', '其他'].map(r => (
                      <span
                        key={r}
                        onClick={() => setReason(r)}
                        className={`tag ${reason === r ? 'tag-primary' : 'tag-default'}`}
                        style={{ cursor: 'pointer' }}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {newStatus === 'purchased' && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>成交备注</div>
                  <textarea
                    className="input-field textarea"
                    placeholder="请输入成交备注（选填）"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-default" 
                  style={{ flex: 1 }}
                  onClick={() => setShowStatusPopup(false)}
                >
                  取消
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                  onClick={confirmStatusUpdate}
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
