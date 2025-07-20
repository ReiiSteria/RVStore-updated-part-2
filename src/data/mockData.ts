import { User, Game, Product, Order, Transaction, DashboardStats } from '../types';

export const games: Game[] = [
  { id: '1', name: 'Free Fire', icon: '🔥', category: 'Battle Royale', isActive: true },
  { id: '2', name: 'Mobile Legends', icon: '⚔️', category: 'MOBA', isActive: true },
  { id: '3', name: 'Honor of Kings', icon: '👑', category: 'MOBA', isActive: true },
  { id: '4', name: 'Call of Duty Mobile', icon: '🎯', category: 'FPS', isActive: true },
  { id: '5', name: 'Clash of Clans', icon: '🏰', category: 'Strategy', isActive: true },
  { id: '6', name: 'Clash Royale', icon: '👑', category: 'Strategy', isActive: true },
  { id: '7', name: 'PUBG Mobile', icon: '🎮', category: 'Battle Royale', isActive: true },
  { id: '8', name: 'Genshin Impact', icon: '⭐', category: 'RPG', isActive: true },
  { id: '9', name: 'Wild Rift', icon: '🌟', category: 'MOBA', isActive: true },
  { id: '10', name: 'Valorant', icon: '🔫', category: 'FPS', isActive: true },
  { id: '11', name: 'Arena of Valor', icon: '⚡', category: 'MOBA', isActive: true },
  { id: '12', name: 'Brawl Stars', icon: '💥', category: 'Action', isActive: true },
];

