export interface Task {
  id: string;
  title: string;
  type: 'follow_up' | 'appointment' | 'manager_task' | 'daily';
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  status: 'pending' | 'completed';
  description?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  level: '普通会员' | '银卡会员' | '金卡会员' | '钻石会员';
  points: number;
  totalSpent: number;
  lastVisit: string;
  preferences: string[];
  sizes: {
    top?: string;
    bottom?: string;
    shoes?: string;
  };
  tags: string[];
  coupons: Coupon[];
  visitHistory: VisitRecord[];
}

export interface Coupon {
  id: string;
  name: string;
  discount: string;
  expireDate: string;
  used: boolean;
}

export interface VisitRecord {
  date: string;
  items: string[];
  amount: number;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  style: string;
  colors: string[];
  sizes: { size: string; stock: number }[];
  storeStock: { store: string; stock: number }[];
  description: string;
  relatedProducts: string[];
}

export interface Outfit {
  id: string;
  name: string;
  image: string;
  products: string[];
  style: string;
  occasion: string;
  createdBy: string;
  createdAt: string;
}

export interface FittingRecord {
  id: string;
  customerId: string;
  customerName: string;
  products: { productId: string; productName: string; size: string; color: string }[];
  status: 'trying' | 'purchased' | 'abandoned';
  createdAt: string;
  note?: string;
}

export interface Performance {
  monthTarget: number;
  monthCompleted: number;
  dayTarget: number;
  dayCompleted: number;
  customerCount: number;
  conversionRate: number;
  avgOrderValue: number;
  ranking: { current: number; total: number };
  weeklyData: { day: string; amount: number }[];
  storeRanking: { name: string; amount: number; count: number }[];
}

export interface ManagerTask {
  id: string;
  title: string;
  description: string;
  reward: number;
  status: 'pending' | 'in_progress' | 'completed';
}

export type ActivityType = 
  | 'fitting_added' 
  | 'fitting_purchased' 
  | 'fitting_abandoned' 
  | 'outfit_recommended'
  | 'care_sent'
  | 'appointment_created'
  | 'transfer_requested'
  | 'preference_updated'
  | 'note_added';

export interface ActivityRecord {
  id: string;
  customerId: string;
  customerName: string;
  type: ActivityType;
  title: string;
  content: string;
  time: string;
  relatedId?: string;
  amount?: number;
  extra?: Record<string, any>;
}

export interface OutfitRecommendation {
  id: string;
  outfitId: string;
  outfitName: string;
  outfitImage: string;
  outfitProducts: string[];
  totalPrice: number;
  customerId: string;
  customerName: string;
  recommendTime: string;
  feedback?: 'like' | 'considering' | 'tried' | 'rejected';
  feedbackNote?: string;
}

export const tasks: Task[] = [
  {
    id: '1',
    title: '回访张女士',
    type: 'follow_up',
    priority: 'high',
    deadline: '今天 18:00',
    status: 'pending',
    description: '上周试穿了新款大衣，需要跟进购买意向'
  },
  {
    id: '2',
    title: '李先生预约到店',
    type: 'appointment',
    priority: 'high',
    deadline: '今天 14:00',
    status: 'pending',
    description: '商务西装定制需求'
  },
  {
    id: '3',
    title: '整理新品搭配方案',
    type: 'manager_task',
    priority: 'medium',
    deadline: '今天 17:00',
    status: 'pending',
    description: '店长分配的任务，完成5套冬装搭配'
  },
  {
    id: '4',
    title: '发送会员生日祝福',
    type: 'daily',
    priority: 'low',
    deadline: '今天 20:00',
    status: 'completed',
    description: '本月生日会员共8位'
  },
  {
    id: '5',
    title: '王女士连衣裙调货跟进',
    type: 'follow_up',
    priority: 'medium',
    deadline: '明天 12:00',
    status: 'pending',
    description: '从总店调货M码红色连衣裙'
  }
];

