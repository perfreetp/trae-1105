import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Performance() {
  const navigate = useNavigate();
  const { performance, managerTasks, updateManagerTask } = useApp();

  const weekData = performance.weeklyData;
  const maxAmount = Math.max(...weekData.map(d => d.amount));
  const completedTaskCount = managerTasks.filter(t => t.status === 'completed').length;
  const totalTaskReward = managerTasks
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.reward, 0);

  const handleClaimTask = (taskId: string) => {
    updateManagerTask(taskId, { status: 'in_progress' });
    alert('任务已领取，可在今日任务中查看');
  };

  const handleCompleteTask = (taskId: string) => {
    const task = managerTasks.find(t => t.id === taskId);
    if (task) {
      updateManagerTask(taskId, { status: 'completed' });
      alert(`任务已完成！获得奖励 ¥${task.reward}`);
    }
  };

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
              <span>¥{performance.monthCompleted + totalTaskReward} / ¥{performance.monthTarget}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-inner" 
                style={{ width: `${((performance.monthCompleted + totalTaskReward) / performance.monthTarget) * 100}%` }}
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
          <span 
            style={{ fontSize: '13px', color: '#1989fa', cursor: 'pointer' }}
            onClick={() => navigate('/tasks')}
          >
            查看今日任务 →
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div 
            className="circle-progress"
            style={{ ['--progress' as any]: `${((performance.dayCompleted + totalTaskReward) / performance.dayTarget) * 360}deg` }}
          >
            <span className="circle-progress-text">{Math.round(((performance.dayCompleted + totalTaskReward) / performance.dayTarget) * 100)}%</span>
          </div>
          <div style={{ marginLeft: '32px' }}>
            <div style={{ fontSize: '24px', fontWeight: 600, color: '#ee0a24' }}>¥{performance.dayCompleted + totalTaskReward}</div>
            <div style={{ fontSize: '14px', color: '#969799', marginTop: '4px' }}>目标 ¥{performance.dayTarget}</div>
            {totalTaskReward > 0 && (
              <div style={{ fontSize: '12px', color: '#07c160', marginTop: '4px' }}>
                含任务奖励 ¥{totalTaskReward}
              </div>
            )}
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
          <span className="badge" style={{ marginLeft: '8px' }}>
            {completedTaskCount}/{managerTasks.length}
          </span>
        </div>
        <div>
          {managerTasks.map(task => (
            <div key={task.id} className="cell">
              <span className="cell-icon">🚩</span>
              <div className="cell-content">
                <div className="cell-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {task.title}
                  {task.status === 'in_progress' && (
                    <span className="tag tag-warning">进行中</span>
                  )}
                </div>
                <div className="cell-label">{task.description}</div>
                <div style={{ fontSize: '11px', color: '#ff976a', marginTop: '2px' }}>
                  奖励：¥{task.reward}
                </div>
              </div>
              <div className="cell-value">
                {task.status === 'completed' ? (
                  <span className="tag tag-success">已完成</span>
                ) : task.status === 'in_progress' ? (
                  <button 
                    className="btn btn-primary btn-mini"
                    onClick={() => handleCompleteTask(task.id)}
                  >
                    完成
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary btn-mini"
                    onClick={() => handleClaimTask(task.id)}
                  >
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