export const products: Product[] = [
  // Free Fire
  { id: '1', gameId: '1', name: 'Free Fire Diamonds', denomination: '70 Diamonds', price: 12000, cost: 10000, profit: 2000, isActive: true },
  { id: '2', gameId: '1', name: 'Free Fire Diamonds', denomination: '140 Diamonds', price: 24000, cost: 20000, profit: 4000, isActive: true },
  { id: '3', gameId: '1', name: 'Free Fire Diamonds', denomination: '355 Diamonds', price: 60000, cost: 50000, profit: 10000, isActive: true },
  { id: '4', gameId: '1', name: 'Free Fire Diamonds', denomination: '720 Diamonds', price: 120000, cost: 100000, profit: 20000, isActive: true },
  
  // Mobile Legends
  { id: '5', gameId: '2', name: 'Mobile Legends Diamonds', denomination: '86 Diamonds', price: 20000, cost: 17000, profit: 3000, isActive: true },
  { id: '6', gameId: '2', name: 'Mobile Legends Diamonds', denomination: '172 Diamonds', price: 40000, cost: 34000, profit: 6000, isActive: true },
  { id: '7', gameId: '2', name: 'Mobile Legends Diamonds', denomination: '429 Diamonds', price: 99000, cost: 85000, profit: 14000, isActive: true },
  { id: '8', gameId: '2', name: 'Mobile Legends Diamonds', denomination: '878 Diamonds', price: 199000, cost: 170000, profit: 29000, isActive: true },
  
  // Honor of Kings
  { id: '9', gameId: '3', name: 'HOK Tokens', denomination: '60 Tokens', price: 15000, cost: 12500, profit: 2500, isActive: true },
  { id: '10', gameId: '3', name: 'HOK Tokens', denomination: '300 Tokens', price: 75000, cost: 63000, profit: 12000, isActive: true },
  { id: '11', gameId: '3', name: 'HOK Tokens', denomination: '980 Tokens', price: 240000, cost: 205000, profit: 35000, isActive: true },
  
  // CODM
  { id: '12', gameId: '4', name: 'CODM CP', denomination: '80 CP', price: 18000, cost: 15000, profit: 3000, isActive: true },
  { id: '13', gameId: '4', name: 'CODM CP', denomination: '400 CP', price: 89000, cost: 75000, profit: 14000, isActive: true },
  { id: '14', gameId: '4', name: 'CODM CP', denomination: '800 CP', price: 179000, cost: 152000, profit: 27000, isActive: true },
  
  // COC
  { id: '15', gameId: '5', name: 'COC Gems', denomination: '500 Gems', price: 65000, cost: 55000, profit: 10000, isActive: true },
  { id: '16', gameId: '5', name: 'COC Gems', denomination: '1200 Gems', price: 150000, cost: 128000, profit: 22000, isActive: true },
  { id: '17', gameId: '5', name: 'COC Gems', denomination: '2500 Gems', price: 299000, cost: 255000, profit: 44000, isActive: true },
  
  // Clash Royale
  { id: '18', gameId: '6', name: 'Clash Royale Gems', denomination: '500 Gems', price: 65000, cost: 55000, profit: 10000, isActive: true },
  { id: '19', gameId: '6', name: 'Clash Royale Gems', denomination: '1200 Gems', price: 150000, cost: 128000, profit: 22000, isActive: true },
  
  // PUBG Mobile
  { id: '20', gameId: '7', name: 'PUBG Mobile UC', denomination: '60 UC', price: 15000, cost: 12500, profit: 2500, isActive: true },
  { id: '21', gameId: '7', name: 'PUBG Mobile UC', denomination: '325 UC', price: 75000, cost: 63000, profit: 12000, isActive: true },
  { id: '22', gameId: '7', name: 'PUBG Mobile UC', denomination: '660 UC', price: 150000, cost: 128000, profit: 22000, isActive: true },
  
  // Genshin Impact
  { id: '23', gameId: '8', name: 'Genshin Impact Genesis Crystals', denomination: '60 Crystals', price: 15000, cost: 12500, profit: 2500, isActive: true },
  { id: '24', gameId: '8', name: 'Genshin Impact Genesis Crystals', denomination: '300 Crystals', price: 75000, cost: 63000, profit: 12000, isActive: true },
  { id: '25', gameId: '8', name: 'Genshin Impact Genesis Crystals', denomination: '980 Crystals', price: 240000, cost: 205000, profit: 35000, isActive: true },
  
  // Wild Rift
  { id: '26', gameId: '9', name: 'Wild Rift Wild Cores', denomination: '525 Cores', price: 75000, cost: 63000, profit: 12000, isActive: true },
  { id: '27', gameId: '9', name: 'Wild Rift Wild Cores', denomination: '1375 Cores', price: 189000, cost: 161000, profit: 28000, isActive: true },
  
  // Valorant
  { id: '28', gameId: '10', name: 'Valorant Points', denomination: '475 VP', price: 65000, cost: 55000, profit: 10000, isActive: true },
  { id: '29', gameId: '10', name: 'Valorant Points', denomination: '1000 VP', price: 135000, cost: 115000, profit: 20000, isActive: true },
  
  // Arena of Valor
  { id: '30', gameId: '11', name: 'AOV Vouchers', denomination: '60 Vouchers', price: 15000, cost: 12500, profit: 2500, isActive: true },
  { id: '31', gameId: '11', name: 'AOV Vouchers', denomination: '300 Vouchers', price: 75000, cost: 63000, profit: 12000, isActive: true },
  
  // Brawl Stars
  { id: '32', gameId: '12', name: 'Brawl Stars Gems', denomination: '80 Gems', price: 18000, cost: 15000, profit: 3000, isActive: true },
  { id: '33', gameId: '12', name: 'Brawl Stars Gems', denomination: '170 Gems', price: 35000, cost: 30000, profit: 5000, isActive: true },
];

