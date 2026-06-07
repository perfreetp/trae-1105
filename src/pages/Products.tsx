import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Products() {
  const navigate = useNavigate();
  const { products } = useApp();
  const [searchText, setSearchText] = useState('');
  const [showScanPopup, setShowScanPopup] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [scanResult, setScanResult] = useState('');

  const categories = ['全部', '外套', '针织衫', '裤装', '衬衫', '半身裙', '鞋履'];
  const styles = ['通勤', '休闲', '优雅', '复古', '商务'];
  const colors = ['黑色', '白色', '灰色', '驼色', '藏蓝', '红色', '米色', '焦糖色'];

  const styleMatchMap: Record<string, string[]> = {
    '通勤': ['简约通勤', '通勤'],
    '休闲': ['休闲时尚', '休闲'],
    '优雅': ['优雅气质', '优雅'],
    '复古': ['复古学院', '复古'],
    '商务': ['商务正装', '商务'],
  };

  const filteredProducts = products.filter(p => {
    if (searchText && !p.name.includes(searchText) && !p.code.includes(searchText)) {
      return false;
    }
    if (selectedCategory !== '全部' && p.category !== selectedCategory) {
      return false;
    }
    if (selectedStyles.length > 0) {
      const matched = selectedStyles.some(style => {
        const keywords = styleMatchMap[style] || [style];
        return keywords.some(keyword => p.style.includes(keyword));
      });
      if (!matched) return false;
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

  const handleScan = () => {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    setScanResult(randomProduct.code);
    setTimeout(() => {
      setShowScanPopup(false);
      navigate(`/product/${randomProduct.id}?fromScan=true&code=${randomProduct.code}`);
    }, 800);
  };

  const handleRescan = () => {
    setScanResult('');
    setTimeout(() => {
      handleScan();
    }, 300);
  };

  const resetFilter = () => {
    setSelectedStyles([]);
    setSelectedColors([]);
    setSelectedCategory('全部');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="navbar">
          <span className="navbar-title">商品查询</span>
        </div>
        <div style={{ padding: '0 12px 12px', display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              className="input-field"
              placeholder="搜索商品名称、货号"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#969799' }}>🔍</span>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ padding: '0 12px' }}
            onClick={() => setShowScanPopup(true)}
          >
            📷 扫码
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', padding: '0 12px 12px', overflowX: 'auto' }}>
          {categories.map(cat => (
            <span
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`tag ${selectedCategory === cat ? 'tag-primary' : 'tag-default'}`}
              style={{ cursor: 'pointer', flexShrink: 0 }}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div 
        style={{ 
          padding: '8px 12px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: '#fff',
          borderBottom: '1px solid #ebedf0'
        }}
      >
        <span style={{ fontSize: '13px', color: '#969799' }}>
          共 {filteredProducts.length} 件商品
        </span>
        <span 
          style={{ fontSize: '13px', color: '#1989fa', cursor: 'pointer' }}
          onClick={() => setShowFilter(true)}
        >
          筛选 {selectedStyles.length + selectedColors.length > 0 ? `(${selectedStyles.length + selectedColors.length})` : ''}
        </span>
      </div>

      <div style={{ padding: '12px' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="product-price">¥{product.price}</span>
                  <span className="tag tag-default tag-plain" style={{ fontSize: '10px' }}>
                    {product.style}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div style={{ padding: '48px 16px', textAlign: 'center', color: '#969799' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
            <div>没有找到相关商品</div>
          </div>
        )}
      </div>

      {showScanPopup && (
        <div className="popup-mask" onClick={() => setShowScanPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '80px', marginBottom: '16px' }}>📷</div>
              <div style={{ fontSize: '16px', marginBottom: '24px' }}>扫码查款</div>
              {scanResult ? (
                <div>
                  <div style={{ color: '#07c160', marginBottom: '8px' }}>✓ 扫码成功</div>
                  <div style={{ fontSize: '14px', color: '#646566', marginBottom: '16px' }}>货号：{scanResult}</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="btn btn-default" 
                      style={{ flex: 1 }}
                      onClick={handleRescan}
                    >
                      重新扫码
                    </button>
                    <button 
                      className="btn btn-primary" 
                      style={{ flex: 1 }}
                      onClick={() => {
                        const product = products.find(p => p.code === scanResult);
                        if (product) {
                          setShowScanPopup(false);
                          navigate(`/product/${product.id}?fromScan=true&code=${product.code}`);
                        }
                      }}
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              ) : (
                <button className="btn btn-primary btn-block" onClick={handleScan}>
                  模拟扫码
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showFilter && (
        <div className="popup-mask" onClick={() => setShowFilter(false)}>
          <div 
            className="popup-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ height: '70%' }}
          >
            <div style={{ padding: '16px', height: '100%', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '18px', fontWeight: 600 }}>筛选</span>
                <span 
                  style={{ fontSize: '14px', color: '#969799', cursor: 'pointer' }}
                  onClick={resetFilter}
                >
                  重置
                </span>
              </div>

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

              <button
                className="btn btn-primary btn-block"
                style={{ position: 'sticky', bottom: '0' }}
                onClick={() => setShowFilter(false)}
              >
                确定 ({filteredProducts.length}件)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