export const customers: Customer[] = [
  {
    id: '1',
    name: '张雅婷',
    phone: '138****5678',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20asian%20woman%20portrait%20business%20attire%20friendly%20smile&image_size=square',
    level: '金卡会员',
    points: 12580,
    totalSpent: 58600,
    lastVisit: '2026-06-05',
    preferences: ['简约风格', '中性色调', '质感面料'],
    sizes: { top: 'M', bottom: '27', shoes: '37' },
    tags: ['高净值', '职业装', '常客'],
    coupons: [
      { id: 'c1', name: '满1000减200券', discount: '满1000减200', expireDate: '2026-06-30', used: false },
      { id: 'c2', name: '新品9折券', discount: '9折', expireDate: '2026-07-15', used: false }
    ],
    visitHistory: [
      { date: '2026-06-05', items: ['羊毛大衣', '针织衫'], amount: 3580 },
      { date: '2026-05-20', items: ['真丝衬衫'], amount: 1280 }
    ]
  },
  {
    id: '2',
    name: '李明辉',
    phone: '139****1234',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20asian%20man%20portrait%20business%20suit%20confident&image_size=square',
    level: '钻石会员',
    points: 35600,
    totalSpent: 128000,
    lastVisit: '2026-06-03',
    preferences: ['商务正装', '高品质', '定制款'],
    sizes: { top: 'L', bottom: '32', shoes: '42' },
    tags: ['VIP', '商务定制', '高消费'],
    coupons: [
      { id: 'c3', name: 'VIP专属85折', discount: '85折', expireDate: '2026-12-31', used: false }
    ],
    visitHistory: [
      { date: '2026-06-03', items: ['定制西装套装', '皮鞋'], amount: 8800 },
      { date: '2026-04-15', items: ['衬衫3件'], amount: 2400 }
    ]
  },
  {
    id: '3',
    name: '王思琪',
    phone: '137****9012',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20asian%20woman%20portrait%20casual%20style%20fashionable&image_size=square',
    level: '银卡会员',
    points: 4200,
    totalSpent: 18500,
    lastVisit: '2026-05-28',
    preferences: ['休闲时尚', '亮色', '潮流款式'],
    sizes: { top: 'S', bottom: '25', shoes: '36' },
    tags: ['年轻客群', '时尚达人', '社交媒体'],
    coupons: [
      { id: 'c4', name: '新人首单礼', discount: '满500减100', expireDate: '2026-06-20', used: false }
    ],
    visitHistory: [
      { date: '2026-05-28', items: ['连衣裙', '凉鞋'], amount: 1680 }
    ]
  },
  {
    id: '4',
    name: '陈美玲',
    phone: '136****3456',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=middle%20aged%20asian%20woman%20portrait%20elegant%20dress&image_size=square',
    level: '普通会员',
    points: 860,
    totalSpent: 3200,
    lastVisit: '2026-05-10',
    preferences: ['优雅风格', '舒适面料'],
    sizes: { top: 'L', bottom: '29', shoes: '38' },
    tags: ['潜力客户', '价格敏感'],
    coupons: [],
    visitHistory: [
      { date: '2026-05-10', items: ['T恤', '牛仔裤'], amount: 599 }
    ]
  }
];

