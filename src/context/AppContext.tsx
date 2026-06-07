import { createContext, useContext, useState, ReactNode } from 'react';
import { customers, products, outfits, fittingRecords, tasks, performance, managerTasks, FittingRecord, Customer, Outfit, Task, ManagerTask } from '../data/mockData';

interface FollowUpRecord {
  id: string;
  customerId: string;
  customerName: string;
  type: 'birthday' | 'aftersale' | 'appointment' | 'inactive' | 'care';
  content: string;
  date: string;
  status: 'pending' | 'today' | 'completed';
  result?: string;
  note?: string;
}

interface TransferRecord {
  id: string;
  productId: string;
  productName: string;
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
  addFittingRecord: (record: Omit<FittingRecord, 'id'>) => void;
  updateFittingRecord: (id: string, updates: Partial<FittingRecord>) => void;
  addOutfit: (outfit: Omit<Outfit, 'id'>) => void;
  addFollowUpRecord: (record: Omit<FollowUpRecord, 'id'>) => void;
  updateFollowUpRecord: (id: string, updates: Partial<FollowUpRecord>) => void;
  addTransferRecord: (record: Omit<TransferRecord, 'id'>) => void;
  updateManagerTask: (id: string, updates: Partial<ManagerTask>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  addCustomerPreference: (customerId: string, preference: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [customerList, setCustomerList] = useState(customers);
  const [productList] = useState(products);
  const [outfitList, setOutfitList] = useState(outfits);
  const [fittingList, setFittingList] = useState(fittingRecords);
  const [taskList] = useState(tasks);
  const [perfData] = useState(performance);
  const [managerTaskList, setManagerTaskList] = useState(managerTasks);
  const [followUpList, setFollowUpList] = useState<FollowUpRecord[]>([
    { id: 'fu1', customerId: '1', customerName: '张雅婷', type: 'birthday', content: '生日快乐！赠送50元无门槛券', date: '2026-06-10', status: 'pending' },
    { id: 'fu2', customerId: '3', customerName: '王思琪', type: 'aftersale', content: '购买连衣裙后3天回访', date: '2026-06-08', status: 'pending' },
    { id: 'fu3', customerId: '2', customerName: '李明辉', type: 'appointment', content: '预约到店定制西装', date: '2026-06-07 14:00', status: 'today' },
    { id: 'fu4', customerId: '4', customerName: '陈美玲', type: 'inactive', content: '超过30天未到店，唤醒关怀', date: '2026-06-09', status: 'pending' },
  ]);
  const [transferList, setTransferList] = useState<TransferRecord[]>([]);

  const addFittingRecord = (record: Omit<FittingRecord, 'id'>) => {
    const newRecord: FittingRecord = {
      ...record,
      id: 'f' + Date.now()
    };
    setFittingList(prev => [newRecord, ...prev]);
  };

  const updateFittingRecord = (id: string, updates: Partial<FittingRecord>) => {
    setFittingList(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const addOutfit = (outfit: Omit<Outfit, 'id'>) => {
    const newOutfit: Outfit = {
      ...outfit,
      id: 'o' + Date.now()
    };
    setOutfitList(prev => [newOutfit, ...prev]);
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
  };

  const updateManagerTask = (id: string, updates: Partial<ManagerTask>) => {
    setManagerTaskList(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
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
      addFittingRecord,
      updateFittingRecord,
      addOutfit,
      addFollowUpRecord,
      updateFollowUpRecord,
      addTransferRecord,
      updateManagerTask,
      updateCustomer,
      addCustomerPreference
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
