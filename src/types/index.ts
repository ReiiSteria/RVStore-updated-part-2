export interface User {
  id: string;
  email: string;
  username: string;
  phone: string;
  createdAt: string;
  totalSpent: number;
  totalTransactions: number;
  isActive?: boolean;
  lastLogin?: string;
}

export interface Game {
  id: string;
  name: string;
  icon: string;
  category: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  gameId: string;
  name: string;
  denomination: string;
  price: number;
  cost: number;
  profit: number;
  isActive: boolean;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  playerInfo: {
    playerId: string;
    playerName?: string;
  };
}

export interface Transaction {
  id: string;
  orderId: string;
  userId: string;
  productId: string;
  amount: number;
  profit: number;
  status: 'completed' | 'refunded';
  completedAt: string;
  paymentMethod: string;
}

export interface DashboardStats {
  totalTransactions: number;
  netIncome: number;
  annualTarget: number;
  monthlyGrowth: number;
  totalOrders: number;
  completionRate: number;
}

export interface ChartData {
  name: string;
  value: number;
  profit?: number;
  month?: string;
  game?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'manager';
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}