export const users: User[] = [
  { id: '1', email: 'user1@gmail.com', username: 'gamer_pro', phone: '081234567890', createdAt: '2025-01-15', totalSpent: 450000, totalTransactions: 15 },
  { id: '2', email: 'user2@gmail.com', username: 'ml_legend', phone: '081234567891', createdAt: '2025-01-20', totalSpent: 320000, totalTransactions: 12 },
  { id: '3', email: 'user3@gmail.com', username: 'ff_master', phone: '081234567892', createdAt: '2025-02-01', totalSpent: 280000, totalTransactions: 8 },
  { id: '4', email: 'user4@gmail.com', username: 'cod_sniper', phone: '081234567893', createdAt: '2025-02-10', totalSpent: 520000, totalTransactions: 18 },
  { id: '5', email: 'user5@gmail.com', username: 'clash_king', phone: '081234567894', createdAt: '2025-02-15', totalSpent: 380000, totalTransactions: 14 },
  { id: '6', email: 'user6@gmail.com', username: 'hok_warrior', phone: '081234567895', createdAt: '2025-03-01', totalSpent: 290000, totalTransactions: 10 },
  { id: '7', email: 'user7@gmail.com', username: 'pubg_ace', phone: '081234567896', createdAt: '2025-03-05', totalSpent: 410000, totalTransactions: 16 },
  { id: '8', email: 'user8@gmail.com', username: 'genshin_fan', phone: '081234567897', createdAt: '2025-03-10', totalSpent: 350000, totalTransactions: 11 },
  { id: '9', email: 'user9@gmail.com', username: 'mobile_gamer', phone: '081234567898', createdAt: '2025-03-15', totalSpent: 480000, totalTransactions: 19 },
  { id: '10', email: 'user10@gmail.com', username: 'esports_pro', phone: '081234567899', createdAt: '2025-03-20', totalSpent: 390000, totalTransactions: 13 },
  { id: '11', email: 'user11@gmail.com', username: 'diamond_hunter', phone: '081234567800', createdAt: '2025-04-01', totalSpent: 310000, totalTransactions: 9 },
  { id: '12', email: 'user12@gmail.com', username: 'top_player', phone: '081234567801', createdAt: '2025-04-05', totalSpent: 440000, totalTransactions: 17 },
  { id: '13', email: 'user13@gmail.com', username: 'game_addict', phone: '081234567802', createdAt: '2025-04-10', totalSpent: 360000, totalTransactions: 12 },
  { id: '14', email: 'user14@gmail.com', username: 'royal_clash', phone: '081234567803', createdAt: '2025-04-15', totalSpent: 270000, totalTransactions: 7 },
  { id: '15', email: 'user15@gmail.com', username: 'legend_player', phone: '081234567804', createdAt: '2025-04-20', totalSpent: 500000, totalTransactions: 20 },
  { id: '16', email: 'user16@gmail.com', username: 'wild_rift_pro', phone: '081234567805', createdAt: '2025-05-01', totalSpent: 380000, totalTransactions: 14 },
  { id: '17', email: 'user17@gmail.com', username: 'valorant_ace', phone: '081234567806', createdAt: '2025-05-05', totalSpent: 420000, totalTransactions: 16 },
  { id: '18', email: 'user18@gmail.com', username: 'aov_master', phone: '081234567807', createdAt: '2025-05-10', totalSpent: 290000, totalTransactions: 11 },
  { id: '19', email: 'user19@gmail.com', username: 'brawl_champion', phone: '081234567808', createdAt: '2025-05-15', totalSpent: 340000, totalTransactions: 13 },
  { id: '20', email: 'user20@gmail.com', username: 'gaming_master', phone: '081234567809', createdAt: '2025-05-20', totalSpent: 460000, totalTransactions: 18 },
];

