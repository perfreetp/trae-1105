import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/mockData';
import { useState } from 'react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [showStoreInventory, setShowStoreInventory] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);

  if (!product) {
    return <div className="page-container">商品不存在</div>;
  }

  const handleAddToFitting = () => {
    alert('已加入试衣清单');
  };

  const handleAction = (action: string) => {
    setShowActionSheet(false);
    switch (action) {
      case 'transfer':
        alert('已提交调货申请');
        break;
      case 'share':
        alert('分享功能');
        break;
    }
  };

  const actions = [
    { name: '申请调货', icon: '📦', action: 'transfer' },
    { name: '分享商品', icon: '📤', action: 'share' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="navbar">
          <span className="navbar-back" onClick={() => navigate(-1)}>‹</span>
          <span className="navbar-title">商品详情</span>
        </div>
      </div>

      <div>
        <img 
          src={product.image} 
          alt="" 
          style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', background: '#f7f8fa' }} 
        />
      </div>

      <div style={{ padding: '16px', background: '#fff' }}>
        <div style={{ fontSize: '20px', fontWeight: 600, color: '#ee0a24', marginBottom: '8px' }}>
          ¥{product.price}
        </div>
        <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>
          {product.name}
        </div>
        <div style={{ fontSize: '13px', color: '#969799' }}>
          货号: {product.code}
        </div>
        <div style={{ marginTop: '8px' }}>
          <span className="tag tag-primary tag-plain">{product.style}</span>
        </div>
      </div>

      <div className="card-section">
        <div className="section-header">
          <span className="section-title">颜色</span>
        </div>
        <div style={{ padding: '0 16px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {product.colors.map(color => (
            <span
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`tag ${selectedColor === color ? 'tag-primary' : 'tag-default'}`}
              style={{ cursor: 'pointer' }}
            >
              {color}
            </span>
          ))}
        </div>
      </div>

      <div className="card-section">
        <div className="section-header">
          <span className="section-title">尺码库存</span>
        </div>
        <div style={{ padding: '0 16px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {product.sizes.map(size => (
            <span
              key={size.size}
              onClick={() => setSelectedSize(size.size)}
              className={`tag ${selectedSize === size.size ? 'tag-primary' : 'tag-default'}`}
              style={{ cursor: 'pointer' }}
            >
              {size.size} ({size.stock}件)
            </span>
          ))}
        </div>
      </div>

      <div className="card-section">
        <div 
          className="cell" 
          onClick={() => setShowStoreInventory(true)}
        >
          <div className="cell-content">
            <div className="cell-title">门店库存查询</div>
            <div className="cell-label">查看其他门店同款余量</div>
          </div>
          <span className="cell-value">›</span>
        </div>
      </div>

      <div className="card-section">
        <div className="section-header">
          <span className="section-title">关联单品推荐</span>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          padding: '0 12px 12px', 
          overflowX: 'auto'
        }}>
          {product.relatedProducts?.map(productId => {
            const rel = products.find(p => p.id === productId);
            if (!rel) return null;
            return (
              <div
                key={rel.id}
                onClick={() => navigate(`/product/${rel.id}`)}
                style={{ 
                  flexShrink: 0, 
                  width: '100px', 
                  cursor: 'pointer' 
                }}
              >
                <img 
                  src={rel.image} 
                  alt="" 
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    borderRadius: '4px', 
                    objectFit: 'cover',
                    background: '#f7f8fa'
                  }} 
                />
                <div style={{ fontSize: '12px', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {rel.name}
                </div>
                <div style={{ fontSize: '12px', color: '#ee0a24', fontWeight: 500 }}>
                  ¥{rel.price}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        background: '#fff', 
        padding: '12px 16px', 
        borderTop: '1px solid #ebedf0', 
        display: 'flex',
        gap: '12px',
        zIndex: 50
      }}>
        <button 
          className="btn btn-default" 
          style={{ flex: 1 }}
          onClick={() => setShowActionSheet(true)}
        >
          更多操作
        </button>
        <button 
          className="btn btn-primary" 
          style={{ flex: 1 }}
          onClick={handleAddToFitting}
        >
          加入试衣清单
        </button>
      </div>

      {showStoreInventory && (
        <div className="popup-mask" onClick={() => setShowStoreInventory(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>门店库存</div>
              {product.storeStock?.map((store, index) => (
                <div key={index} className="cell">
                  <div className="cell-content">
                    <div className="cell-title">{store.store}</div>
                  </div>
                  <span className="cell-value" style={{ color: store.stock > 5 ? '#07c160' : '#ff976a' }}>
                    {store.stock}件
                  </span>
                </div>
              ))}
              <button
                className="btn btn-primary btn-block"
                style={{ marginTop: '16px' }}
                onClick={() => {
                  alert('已提交调货申请');
                  setShowStoreInventory(false);
                }}
              >
                申请调货
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
