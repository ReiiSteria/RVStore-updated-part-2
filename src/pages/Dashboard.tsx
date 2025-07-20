import React, { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, Target, ShoppingCart, Users, Activity, Package } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { RevenueChart } from '../components/charts/RevenueChart';
import { GameDistributionChart } from '../components/charts/GameDistributionChart';
import { ProfitAnalysisChart } from '../components/charts/ProfitAnalysisChart';
import { ProductSalesChart } from '../components/charts/ProductSalesChart';
import { dashboardStats, transactions, users, products, games } from '../data/mockData';

type DateRange = 'today' | '7days' | '30days' | '1year';

export const Dashboard: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange>('30days');
  
  const filteredData = useMemo(() => {
    // Get current time or use July 22, 2025 as reference
    const now = new Date();
    const referenceDate = new Date('2025-07-22');
    
    // Use reference date if current date is before July 22, 2025, otherwise use current time
    let currentTime = now < referenceDate ? new Date('2025-07-22T23:59:59') : now;
    let endDate = currentTime;
    
    let startDate: Date;
    
    switch (dateRange) {
      case 'today':
        // Today from 1:00 AM to 12:00 PM (noon)
        startDate = new Date('2025-07-22T01:00:00');
        endDate = new Date('2025-07-22T12:00:00');
        break;
      case '7days':
        // Exactly 7 days before current date
        startDate = new Date(currentTime);
        startDate.setDate(currentTime.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        break;
      case '30days':
        // Exactly 30 days before current date
        startDate = new Date(currentTime);
        startDate.setDate(currentTime.getDate() - 29);
        startDate.setHours(0, 0, 0, 0);
        break;
      case '1year':
        startDate = new Date(2025, 0, 1); // January 1, 2025
        break;
      default:
        startDate = new Date(currentTime);
        startDate.setDate(currentTime.getDate() - 29);
        startDate.setHours(0, 0, 0, 0);
    }
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.completedAt);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }, [dateRange]);
  
  const filteredStats = useMemo(() => {
    const totalTransactions = filteredData.length;
    const netIncome = filteredData.reduce((sum, t) => sum + t.amount, 0);
    const totalProfit = filteredData.reduce((sum, t) => sum + t.profit, 0);
    
    // Calculate growth (comparing with previous period)
    const now = new Date('2025-07-22T23:59:59');
    let previousStartDate: Date;
    let currentStartDate: Date;
    
    switch (dateRange) {
      case 'today':
        currentStartDate = new Date('2025-07-22T00:00:00');
        previousStartDate = new Date('2025-07-21T00:00:00');
        break;
      case '7days':
        currentStartDate = new Date('2025-07-15T00:00:00');
        previousStartDate = new Date('2025-07-08T00:00:00');
        break;
      case '30days':
        currentStartDate = new Date('2025-06-22T00:00:00');
        previousStartDate = new Date('2025-05-23T00:00:00');
        break;
      case '1year':
        currentStartDate = new Date(2025, 0, 1);
        previousStartDate = new Date(2024, 0, 1);
        break;
      default:
        currentStartDate = new Date('2025-06-22T00:00:00');
        previousStartDate = new Date('2025-05-23T00:00:00');
    }
    
    const previousData = transactions.filter(t => {
      const date = new Date(t.completedAt);
      return date >= previousStartDate && date < currentStartDate;
    });
    
    const previousIncome = previousData.reduce((sum, t) => sum + t.amount, 0);
    const incomeGrowth = previousIncome > 0 ? ((netIncome - previousIncome) / previousIncome * 100) : 0;
    
    return {
      totalTransactions,
      netIncome,
      totalProfit,
      incomeGrowth: incomeGrowth.toFixed(1)
    };
  }, [filteredData, dateRange]);

  const totalProfit = filteredData.reduce((sum, t) => sum + t.profit, 0);
  const targetProgress = (dashboardStats.netIncome / dashboardStats.annualTarget) * 100;

  const getProductPackageStats = (gameId?: string) => {
    let filteredProducts = products;
    
    if (gameId && gameId !== 'all') {
      filteredProducts = products.filter(p => p.gameId === gameId);
    }

    return filteredProducts.map(product => {
      const game = games.find(g => g.id === product.gameId);
      const productTransactions = transactions.filter(t => t.productId === product.id);
      const totalSold = productTransactions.length;
      const totalRevenue = productTransactions.reduce((sum, t) => sum + t.amount, 0);
      const totalProfit = productTransactions.reduce((sum, t) => sum + t.profit, 0);
      const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue * 100) : 0;
      
      return {
        id: product.id,
        name: `${game?.name} - ${product.denomination}`,
        gameName: game?.name,
        denomination: product.denomination,
        unitPrice: product.price,
        unitProfit: product.profit,
        unitMargin: (product.profit / product.price * 100),
        totalSold,
        totalRevenue,
        totalProfit,
        profitMargin
      };
    }).filter(item => item.totalSold > 0)
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  };

  const productStats = getProductPackageStats(selectedGame);
  const topProducts = productStats.slice(0, 5);

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case 'today': return 'Today';
      case '7days': return 'Last 7 Days';
      case '30days': return 'Last 30 Days';
      case '1year': return 'Last Year';
      default: return 'Last 30 Days';
    }
  };

  const stats = [
    {
      title: 'Total Transactions',
      value: filteredStats.totalTransactions.toString(),
      icon: Activity,
      color: 'from-blue-500 to-blue-600',
      change: `+${filteredStats.incomeGrowth}%`
    },
    {
      title: 'Net Income',
      value: `Rp ${(filteredStats.netIncome / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      change: `+${filteredStats.incomeGrowth}%`
    },
    {
      title: 'Total Profit',
      value: `Rp ${(filteredStats.totalProfit / 1000000).toFixed(1)}M`,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      change: '+15.3%'
    },
    {
      title: 'Annual Target',
      value: `${targetProgress.toFixed(1)}%`,
      icon: Target,
      color: 'from-orange-500 to-orange-600',
      change: `${targetProgress.toFixed(1)}% of ${(dashboardStats.annualTarget / 1000000).toFixed(0)}M`
    },
    {
      title: 'Active Orders',
      value: dashboardStats.totalOrders.toString(),
      icon: ShoppingCart,
      color: 'from-indigo-500 to-indigo-600',
      change: '+5.1%'
    },
    {
      title: 'Total Users',
      value: users.length.toString(),
      icon: Users,
      color: 'from-pink-500 to-pink-600',
      change: '+3.2%'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
          </div>
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Period Indicator */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-800 text-sm font-medium">
            📊 Showing data for: <span className="font-bold">{getDateRangeLabel()}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} hover>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Revenue Trend</CardTitle>
              <p className="text-sm text-gray-600">Revenue analysis for {getDateRangeLabel().toLowerCase()}</p>
            </CardHeader>
            <CardContent>
              <RevenueChart dateRange={dateRange} />
            </CardContent>
          </Card>

          {/* Game Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Game Distribution</CardTitle>
              <p className="text-sm text-gray-600">Revenue distribution by game for {getDateRangeLabel().toLowerCase()}</p>
            </CardHeader>
            <CardContent>
              <GameDistributionChart dateRange={dateRange} />
            </CardContent>
          </Card>
        </div>

        {/* Product Package Sales Analysis */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Product Package Sales Analysis</CardTitle>
                <p className="text-sm text-gray-600">Sales performance by individual product packages</p>
              </div>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Games</option>
                {games.map(game => (
                  <option key={game.id} value={game.id}>{game.name}</option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <ProductSalesChart gameId={selectedGame} />
          </CardContent>
        </Card>

        {/* Top Product Packages Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Top Product Packages Performance
            </CardTitle>
            <p className="text-sm text-gray-600">
              {selectedGame === 'all' ? 'All games' : games.find(g => g.id === selectedGame)?.name} - 
              Detailed sales and margin analysis by package
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Profit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Margin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units Sold</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Profit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topProducts.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.gameName}</div>
                          <div className="text-sm text-gray-500">{product.denomination}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Rp {product.unitPrice.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-green-600">
                        Rp {product.unitProfit.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${
                          product.unitMargin >= 20 ? 'text-green-600' : 
                          product.unitMargin >= 10 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {product.unitMargin.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.totalSold}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-purple-600">
                        Rp {product.totalRevenue.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-green-600">
                        Rp {product.totalProfit.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${
                          product.profitMargin >= 20 ? 'text-green-600' : 
                          product.profitMargin >= 10 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {product.profitMargin.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Profit Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Game Profit Analysis</CardTitle>
            <p className="text-sm text-gray-600">Revenue vs Profit comparison by game</p>
          </CardHeader>
          <CardContent>
            <ProfitAnalysisChart />
          </CardContent>
        </Card>

        {/* Target Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Annual Target Progress</CardTitle>
            <p className="text-sm text-gray-600">Progress towards annual revenue target</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Current Progress</span>
                <span className="text-sm font-bold text-purple-600">{targetProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(targetProgress, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Rp {(dashboardStats.netIncome / 1000000).toFixed(1)}M achieved</span>
                <span>Target: Rp {(dashboardStats.annualTarget / 1000000).toFixed(0)}M</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};