// Generate comprehensive transactions from January 1, 2025 to July 22, 2025
const generateTransactions2025 = (): Transaction[] => {
  const transactions: Transaction[] = [];
  let transactionId = 1;
  let orderId = 100;

  // Monthly data with realistic patterns (January to July 2025)
  const monthlyData = [
    { month: 1, name: 'Jan', transactions: 85, avgAmount: 45000, variation: 0.9 }, // New Year boost
    { month: 2, name: 'Feb', transactions: 72, avgAmount: 42000, variation: 0.8 }, // Post-holiday dip
    { month: 3, name: 'Mar', transactions: 95, avgAmount: 48000, variation: 1.1 }, // Spring increase
    { month: 4, name: 'Apr', transactions: 88, avgAmount: 46000, variation: 1.0 }, // Stable
    { month: 5, name: 'May', transactions: 102, avgAmount: 52000, variation: 1.2 }, // Mid-year peak
    { month: 6, name: 'Jun', transactions: 78, avgAmount: 44000, variation: 0.9 }, // Summer decline
    { month: 7, name: 'Jul', transactions: 65, avgAmount: 41000, variation: 0.8 }, // Mid-summer (until July 22)
  ];

  monthlyData.forEach(monthData => {
    const daysInMonth = monthData.month === 7 ? 22 : new Date(2025, monthData.month, 0).getDate();
    const transactionsPerDay = Math.ceil(monthData.transactions / daysInMonth);
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dailyTransactions = Math.max(1, Math.floor(transactionsPerDay + (Math.random() - 0.5) * 4));
      
      for (let i = 0; i < dailyTransactions; i++) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const randomUser = users[Math.floor(Math.random() * users.length)];
        
        // Indonesian payment methods
        const paymentMethods = [
          'Dana', 'GoPay', 'OVO', 'ShopeePay', 'LinkAja',
          'BCA Transfer', 'BRI Transfer', 'BNI Transfer', 'Mandiri Transfer', 
          'CIMB Transfer', 'Permata Transfer', 'Danamon Transfer', 'BSI Transfer'
        ];
        const randomPayment = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        
        // Add variation to amounts
        const baseAmount = randomProduct.price;
        const variationFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2 variation
        const amount = Math.round(baseAmount * variationFactor * monthData.variation);
        const profit = Math.round(amount * 0.15 + (Math.random() * amount * 0.1)); // 15-25% profit margin
        
        // Random hour and minute
        const hour = Math.floor(Math.random() * 24);
        const minute = Math.floor(Math.random() * 60);
        const second = Math.floor(Math.random() * 60);
        
        const completedAt = `2025-${monthData.month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}Z`;
        
        transactions.push({
          id: transactionId.toString(),
          orderId: orderId.toString(),
          userId: randomUser.id,
          productId: randomProduct.id,
          amount,
          profit,
          status: 'completed',
          completedAt,
          paymentMethod: randomPayment
        });
        
        transactionId++;
        orderId++;
      }
    }
  });

  return transactions.sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());
};

export const transactions: Transaction[] = generateTransactions2025();

// Generate orders based on transactions (recent ones)
export const orders: Order[] = [
  { id: '1', userId: '1', productId: '1', quantity: 1, totalAmount: 12000, status: 'pending', createdAt: '2025-07-22T10:30:00Z', updatedAt: '2025-07-22T10:30:00Z', playerInfo: { playerId: '123456789', playerName: 'ProGamer' } },
  { id: '2', userId: '2', productId: '5', quantity: 2, totalAmount: 40000, status: 'processing', createdAt: '2025-07-22T11:15:00Z', updatedAt: '2025-07-22T11:20:00Z', playerInfo: { playerId: '987654321', playerName: 'MLLegend' } },
  { id: '3', userId: '3', productId: '2', quantity: 1, totalAmount: 24000, status: 'completed', createdAt: '2025-07-21T14:20:00Z', updatedAt: '2025-07-21T14:25:00Z', playerInfo: { playerId: '456789123', playerName: 'FFMaster' } },
  { id: '4', userId: '4', productId: '12', quantity: 1, totalAmount: 18000, status: 'completed', createdAt: '2025-07-21T16:45:00Z', updatedAt: '2025-07-21T16:50:00Z', playerInfo: { playerId: '789123456', playerName: 'CODSniper' } },
  { id: '5', userId: '5', productId: '15', quantity: 1, totalAmount: 65000, status: 'processing', createdAt: '2025-07-22T09:10:00Z', updatedAt: '2025-07-22T09:15:00Z', playerInfo: { playerId: '321654987', playerName: 'ClashKing' } },
  { id: '6', userId: '6', productId: '9', quantity: 3, totalAmount: 45000, status: 'completed', createdAt: '2025-07-20T13:30:00Z', updatedAt: '2025-07-20T13:35:00Z', playerInfo: { playerId: '654987321', playerName: 'HOKWarrior' } },
  { id: '7', userId: '7', productId: '20', quantity: 1, totalAmount: 15000, status: 'failed', createdAt: '2025-07-22T12:00:00Z', updatedAt: '2025-07-22T12:05:00Z', playerInfo: { playerId: '147258369', playerName: 'PUBGAce' } },
  { id: '8', userId: '8', productId: '23', quantity: 1, totalAmount: 15000, status: 'completed', createdAt: '2025-07-19T15:20:00Z', updatedAt: '2025-07-19T15:25:00Z', playerInfo: { playerId: '369258147', playerName: 'GenshinFan' } },
  { id: '9', userId: '16', productId: '26', quantity: 1, totalAmount: 75000, status: 'completed', createdAt: '2025-07-18T10:30:00Z', updatedAt: '2025-07-18T10:35:00Z', playerInfo: { playerId: '159753486', playerName: 'WildRiftPro' } },
  { id: '10', userId: '17', productId: '28', quantity: 1, totalAmount: 65000, status: 'completed', createdAt: '2025-07-17T14:20:00Z', updatedAt: '2025-07-17T14:25:00Z', playerInfo: { playerId: '486159753', playerName: 'ValorantAce' } },
];

