import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function FollowUp() {
  const { followUpRecords, updateFollowUpRecord } = useApp();
  const [activeTab, setActiveTab] = useState(0);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [note, setNote] = useState('');

  const tabs = ['待跟进', '今日', '已完成'];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'birthday': return '🎁';
      case 'aftersale': return '❤️';
      case 'appointment': return '📅';
      case 'inactive': return '🔔';
      default: return '❤️';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'birthday': return '生日关怀';
      case 'aftersale': return '售后回访';
      case 'appointment': return '预约提醒';
      case 'inactive': return '沉睡唤醒';
      default: return '会员关怀';
    }
  };

  const filteredList = followUpRecords.filter(item => {
    if (activeTab === 0) return item.status !== 'completed';
    if (activeTab === 1) return item.status === 'today';
    if (activeTab === 2) return item.status === 'completed';
    return true;
  });

  const handleComplete = (id: string) => {
    setSelectedId(id);
    setShowResultPopup(true);
  };

  const quickActions = [
    { icon: '🎁', label: '生日祝福', bg: '#fff0f5', color: '#f26da9', action: () => alert('已为所有今日生日会员发送祝福短信') },
    { icon: '📅', label: '预约提醒', bg: '#e8f3ff', color: '#1989fa', action: () => alert('已为今日预约会员发送提醒') },
    { icon: '❤️', label: '批量关怀', bg: '#f0f9ff', color: '#07c160', action: () => alert('已选择10位高价值会员发送关怀信息') },
    { icon: '🔔', label: '接待小结', bg: '#fff7e8', color: '#ff976a', action: () => alert('今日接待小结已生成') },
  ];

  const resultOptions = [
    { value: 'success', label: '成功联系，意向明确' },
    { value: 'partial', label: '成功联系，暂无意向' },
    { value: 'failed', label: '未联系上' },
    { value: 'reject', label: '明确拒绝' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="navbar">
          <span className="navbar-title">会员跟进</span>
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

      <div className="notice-bar">
        <span>🔔</span>
        <span>今日有2位会员需要跟进，请注意及时联系</span>
      </div>

      <div className="card-section">
        <div className="section-header" style={{ paddingBottom: 0 }}>
          <span className="section-title">快捷操作</span>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '8px',
          padding: '12px'
        }}>
          {quickActions.map((action, index) => (
            <div
              key={index}
              onClick={action.action}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 4px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: action.bg,
                marginBottom: '8px',
                fontSize: '22px'
              }}>
                {action.icon}
              </div>
              <div style={{ fontSize: '12px', color: '#323233' }}>{action.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 12px' }}>
        <div className="card-section" style={{ margin: 0 }}>
          <div className="section-header">
            <span className="section-title">跟进列表</span>
          </div>
          {filteredList.map(item => (
            <div key={item.id} className="cell">
              <span className="cell-icon">{getTypeIcon(item.type)}</span>
              <div className="cell-content">
                <div className="cell-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.customerName}
                  <span className="tag tag-default" style={{ fontSize: '11px' }}>{getTypeText(item.type)}</span>
                </div>
                <div className="cell-label">
                  <div style={{ fontSize: '12px', color: '#646566' }}>{item.content}</div>
                  <div style={{ fontSize: '11px', color: '#969799', marginTop: '2px' }}>{item.date}</div>
                </div>
              </div>
              <div className="cell-value">
                {item.status === 'completed' ? (
                  <span className="tag tag-success">已完成</span>
                ) : (
                  <button
                    className="btn btn-primary btn-mini"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComplete(item.id);
                    }}
                  >
                    填写回访
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showResultPopup && (
        <div className="popup-mask" onClick={() => setShowResultPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()} style={{ height: '70%' }}>
            <div style={{ padding: '16px', height: '100%', overflowY: 'auto' }}>
              <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>填写回访结果</div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>联系方式</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-primary btn-small">电话</button>
                  <button className="btn btn-default btn-small">微信</button>
                  <button className="btn btn-default btn-small">到店</button>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>回访结果</div>
                <div className="radio-group">
                  {resultOptions.map(opt => (
                    <div
                      key={opt.value}
                      className={`radio-item ${result === opt.value ? 'checked' : ''}`}
                      onClick={() => setResult(opt.value)}
                    >
                      <span className="radio-circle"></span>
                      <span>{opt.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>备注信息</div>
                <textarea
                  className="input-field textarea"
                  placeholder="请输入回访备注"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary btn-block"
                onClick={() => {
                  if (selectedId) {
                    updateFollowUpRecord(selectedId, {
                      status: 'completed',
                      result,
                      note
                    });
                  }
                  setShowResultPopup(false);
                  alert('回访结果已记录');
                }}
              >
                提交回访结果
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
