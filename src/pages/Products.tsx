import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/mockData';

export default function Products() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [showScanPopup, setShowScanPopup] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const categories = ['全部', '上衣', '裤装', '裙装', '外套', '配饰'];
  const styles = ['通勤', '休闲', '优雅', '复古', '运动'];
  const colors = ['黑色', '白色', '灰色', '驼色', '藏蓝', '红色'];

  const filteredProducts = products.filter(p => {
    if (searchText && !p.name.includes(searchText) && !p.code.includes(searchText)) {
      return false;
    }
    if (selectedCategory !== '全部' && p.category !== selectedCategory) {
      return false;
    }
    if (selectedStyles.length > 0 && !selectedStyles.includes(p.style)) {
      return false;
    }
    if (selectedColors.length > 0 && !p.colors.some(c => selectedColors.includes(c))) {
      return false;
    }
    return true;
  });

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="navbar">
          <span className="navbar-title">商品查询</span>
        </div>
        <div className="search-box">
          <span>🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="搜索货号/商品名称"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <span style={{ cursor: 'pointer', fontSize: '20px' }} onClick={() => setShowScanPopup(true)}>📷</span>
          <span style={{ cursor: 'pointer', fontSize: '20px' }} onClick={() => setShowFilter(true)}>⚙️</span>
        </div>
        <div style={{ display: 'flex', padding: '8px 12px', gap: '8px', overflowX: 'auto', background: '#fff' }}>
          {categories.map(cat => (
            <span
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`tag ${selectedCategory === cat ? 'tag-primary' : 'tag-default'}`}
              style={{ flexShrink: 0, cursor: 'pointer' }}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <img src={product.image} alt="" className="product-image" />
            <div className="product-info">
              <div className="product-name">{product.name}</div>
              <div style={{ marginTop: '4px' }}>
                <span className="tag tag-primary tag-plain" style={{ fontSize: '11px' }}>{product.style}</span>
              </div>
              <div className="product-price">¥{product.price}</div>
            </div>
          </div>
        ))}
      </div>

      {showScanPopup && (
        <div className="popup-mask" onClick={() => setShowScanPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>扫码查款</div>
              <div style={{ 
                height: '200px', 
                background: '#f7f8fa', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <div style={{ textAlign: 'center', color: '#969799' }}>
                  <span style={{ fontSize: '48px' }}>📷</span>
                  <div style={{ marginTop: '8px' }}>扫描商品条码/二维码</div>
                </div>
              </div>
              <button
                className="btn btn-primary btn-block"
                onClick={() => {
                  setShowScanPopup(false);
                  navigate('/product/p1');
                }}
              >
                模拟扫码成功
              </button>
            </div>
          </div>
        </div>
      )}

      {showFilter && (
        <div className="popup-mask" onClick={() => setShowFilter(false)} style={{ justifyContent: 'flex-end' }}>
          <div 
            className="popup-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ width: '80%', borderRadius: '12px 0 0 12px', maxHeight: '100vh' }}
          >
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>筛选</div>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>风格</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {styles.map(style => (
                    <span
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={`tag ${selectedStyles.includes(style) ? 'tag-primary' : 'tag-default'}`}
                      style={{ cursor: 'pointer' }}
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>颜色</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {colors.map(color => (
                    <span
                      key={color}
                      onClick={() => toggleColor(color)}
                      className={`tag ${selectedColors.includes(color) ? 'tag-primary' : 'tag-default'}`}
                      style={{ cursor: 'pointer' }}
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn btn-default"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setSelectedStyles([]);
                    setSelectedColors([]);
                  }}
                >
                  重置
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => setShowFilter(false)}
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