export const dashboardStats: DashboardStats = {
  totalTransactions: transactions.length,
  netIncome: transactions.reduce((sum, t) => sum + t.amount, 0),
  annualTarget: 50000000, // 50 juta target tahunan
  monthlyGrowth: 15.5,
  totalOrders: orders.length,
  completionRate: 75,
};

// Helper functions untuk generate chart data
export const getMonthlyRevenue = () => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.completedAt);
    const monthIndex = date.getMonth();
    const monthKey = monthIndex;
    
    if (!acc[monthKey]) {
      acc[monthKey] = { 
        month: monthNames[monthIndex], 
        revenue: 0, 
        profit: 0, 
        transactions: 0,
        monthIndex 
      };
    }
    acc[monthKey].revenue += transaction.amount;
    acc[monthKey].profit += transaction.profit;
    acc[monthKey].transactions += 1;
    return acc;
  }, {} as Record<number, { month: string; revenue: number; profit: number; transactions: number; monthIndex: number }>);

  // Only include months from January to July (0-6)
  const result = [];
  for (let i = 0; i <= 6; i++) {
    if (monthlyData[i]) {
      result.push({
        name: monthlyData[i].month,
        value: monthlyData[i].revenue,
        profit: monthlyData[i].profit,
      });
    } else {
      result.push({
        name: monthNames[i],
        value: 0,
        profit: 0,
      });
    }
  }

  return result;
};

export const getGameDistribution = () => {
  const gameData = transactions.reduce((acc, transaction) => {
    const product = products.find(p => p.id === transaction.productId);
    const game = games.find(g => g.id === product?.gameId);
    if (game) {
      if (!acc[game.name]) {
        acc[game.name] = 0;
      }
      acc[game.name] += transaction.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(gameData).map(([name, value]) => ({
    name,
    value,
  }));
};

export const getGameProfitAnalysis = () => {
  const profitData = transactions.reduce((acc, transaction) => {
    const product = products.find(p => p.id === transaction.productId);
    const game = games.find(g => g.id === product?.gameId);
    if (game) {
      if (!acc[game.name]) {
        acc[game.name] = { revenue: 0, profit: 0 };
      }
      acc[game.name].revenue += transaction.amount;
      acc[game.name].profit += transaction.profit;
    }
    return acc;
  }, {} as Record<string, { revenue: number; profit: number }>);

  return Object.entries(profitData).map(([game, data]) => ({
    name: game,
    revenue: data.revenue,
    profit: data.profit,
  }));
};

// Product state management
let productState = [...products];

export const updateProduct = (productId: string, updates: Partial<Product>) => {
  const index = productState.findIndex(p => p.id === productId);
  if (index !== -1) {
    productState[index] = { ...productState[index], ...updates };
    // Recalculate profit if price or cost changed
    if (updates.price !== undefined || updates.cost !== undefined) {
      productState[index].profit = productState[index].price - productState[index].cost;
    }
  }
  return productState[index];
};

export const addProduct = (newProduct: Omit<Product, 'id'>) => {
  const id = (Math.max(...productState.map(p => parseInt(p.id))) + 1).toString();
  const product: Product = {
    ...newProduct,
    id,
    profit: newProduct.price - newProduct.cost
  };
  productState.push(product);
  return product;
};

export const deleteProduct = (productId: string) => {
  productState = productState.filter(p => p.id !== productId);
  return true;
};

export const getProducts = () => productState;