import { useState } from 'react';
import { outfits, products } from '../data/mockData';

export default function Outfits() {
  const [outfitList, setOutfitList] = useState(outfits);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<typeof outfits[0] | null>(null);
  const [newOutfitName, setNewOutfitName] = useState('');
  const [newOutfitStyle, setNewOutfitStyle] = useState('');

  const handleAction = (action: string) => {
    setShowActionSheet(false);
    switch (action) {
      case 'edit':
        alert('编辑搭配');
        break;
      case 'delete':
        if (selectedOutfit && window.confirm('确定删除此搭配吗？')) {
          setOutfitList(prev => prev.filter(o => o.id !== selectedOutfit.id));
        }
        break;
      case 'share':
        alert('分享搭配');
        break;
    }
  };

  const actions = [
    { name: '编辑搭配', icon: '✏️', action: 'edit' },
    { name: '删除搭配', icon: '🗑️', action: 'delete' },
    { name: '分享搭配', icon: '📤', action: 'share' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="navbar">
          <span className="navbar-title">搭配推荐</span>
          <span 
            style={{ position: 'absolute', right: '16px', fontSize: '20px', cursor: 'pointer' }}
            onClick={() => setShowCreatePopup(true)}
          >
            ➕
          </span>
        </div>
      </div>

      <div style={{ padding: '12px' }}>
        {outfitList.map(outfit => (
          <div key={outfit.id} className="card-section" style={{ margin: '0 0 12px 0' }}>
            <div
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => {
                setSelectedOutfit(outfit);
                setShowActionSheet(true);
              }}
            >
              <img
                src={outfit.image}
                alt=""
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', background: '#f7f8fa' }}
              />
              <div style={{ 
                position: 'absolute', 
                top: '8px', 
                left: '8px', 
                display: 'flex', 
                gap: '4px' 
              }}>
                <span className="tag tag-primary tag-plain">{outfit.style}</span>
                <span className="tag tag-warning tag-plain">{outfit.occasion}</span>
              </div>
            </div>
            <div style={{ padding: '12px' }}>
              <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
                {outfit.name}
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', color: '#646566', marginBottom: '4px' }}>包含单品：</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {outfit.products.map((productId, i) => {
                    const product = products.find(p => p.id === productId);
                    return (
                      <span key={i} className="tag tag-default" style={{ fontSize: '11px' }}>
                        {product?.name || productId}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', color: '#969799' }}>
                  搭配师：{outfit.createdBy}
                </div>
                <div style={{ color: '#ee0a24', fontWeight: 600 }}>
                  ¥{outfit.products.reduce((total, productId) => {
                    const product = products.find(p => p.id === productId);
                    return total + (product?.price || 0);
                  }, 0)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreatePopup && (
        <div className="popup-mask" onClick={() => setShowCreatePopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()} style={{ height: '80%' }}>
            <div style={{ padding: '16px', height: '100%', overflowY: 'auto' }}>
              <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>创建新搭配</div>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>搭配照片</div>
                <div 
                  style={{ 
                    height: '150px', 
                    border: '2px dashed #c8c9cc', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f7f8fa',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ textAlign: 'center', color: '#969799' }}>
                    <span style={{ fontSize: '40px' }}>📷</span>
                    <div style={{ marginTop: '8px' }}>拍照/上传照片</div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>搭配名称</div>
                <input
                  type="text"
                  className="input-field"
                  placeholder="请输入搭配名称"
                  value={newOutfitName}
                  onChange={(e) => setNewOutfitName(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>风格标签</div>
                <input
                  type="text"
                  className="input-field"
                  placeholder="请输入风格标签"
                  value={newOutfitStyle}
                  onChange={(e) => setNewOutfitStyle(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>添加单品</div>
                <button className="btn btn-default btn-small">➕ 扫码/搜索添加</button>
              </div>

              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>已选单品</div>
                <div style={{ background: '#f7f8fa', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ color: '#969799', textAlign: 'center' }}>暂无单品</div>
                </div>
              </div>

              <button
                className="btn btn-primary btn-block"
                style={{ position: 'sticky', bottom: '0', marginTop: '20px' }}
                onClick={() => {
                  setShowCreatePopup(false);
                  alert('搭配创建成功');
                }}
              >
                保存搭配
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
