import { createContext, useContext, useState, ReactNode } from 'react';
import { 
  customers, 
  products, 
  outfits, 
  fittingRecords, 
  tasks as initialTasks, 
  performance, 
  managerTasks as initialManagerTasks, 
  FittingRecord, 
  Customer, 
  Outfit, 
  Task, 
  ManagerTask,
  ActivityRecord,
  OutfitRecommendation
} from '../data/mockData';

interface FollowUpRecord {
  id: string;
  customerId: string;
  customerName: string;
  type: 'birthday' | 'aftersale' | 'appointment' | 'inactive' | 'care' | 'outfit';
  content: string;
  date: string;
  status: 'pending' | 'today' | 'completed';
  result?: string;
  note?: string;
  relatedId?: string;
}

interface TransferRecord {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  customerId: string;
  customerName: string;
  size: string;
  color: string;
  fromStore: string;
  toStore: string;
  status: 'pending' | 'processing' | 'completed';
  createTime: string;
}

interface AppContextType {
  customers: Customer[];
  products: typeof products;
  outfits: Outfit[];
  fittingRecords: FittingRecord[];
  tasks: Task[];
  performance: typeof performance;
  managerTasks: ManagerTask[];
  followUpRecords: FollowUpRecord[];
  transferRecords: TransferRecord[];
  activityRecords: ActivityRecord[];
  outfitRecommendations: OutfitRecommendation[];
  addFittingRecord: (record: Omit<FittingRecord, 'id'>) => void;
  updateFittingRecord: (id: string, updates: Partial<FittingRecord>) => void;
  addOutfit: (outfit: Omit<Outfit, 'id'>) => void;
  addFollowUpRecord: (record: Omit<FollowUpRecord, 'id'>) => void;
  updateFollowUpRecord: (id: string, updates: Partial<FollowUpRecord>) => void;
  addTransferRecord: (record: Omit<TransferRecord, 'id'>) => void;
  updateTransferRecord: (id: string, updates: Partial<TransferRecord>) => void;
  updateManagerTask: (id: string, updates: Partial<ManagerTask>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  addCustomerPreference: (customerId: string, preference: string) => void;
  addActivityRecord: (record: Omit<ActivityRecord, 'id'>) => void;
  addOutfitRecommendation: (record: Omit<OutfitRecommendation, 'id'>) => void;
  updateOutfitRecommendation: (id: string, updates: Partial<OutfitRecommendation>) => void;
  addVisitRecord: (customerId: string, record: { date: string; items: string[]; amount: number }) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [customerList, setCustomerList] = useState(customers);
  const [productList] = useState(products);
  const [outfitList, setOutfitList] = useState(outfits);
  const [fittingList, setFittingList] = useState(fittingRecords);
  const [taskList, setTaskList] = useState<Task[]>(initialTasks);
  const [perfData] = useState(performance);
  const [managerTaskList, setManagerTaskList] = useState<ManagerTask[]>(initialManagerTasks);
  const [followUpList, setFollowUpList] = useState<FollowUpRecord[]>([
    { id: 'fu1', customerId: '1', customerName: '张雅婷', type: 'birthday', content: '生日快乐！赠送50元无门槛券', date: '2026-06-10', status: 'pending' },
    { id: 'fu2', customerId: '3', customerName: '王思琪', type: 'aftersale', content: '购买连衣裙后3天回访', date: '2026-06-08', status: 'pending' },
    { id: 'fu3', customerId: '2', customerName: '李明辉', type: 'appointment', content: '预约到店定制西装', date: '2026-06-07 14:00', status: 'today' },
    { id: 'fu4', customerId: '4', customerName: '陈美玲', type: 'inactive', content: '超过30天未到店，唤醒关怀', date: '2026-06-09', status: 'pending' },
  ]);
  const [transferList, setTransferList] = useState<TransferRecord[]>([]);
  const [activityList, setActivityList] = useState<ActivityRecord[]>([
    {
      id: 'a1',
      customerId: '1',
      customerName: '张雅婷',
      type: 'fitting_purchased',
      title: '购买成交',
      content: '购买了羊毛混纺双排扣大衣、羊绒圆领针织衫',
      time: '2026-06-05 15:30',
      amount: 3580
    },
    {
      id: 'a2',
      customerId: '2',
      customerName: '李明辉',
      type: 'fitting_abandoned',
      title: '试衣未购买',
      content: '试穿高腰修身西装裤，原因：尺寸不合适，已建议定制',
      time: '2026-06-04 16:45'
    },
    {
      id: 'a3',
      customerId: '1',
      customerName: '张雅婷',
      type: 'care_sent',
      title: '发送会员关怀',
      content: '新品上市专属邀请',
      time: '2026-06-03 10:00'
    }
  ]);
  const [outfitRecList, setOutfitRecList] = useState<OutfitRecommendation[]>([]);

  const addActivityRecord = (record: Omit<ActivityRecord, 'id'>) => {
    const newRecord: ActivityRecord = {
      ...record,
      id: 'a' + Date.now()
    };
    setActivityList(prev => [newRecord, ...prev]);
  };

  const addFittingRecord = (record: Omit<FittingRecord, 'id'>) => {
    const newRecord: FittingRecord = {
      ...record,
      id: 'f' + Date.now()
    };
    setFittingList(prev => [newRecord, ...prev]);
    
    addActivityRecord({
      customerId: record.customerId,
      customerName: record.customerName,
      type: 'fitting_added',
      title: '加入试衣清单',
      content: `添加了 ${record.products.map(p => p.productName).join('、')}`,
      time: new Date().toLocaleString('zh-CN'),
      relatedId: newRecord.id
    });
  };

  const updateFittingRecord = (id: string, updates: Partial<FittingRecord>) => {
    setFittingList(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));

    const record = fittingList.find(r => r.id === id);
    if (record && updates.status === 'purchased') {
      const totalAmount = record.products.length * 800;
      addActivityRecord({
        customerId: record.customerId,
        customerName: record.customerName,
        type: 'fitting_purchased',
        title: '购买成交',
        content: `购买了 ${record.products.map(p => p.productName).join('、')}${updates.note ? `，备注：${updates.note}` : ''}`,
        time: new Date().toLocaleString('zh-CN'),
        amount: totalAmount,
        relatedId: id
      });
      addVisitRecord(record.customerId, {
        date: new Date().toLocaleDateString('zh-CN'),
        items: record.products.map(p => p.productName),
        amount: totalAmount
      });
    }
    if (record && updates.status === 'abandoned') {
      addActivityRecord({
        customerId: record.customerId,
        customerName: record.customerName,
        type: 'fitting_abandoned',
        title: '试衣未购买',
        content: `试穿 ${record.products.map(p => p.productName).join('、')}，原因：${updates.note || '未填写'}`,
        time: new Date().toLocaleString('zh-CN'),
        relatedId: id
      });
    }
  };