export const products: Product[] = [
  {
    id: 'p1',
    name: '羊毛混纺双排扣大衣',
    code: 'COAT-2026-W001',
    price: 3580,
    originalPrice: 4280,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20wool%20coat%20double%20breasted%20camel%20color%20fashion%20catalog&image_size=portrait_4_3',
    category: '外套',
    style: '简约通勤',
    colors: ['驼色', '黑色', '灰色'],
    sizes: [
      { size: 'S', stock: 3 },
      { size: 'M', stock: 5 },
      { size: 'L', stock: 2 },
      { size: 'XL', stock: 0 }
    ],
    storeStock: [
      { store: '本店', stock: 5 },
      { store: '总店', stock: 15 },
      { store: '徐汇店', stock: 8 },
      { store: '浦东店', stock: 3 }
    ],
    description: '采用70%羊毛混纺面料，保暖舒适，经典双排扣设计，百搭实用',
    relatedProducts: ['p2', 'p5']
  },
  {
    id: 'p2',
    name: '羊绒圆领针织衫',
    code: 'KNIT-2026-W012',
    price: 1280,
    originalPrice: 1580,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=soft%20cashmere%20sweater%20cream%20color%20crew%20neck%20minimalist&image_size=portrait_4_3',
    category: '针织衫',
    style: '简约通勤',
    colors: ['米白', '雾霾蓝', '焦糖色'],
    sizes: [
      { size: 'S', stock: 8 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 6 }
    ],
    storeStock: [
      { store: '本店', stock: 10 },
      { store: '总店', stock: 30 }
    ],
    description: '100%山羊绒，柔软亲肤，基础款百搭单品',
    relatedProducts: ['p1', 'p3']
  },
  {
    id: 'p3',
    name: '高腰修身西装裤',
    code: 'PANT-2026-W008',
    price: 890,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=high%20waist%20tailored%20trousers%20black%20formal%20pants&image_size=portrait_4_3',
    category: '裤装',
    style: '商务正装',
    colors: ['黑色', '深灰', '藏青'],
    sizes: [
      { size: '25', stock: 4 },
      { size: '26', stock: 6 },
      { size: '27', stock: 8 },
      { size: '28', stock: 3 },
      { size: '29', stock: 5 }
    ],
    storeStock: [
      { store: '本店', stock: 7 },
      { store: '总店', stock: 25 }
    ],
    description: '高腰修身设计，垂感面料，显瘦显腿长',
    relatedProducts: ['p2', 'p4']
  },
  {
    id: 'p4',
    name: '真丝缎面衬衫',
    code: 'SHIRT-2026-W015',
    price: 1580,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silk%20satin%20blouse%20champagne%20color%20elegant%20button%20down&image_size=portrait_4_3',
    category: '衬衫',
    style: '优雅气质',
    colors: ['香槟色', '酒红', '墨绿'],
    sizes: [
      { size: 'S', stock: 2 },
      { size: 'M', stock: 5 },
      { size: 'L', stock: 3 }
    ],
    storeStock: [
      { store: '本店', stock: 4 },
      { store: '总店', stock: 12 }
    ],
    description: '重磅真丝缎面，光泽感强，适合多种场合',
    relatedProducts: ['p3', 'p6']
  },
  {
    id: 'p5',
    name: '复古格纹半身裙',
    code: 'SKIRT-2026-W003',
    price: 790,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=vintage%20plaid%20midi%20skirt%20brown%20tones%20preppy%20style&image_size=portrait_4_3',
    category: '半身裙',
    style: '复古学院',
    colors: ['棕格', '灰格'],
    sizes: [
      { size: 'S', stock: 6 },
      { size: 'M', stock: 4 },
      { size: 'L', stock: 2 }
    ],
    storeStock: [
      { store: '本店', stock: 3 },
      { store: '总店', stock: 18 }
    ],
    description: '复古格纹图案，中长款设计，学院风十足',
    relatedProducts: ['p1', 'p2']
  },
  {
    id: 'p6',
    name: '尖头细跟高跟鞋',
    code: 'SHOE-2026-W022',
    price: 980,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pointed%20toe%20stiletto%20heels%20black%20leather%20elegant&image_size=portrait_4_3',
    category: '鞋履',
    style: '优雅气质',
    colors: ['黑色', '裸色', '酒红'],
    sizes: [
      { size: '35', stock: 3 },
      { size: '36', stock: 5 },
      { size: '37', stock: 7 },
      { size: '38', stock: 4 },
      { size: '39', stock: 2 }
    ],
    storeStock: [
      { store: '本店', stock: 6 },
      { store: '总店', stock: 20 }
    ],
    description: '小羊皮材质，7cm细跟，舒适百搭',
    relatedProducts: ['p4', 'p3']
  }
];

