import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Tasks() {
  const navigate = useNavigate();
  const { tasks, updateTask, performance, managerTasks } = useApp();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '紧急';
      case 'medium': return '重要';
      default: return '普通';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'follow_up': return '👤';
      case 'appointment': return '⏰';
      case 'manager_task': return '🚩';
      default: return '📝';
    }
  };

  const completeTask = (id: string) => {
    if (window.confirm('确定要将此任务标记为完成吗？')) {
      updateTask(id, { status: 'completed' });
    }
  };

  const inProgressManagerTasks = managerTasks.filter(t => t.status === 'in_progress');
  const allTasks = [
    ...tasks,
    ...inProgressManagerTasks.map(t => ({
      id: 'mt_' + t.id,
      title: t.title,
      type: 'manager_task' as const,
      priority: 'high' as const,
      deadline: '今日',
      status: 'pending' as const,
      description: t.description
    }))
  ];

  const pendingTasks = allTasks.filter(t => t.status === 'pending');
  const completedTasks = allTasks.filter(t => t.status === 'completed');
  const completedManagerTasks = managerTasks.filter(t => t.status === 'completed');
  const totalCompletedCount = completedTasks.length + completedManagerTasks.length;

  const quickActions = [
    { icon: '📷', label: '扫码查款', path: '/products', bg: '#e8f3ff', color: '#1989fa' },
    { icon: '➕', label: '新建试衣', path: '/fitting', bg: '#fff7e8', color: '#ff976a' },
    { icon: '👥', label: '会员查询', path: '/customers', bg: '#f0f9ff', color: '#07c160' },
    { icon: '📊', label: '业绩统计', path: '/performance', bg: '#fff0f0', color: '#ee0a24' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="navbar">
          <span className="navbar-title">今日任务</span>
        </div>
      </div>

      <div className="card-section" style={{ margin: 0, borderRadius: 0 }}>
        <div style={{ padding: '16px', background: 'linear-gradient(135deg, #1989fa 0%, #07c160 100%)', color: '#fff' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>今日工作概览</div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div className="stat-card">
              <div style={{ fontSize: '28px', fontWeight: 600, color: '#fff' }}>{pendingTasks.length}</div>
              <div style={{ fontSize: '12px', opacity: 0.85 }}>待办任务</div>
            </div>
            <div className="stat-card">
              <div style={{ fontSize: '28px', fontWeight: 600, color: '#fff' }}>¥{performance.dayCompleted}</div>
              <div style={{ fontSize: '12px', opacity: 0.85 }}>今日业绩</div>
            </div>
            <div className="stat-card">
              <div style={{ fontSize: '28px', fontWeight: 600, color: '#fff' }}>{totalCompletedCount}</div>
              <div style={{ fontSize: '12px', opacity: 0.85 }}>已完成</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-section">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '8px',
          padding: '12px'
        }}>
          {quickActions.map((action, index) => (
            <div
              key={index}
              onClick={() => navigate(action.path)}
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

      <div className="card-section">
        <div className="section-header" style={{ display: 'flex', alignItems: 'center' }}>
          <span className="section-title">待办任务</span>
          <span className="badge" style={{ marginLeft: '8px' }}>
            {pendingTasks.length}
          </span>
        </div>
        <div>
          {pendingTasks.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#969799', fontSize: '14px' }}>
              🎉 太棒了！暂无待办任务
            </div>
          ) : (
            pendingTasks.map(task => (
              <div key={task.id} className="cell">
                <span className="cell-icon">{getTypeIcon(task.type)}</span>
                <div className="cell-content">
                  <div className="cell-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{task.title}</span>
                    <span className={`tag tag-${getPriorityColor(task.priority)}`}>
                      {getPriorityText(task.priority)}
                    </span>
                    {task.type === 'manager_task' && (
                      <span className="tag tag-warning">店长任务</span>
                    )}
                  </div>
                  <div className="cell-label">{task.description}</div>
                </div>
                <div className="cell-value">
                  <button 
                    className="btn btn-primary btn-mini" 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (task.id.startsWith('mt_')) {
                        alert('请到业绩统计页面完成店长任务');
                        navigate('/performance');
                      } else {
                        completeTask(task.id);
                      }
                    }}
                  >
                    完成
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card-section">
        <div className="section-header">
          <span className="section-title">已完成任务</span>
        </div>
        <div>
          {totalCompletedCount === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#969799', fontSize: '14px' }}>
              暂无已完成任务
            </div>
          ) : (
            <>
              {completedTasks.map(task => (
                <div key={task.id} className="cell">
                  <span className="cell-icon">{getTypeIcon(task.type)}</span>
                  <div className="cell-content">
                    <div className="cell-title">{task.title}</div>
                    <div className="cell-label">{task.description}</div>
                  </div>
                  <div className="cell-value">
                    <span className="tag tag-success">已完成</span>
                  </div>
                </div>
              ))}
              {completedManagerTasks.map(task => (
                <div key={'mt_' + task.id} className="cell">
                  <span className="cell-icon">🚩</span>
                  <div className="cell-content">
                    <div className="cell-title">{task.title}</div>
                    <div className="cell-label">{task.description}</div>
                  </div>
                  <div className="cell-value">
                    <span className="tag tag-success">已完成 +¥{task.reward}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
