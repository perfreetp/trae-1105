import { performance, managerTasks } from '../data/mockData';

export default function Performance() {
  const weekData = [
    { day: '周一', amount: 2800 },
    { day: '周二', amount: 3200 },
    { day: '周三', amount: 1900 },
    { day: '周四', amount: 4500 },
    { day: '周五', amount: 3800 },
    { day: '周六', amount: 6200 },
    { day: '周日', amount: 3580 },
  ];

  const maxAmount = Math.max(...weekData.map(d => d.amount));

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="navbar">
          <span className="navbar-title">业绩统计</span>
        </div>
      </div>

      <div className="card-section" style={{ margin: 0, borderRadius: 0 }}>
        <div style={{ padding: '16px', background: 'linear-gradient(135deg, #1989fa 0%, #07c160 100%)', color: '#fff' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>本月目标进度</div>
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
              <span>业绩目标</span>
              <span>¥{performance.monthCompleted} / ¥{performance.monthTarget}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-inner" 
                style={{ width: `${(performance.monthCompleted / performance.monthTarget) * 100}%` }}
              ></div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 600 }}>{performance.customerCount}</div>
              <div style={{ fontSize: '12px', opacity: 0.85 }}>接待客户</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 600 }}>{performance.conversionRate}%</div>
              <div style={{ fontSize: '12px', opacity: 0.85 }}>成交转化率</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 600 }}>¥{performance.avgOrderValue}</div>
              <div style={{ fontSize: '12px', opacity: 0.85 }}>客单价</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-section">
        <div className="section-header">
          <span className="section-title">今日目标</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div 
            className="circle-progress"
            style={{ ['--progress' as any]: `${(performance.dayCompleted / performance.dayTarget) * 360}deg` }}
          >
            <span className="circle-progress-text">{Math.round((performance.dayCompleted / performance.dayTarget) * 100)}%</span>
          </div>
          <div style={{ marginLeft: '32px' }}>
            <div style={{ fontSize: '24px', fontWeight: 600, color: '#ee0a24' }}>¥{performance.dayCompleted}</div>
            <div style={{ fontSize: '14px', color: '#969799', marginTop: '4px' }}>目标 ¥{performance.dayTarget}</div>
          </div>
        </div>
      </div>

      <div className="card-section">
        <div className="section-header">
          <span className="section-title">本周业绩趋势</span>
        </div>
        <div className="chart-container">
          <div className="bar-chart">
            {weekData.map((item, index) => (
              <div key={index} className="bar-item">
                <div 
                  className="bar" 
                  style={{ height: `${(item.amount / maxAmount) * 100}%` }}
                ></div>
                <span className="bar-label">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-section">
        <div className="section-header">
          <span className="section-title">门店排名</span>
        </div>
        <div>
          {performance.storeRanking.map((store, index) => (
            <div key={store.name} className="cell">
              <span className="cell-icon" style={{ 
                color: index === 0 ? '#ff976a' : index === 1 ? '#c8c9cc' : index === 2 ? '#da8848' : '#969799',
                fontWeight: 600,
                fontSize: '16px',
                width: '24px',
                textAlign: 'center'
              }}>
                {index + 1}
              </span>
              <div className="cell-content">
                <div className="cell-title">{store.name}</div>
                <div className="cell-label">销售 {store.count} 件</div>
              </div>
              <span className="cell-value" style={{ color: '#ee0a24', fontWeight: 500 }}>
                ¥{store.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card-section">
        <div className="section-header">
          <span className="section-title">店长任务</span>
        </div>
        <div>
          {managerTasks.map(task => (
            <div key={task.id} className="cell">
              <span className="cell-icon">🚩</span>
              <div className="cell-content">
                <div className="cell-title">{task.title}</div>
                <div className="cell-label">{task.description}</div>
                <div style={{ fontSize: '11px', color: '#ff976a', marginTop: '2px' }}>
                  奖励：¥{task.reward}
                </div>
              </div>
              <div className="cell-value">
                {task.status === 'completed' ? (
                  <span className="tag tag-success">已完成</span>
                ) : (
                  <button className="btn btn-primary btn-mini">
                    领取
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-section">
        <div className="section-header">
          <span className="section-title">我的排行</span>
        </div>
        <div className="cell">
          <div className="cell-content">
            <div className="cell-title">本月销售排名</div>
            <div className="cell-label">全店共 {performance.ranking.total} 名导购</div>
          </div>
          <span className="cell-value" style={{ fontSize: '18px', fontWeight: 600, color: '#1989fa' }}>
            第 {performance.ranking.current} 名
          </span>
        </div>
      </div>
    </div>
  );
}