  const addOutfit = (outfit: Omit<Outfit, 'id'>) => {
    const newOutfit: Outfit = {
      ...outfit,
      id: 'o' + Date.now()
    };
    setOutfitList(prev => [newOutfit, ...prev]);
  };

  const addOutfitRecommendation = (record: Omit<OutfitRecommendation, 'id'>) => {
    const newRec: OutfitRecommendation = {
      ...record,
      id: 'or' + Date.now()
    };
    setOutfitRecList(prev => [newRec, ...prev]);

    addActivityRecord({
      customerId: record.customerId,
      customerName: record.customerName,
      type: 'outfit_recommended',
      title: '推荐搭配方案',
      content: `推荐了「${record.outfitName}」，共${record.outfitProducts.length}件单品，总价¥${record.totalPrice}`,
      time: record.recommendTime,
      relatedId: newRec.id,
      amount: record.totalPrice
    });

    addFollowUpRecord({
      customerId: record.customerId,
      customerName: record.customerName,
      type: 'outfit',
      content: `搭配推荐「${record.outfitName}」跟进反馈`,
      date: record.recommendTime,
      status: 'pending',
      relatedId: newRec.id
    });
  };

  const updateOutfitRecommendation = (id: string, updates: Partial<OutfitRecommendation>) => {
    setOutfitRecList(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const addFollowUpRecord = (record: Omit<FollowUpRecord, 'id'>) => {
    const newRecord: FollowUpRecord = {
      ...record,
      id: 'fu' + Date.now()
    };
    setFollowUpList(prev => [newRecord, ...prev]);
  };

  const updateFollowUpRecord = (id: string, updates: Partial<FollowUpRecord>) => {
    setFollowUpList(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const addTransferRecord = (record: Omit<TransferRecord, 'id'>) => {
    const newRecord: TransferRecord = {
      ...record,
      id: 't' + Date.now()
    };
    setTransferList(prev => [newRecord, ...prev]);

    addActivityRecord({
      customerId: record.customerId,
      customerName: record.customerName,
      type: 'transfer_requested',
      title: '申请调货',
      content: `${record.productName}（${record.color} ${record.size}），从${record.fromStore}调往${record.toStore}`,
      time: record.createTime,
      relatedId: newRecord.id
    });
  };

  const updateTransferRecord = (id: string, updates: Partial<TransferRecord>) => {
    setTransferList(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const updateManagerTask = (id: string, updates: Partial<ManagerTask>) => {
    setManagerTaskList(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTaskList(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: 'task' + Date.now()
    };
    setTaskList(prev => [newTask, ...prev]);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomerList(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const addCustomerPreference = (customerId: string, preference: string) => {
    setCustomerList(prev => prev.map(customer => {
      if (customer.id === customerId && !customer.preferences.includes(preference)) {
        return { ...customer, preferences: [...customer.preferences, preference] };
      }
      return customer;
    }));

    const customer = customerList.find(c => c.id === customerId);
    if (customer) {
      addActivityRecord({
        customerId,
        customerName: customer.name,
        type: 'preference_updated',
        title: '更新偏好标签',
        content: `添加偏好：${preference}`,
        time: new Date().toLocaleString('zh-CN')
      });
    }
  };

  const addVisitRecord = (customerId: string, record: { date: string; items: string[]; amount: number }) => {
    setCustomerList(prev => prev.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          totalSpent: customer.totalSpent + record.amount,
          lastVisit: record.date,
          visitHistory: [record, ...customer.visitHistory]
        };
      }
      return customer;
    }));
  };

  return (
    <AppContext.Provider value={{
      customers: customerList,
      products: productList,
      outfits: outfitList,
      fittingRecords: fittingList,
      tasks: taskList,
      performance: perfData,
      managerTasks: managerTaskList,
      followUpRecords: followUpList,
      transferRecords: transferList,
      activityRecords: activityList,
      outfitRecommendations: outfitRecList,
      addFittingRecord,
      updateFittingRecord,
      addOutfit,
      addFollowUpRecord,
      updateFollowUpRecord,
      addTransferRecord,
      updateTransferRecord,
      updateManagerTask,
      updateTask,
      addTask,
      updateCustomer,
      addCustomerPreference,
      addActivityRecord,
      addOutfitRecommendation,
      updateOutfitRecommendation,
      addVisitRecord
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
