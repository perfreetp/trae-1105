import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { products, customers, addFittingRecord, addTransferRecord } = useApp();
  const product = products.find(p => p.id === id);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [showStoreInventory, setShowStoreInventory] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showAddFitting, setShowAddFitting] = useState(false);
  const [showTransferPopup, setShowTransferPopup] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [transferCustomer, setTransferCustomer] = useState('');
  const [transferFromStore, setTransferFromStore] = useState('');
  const [fromScan, setFromScan] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('fromScan') === 'true') {
      setFromScan(true);
      setTimeout(() => setFromScan(false), 3000);
    }
  }, [location.search]);

  if (!product) {
    return <div className="page-container">商品不存在</div>;
  }

  const handleAddToFitting = () => {
    setShowAddFitting(true);
  };

  const confirmAddToFitting = () => {
    if (!selectedCustomer || !selectedColor || !selectedSize) {
      alert('请选择顾客、颜色和尺码');
      return;
    }
    const customer = customers.find(c => c.id === selectedCustomer);
    if (!customer) return;
    
    addFittingRecord({
      customerId: selectedCustomer,
      customerName: customer.name,
      products: [{
        productId: product.id,
        productName: product.name,
        size: selectedSize,
        color: selectedColor
      }],
      status: 'trying',
      createdAt: new Date().toLocaleString('zh-CN')
    });
    
    setShowAddFitting(false);
    setSelectedCustomer('');
    alert('已加入试衣清单，可在试衣记录中查看');
    setTimeout(() => navigate('/fitting'), 500);
  };

  const handleAction = (action: string) => {
    setShowActionSheet(false);
    switch (action) {
      case 'transfer':
        setShowTransferPopup(true);
        break;
      case 'share':
        alert('分享功能');
        break;
    }
  };

  const handleConfirmTransfer = () => {
    if (!transferCustomer || !selectedColor || !selectedSize || !transferFromStore) {
      alert('请填写完整调货信息');
      return;
    }
    const customer = customers.find(c => c.id === transferCustomer);
    if (customer) {
      addTransferRecord({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        customerId: customer.id,
        customerName: customer.name,
        size: selectedSize,
        color: selectedColor,
        fromStore: transferFromStore,
        toStore: '本店',
        status: 'pending',
        createTime: new Date().toLocaleString('zh-CN')
      });
      setShowTransferPopup(false);
      setTransferCustomer('');
      setTransferFromStore('');
      alert('调货申请已提交，可在会员详情中查看');
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

      {fromScan && (
        <div style={{ 
          background: 'linear-gradient(90deg, #1989fa, #07c160)', 
          color: '#fff', 
          padding: '12px 16px',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✓</span>
          <span>扫码成功，已加载尺码库存信息</span>
        </div>
      )}

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
              onClick={() => size.stock > 0 && setSelectedSize(size.size)}
              className={`tag ${selectedSize === size.size ? 'tag-primary' : 'tag-default'}`}
              style={{ 
                cursor: size.stock > 0 ? 'pointer' : 'not-allowed', 
                opacity: size.stock > 0 ? 1 : 0.5 
              }}
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

      {showAddFitting && (
        <div className="popup-mask" onClick={() => setShowAddFitting(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>加入试衣清单</div>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>选择顾客</div>
                <select
                  className="input-field"
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  <option value="">请选择顾客</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>已选商品</div>
                <div style={{ padding: '12px', background: '#f7f8fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px' }}>{product.name}</div>
                  <div style={{ fontSize: '13px', color: '#646566', marginTop: '4px' }}>
                    颜色：{selectedColor || '未选'} | 尺码：{selectedSize || '未选'}
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary btn-block"
                onClick={confirmAddToFitting}
              >
                确认加入试衣清单
              </button>
            </div>
          </div>
        </div>
      )}

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
                  setShowStoreInventory(false);
                  setShowTransferPopup(true);
                }}
              >
                申请调货
              </button>
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
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>商品信息</div>
                <div style={{ padding: '12px', background: '#f7f8fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{product.name}</div>
                  <div style={{ fontSize: '13px', color: '#646566', marginTop: '4px' }}>
                    货号：{product.code}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>选择顾客</div>
                <select
                  className="input-field"
                  value={transferCustomer}
                  onChange={(e) => setTransferCustomer(e.target.value)}
                >
                  <option value="">请选择顾客</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} - {c.level}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>颜色</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {product.colors.map(c => (
                    <button
                      key={c}
                      className={`tag ${selectedColor === c ? 'tag-primary' : 'tag-default'}`}
                      onClick={() => setSelectedColor(c)}
                      style={{ cursor: 'pointer' }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>尺码</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {product.sizes.map(s => (
                    <button
                      key={s.size}
                      className={`tag ${selectedSize === s.size ? 'tag-primary' : 'tag-default'}`}
                      onClick={() => setSelectedSize(s.size)}
                      style={{ cursor: 'pointer' }}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>来源门店</div>
                <select
                  className="input-field"
                  value={transferFromStore}
                  onChange={(e) => setTransferFromStore(e.target.value)}
                >
                  <option value="">请选择门店</option>
                  {product.storeStock?.map(s => (
                    <option key={s.store} value={s.store}>{s.store}（库存{s.stock}件）</option>
                  ))}
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
                  onClick={handleConfirmTransfer}
                >
                  提交申请
                </button>
              </div>
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