export const outfits: Outfit[] = [
  {
    id: 'o1',
    name: '职场精英通勤装',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20business%20outfit%20coat%20trousers%20blouse%20fashion%20flatlay&image_size=portrait_4_3',
    products: ['p1', 'p2', 'p3', 'p6'],
    style: '简约通勤',
    occasion: '职场通勤',
    createdBy: '小丽',
    createdAt: '2026-06-01'
  },
  {
    id: 'o2',
    name: '优雅约会套装',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20woman%20date%20outfit%20silk%20blouse%20skirt%20heels%20romantic&image_size=portrait_4_3',
    products: ['p4', 'p5', 'p6'],
    style: '优雅气质',
    occasion: '约会聚会',
    createdBy: '小美',
    createdAt: '2026-06-02'
  },
  {
    id: 'o3',
    name: '休闲周末风',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=casual%20weekend%20outfit%20sweater%20skirt%20relaxed%20style%20cozy&image_size=portrait_4_3',
    products: ['p2', 'p5'],
    style: '休闲时尚',
    occasion: '周末休闲',
    createdBy: '小丽',
    createdAt: '2026-06-03'
  }
];

export const fittingRecords: FittingRecord[] = [
  {
    id: 'f1',
    customerId: '1',
    customerName: '张雅婷',
    products: [
      { productId: 'p1', productName: '羊毛混纺双排扣大衣', size: 'M', color: '驼色' },
      { productId: 'p2', productName: '羊绒圆领针织衫', size: 'M', color: '米白' }
    ],
    status: 'purchased',
    createdAt: '2026-06-05 15:30',
    note: '顾客非常满意，直接购买'
  },
  {
    id: 'f2',
    customerId: '3',
    customerName: '王思琪',
    products: [
      { productId: 'p4', productName: '真丝缎面衬衫', size: 'S', color: '香槟色' },
      { productId: 'p5', productName: '复古格纹半身裙', size: 'S', color: '棕格' }
    ],
    status: 'trying',
    createdAt: '2026-06-07 11:20'
  },
  {
    id: 'f3',
    customerId: '2',
    customerName: '李明辉',
    products: [
      { productId: 'p3', productName: '高腰修身西装裤', size: '32', color: '黑色' }
    ],
    status: 'abandoned',
    createdAt: '2026-06-04 16:45',
    note: '尺寸不合适，已建议定制'
  }
];

export const performance: Performance = {
  monthTarget: 150000,
  monthCompleted: 86500,
  dayTarget: 5000,
  dayCompleted: 3580,
  customerCount: 28,
  conversionRate: 42,
  avgOrderValue: 1850,
  ranking: { current: 3, total: 12 },
  weeklyData: [
    { day: '周一', amount: 4200 },
    { day: '周二', amount: 3800 },
    { day: '周三', amount: 5600 },
    { day: '周四', amount: 4100 },
    { day: '周五', amount: 6200 },
    { day: '周六', amount: 8500 },
    { day: '周日', amount: 7200 }
  ],
  storeRanking: [
    { name: '南京东路旗舰店', amount: 256800, count: 156 },
    { name: '徐汇港汇店', amount: 198500, count: 132 },
    { name: '浦东陆家嘴店', amount: 175600, count: 118 },
    { name: '静安嘉里店', amount: 156200, count: 105 },
  ]
};

export const managerTasks: ManagerTask[] = [
  { id: 'mt1', title: '完成5套冬装搭配方案', description: '本周新品上市，需要搭配5套不同风格的造型', reward: 200, status: 'pending' },
  { id: 'mt2', title: '培训新人商品知识', description: '新入职导购需要熟悉新款大衣面料知识', reward: 150, status: 'completed' },
  { id: 'mt3', title: '整理仓库库存', description: '月底盘点前整理仓库，核对库存数量', reward: 100, status: 'pending' },
];
