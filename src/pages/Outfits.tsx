import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Outfits() {
  const navigate = useNavigate();
  const { 
    outfits, 
    products, 
    addOutfit, 
    addFittingRecord, 
    customers, 
    addOutfitRecommendation 
  } = useApp();
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<typeof outfits[0] | null>(null);
  const [newOutfitName, setNewOutfitName] = useState('');
  const [newOutfitStyle, setNewOutfitStyle] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [showRecommendPopup, setShowRecommendPopup] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');

  const getTotalPrice = (productIds: string[]) => {
    return productIds.reduce((total, id) => {
      const product = products.find(p => p.id === id);
      return total + (product?.price || 0);
    }, 0);
  };

  const handleAction = (action: string) => {
    setShowActionSheet(false);
    switch (action) {
      case 'addFitting':
        if (selectedOutfit) {
          if (customers.length > 0) {
            const customer = customers[0];
            addFittingRecord({
              customerId: customer.id,
              customerName: customer.name,
              products: selectedOutfit.products.map(pid => {
                const p = products.find(prod => prod.id === pid);
                return {
                  productId: pid,
                  productName: p?.name || pid,
                  size: p?.sizes[0]?.size || 'M',
                  color: p?.colors[0] || '黑色'
                };
              }),
              status: 'trying',
              createdAt: new Date().toLocaleString('zh-CN')
            });
            alert('整套搭配已加入试衣清单');
            setTimeout(() => navigate('/fitting'), 500);
          }
        }
        break;
      case 'recommend':
        setShowRecommendPopup(true);
        break;
      case 'delete':
        if (selectedOutfit && window.confirm('确定删除此搭配吗？')) {
          alert('删除成功');
        }
        break;
    }
  };

  const handleCreateOutfit = () => {
    if (!newOutfitName || selectedProducts.length === 0) {
      alert('请填写搭配名称并选择至少一件商品');
      return;
    }
    addOutfit({
      name: newOutfitName,
      image: products[0]?.image || '',
      products: selectedProducts,
      style: newOutfitStyle || '自定义风格',
      occasion: '通用',
      createdBy: '我',
      createdAt: new Date().toLocaleDateString('zh-CN')
    });
    setShowCreatePopup(false);
    setNewOutfitName('');
    setNewOutfitStyle('');
    setSelectedProducts([]);
    alert('搭配创建成功');
  };

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleRecommend = () => {
    if (!selectedCustomer || !selectedOutfit) {
      alert('请选择会员');
      return;
    }
    const customer = customers.find(c => c.id === selectedCustomer);
    if (customer) {
      addOutfitRecommendation({
        outfitId: selectedOutfit.id,
        outfitName: selectedOutfit.name,
        outfitImage: selectedOutfit.image,
        outfitProducts: selectedOutfit.products,
        totalPrice: getTotalPrice(selectedOutfit.products),
        customerId: customer.id,
        customerName: customer.name,
        recommendTime: new Date().toLocaleString('zh-CN')
      });
      alert(`已将搭配推荐给 ${customer.name}，可在会员详情和跟进中查看`);
    }
    setShowRecommendPopup(false);
    setShowDetailPopup(false);
    setSelectedCustomer('');
  };

  const actions = [
    { name: '整套加入试衣', icon: '🛍️', action: 'addFitting' },
    { name: '推荐给会员', icon: '💝', action: 'recommend' },
    { name: '删除搭配', icon: '🗑️', action: 'delete' },
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
        {outfits.map(outfit => (
          <div key={outfit.id} className="card-section" style={{ margin: '0 0 12px 0' }}>
            <div
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => {
                setSelectedOutfit(outfit);
                setShowDetailPopup(true);
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
                  ¥{getTotalPrice(outfit.products)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreatePopup && (
        <div className="popup-mask" onClick={() => setShowCreatePopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()} style={{ height: '85%' }}>
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
                  placeholder="请输入风格标签，如：简约通勤"
                  value={newOutfitStyle}
                  onChange={(e) => setNewOutfitStyle(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>选择单品 ({selectedProducts.length}件)</span>
                  <span 
                    style={{ fontSize: '13px', color: '#1989fa', cursor: 'pointer' }}
                    onClick={() => setShowProductSelector(true)}
                  >
                    添加商品
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', minHeight: '40px', padding: '8px', background: '#f7f8fa', borderRadius: '8px' }}>
                  {selectedProducts.length === 0 ? (
                    <span style={{ fontSize: '12px', color: '#969799' }}>还没有选择商品</span>
                  ) : (
                    selectedProducts.map(pid => {
                      const p = products.find(prod => prod.id === pid);
                      return (
                        <span key={pid} className="tag tag-primary" style={{ fontSize: '11px' }}>
                          {p?.name}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>

              {selectedProducts.length > 0 && (
                <div style={{ marginBottom: '16px', padding: '12px', background: '#fff7e8', borderRadius: '8px' }}>
                  <div style={{ fontSize: '13px', color: '#ff976a' }}>
                    搭配总价：<span style={{ fontSize: '16px', fontWeight: 600 }}>¥{getTotalPrice(selectedProducts)}</span>
                  </div>
                </div>
              )}

              <button
                className="btn btn-primary btn-block"
                style={{ position: 'sticky', bottom: '0', marginTop: '20px' }}
                onClick={handleCreateOutfit}
              >
                保存搭配
              </button>
            </div>
          </div>
        </div>
      )}

      {showProductSelector && (
        <div className="popup-mask" onClick={() => setShowProductSelector(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()} style={{ height: '60%' }}>
            <div style={{ padding: '16px', height: '100%', overflowY: 'auto' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>选择商品</div>
              {products.map(product => (
                <div 
                  key={product.id}
                  className="cell"
                  onClick={() => toggleProduct(product.id)}
                >
                  <span className="cell-icon" style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%',
                    border: `2px solid ${selectedProducts.includes(product.id) ? '#1989fa' : '#c8c9cc'}`,
                    background: selectedProducts.includes(product.id) ? '#1989fa' : 'transparent',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}>
                    {selectedProducts.includes(product.id) ? '✓' : ''}
                  </span>
                  <div className="cell-content">
                    <div className="cell-title">{product.name}</div>
                    <div className="cell-label">¥{product.price}</div>
                  </div>
                </div>
              ))}
              <button
                className="btn btn-primary btn-block"
                style={{ marginTop: '12px' }}
                onClick={() => setShowProductSelector(false)}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailPopup && selectedOutfit && (
        <div className="popup-mask" onClick={() => setShowDetailPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()} style={{ height: '75%' }}>
            <div style={{ padding: '16px', height: '100%', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '18px', fontWeight: 600 }}>{selectedOutfit.name}</span>
                <span 
                  style={{ fontSize: '20px', cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedOutfit(selectedOutfit);
                    setShowDetailPopup(false);
                    setShowActionSheet(true);
                  }}
                >
                  ⋮
                </span>
              </div>
              
              <img
                src={selectedOutfit.image}
                alt=""
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
              />

              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <span className="tag tag-primary tag-plain">{selectedOutfit.style}</span>
                <span className="tag tag-warning tag-plain">{selectedOutfit.occasion}</span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>搭配单品</div>
                {selectedOutfit.products.map((productId, i) => {
                  const product = products.find(p => p.id === productId);
                  return (
                    <div key={i} className="cell">
                      <img 
                        src={product?.image} 
                        alt="" 
                        style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                      />
                      <div className="cell-content">
                        <div className="cell-title">{product?.name}</div>
                        <div className="cell-label">¥{product?.price}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: '12px', background: '#fff7e8', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#969799' }}>搭配总价</span>
                  <span style={{ fontSize: '20px', fontWeight: 600, color: '#ee0a24' }}>
                    ¥{getTotalPrice(selectedOutfit.products)}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', position: 'sticky', bottom: '0' }}>
                <button 
                  className="btn btn-default" 
                  style={{ flex: 1 }}
                  onClick={() => {
                    handleAction('addFitting');
                  }}
                >
                  加入试衣
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                  onClick={handleAction.bind(null, 'recommend')}
                >
                  推荐会员
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRecommendPopup && (
        <div className="popup-mask" onClick={() => setShowRecommendPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>推荐给会员</div>
              <select
                className="input-field"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="">请选择会员</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - {c.level}</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button 
                  className="btn btn-default" 
                  style={{ flex: 1 }}
                  onClick={() => setShowRecommendPopup(false)}
                >
                  取消
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                  onClick={handleRecommend}
                >
                  发送推荐
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
