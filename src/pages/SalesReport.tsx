import React, { useState, useMemo } from 'react';
import { Download, TrendingUp, DollarSign, Target, Users, Package } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RevenueChart } from '../components/charts/RevenueChart';
import { GameDistributionChart } from '../components/charts/GameDistributionChart';
import { ProfitAnalysisChart } from '../components/charts/ProfitAnalysisChart';
import { ProductSalesChart } from '../components/charts/ProductSalesChart';
import { transactions, products, games, users } from '../data/mockData';

type DateRange = 'today' | '7days' | '30days' | '1year';

export const SalesReport: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>('30days');
  const [selectedGameForPackages, setSelectedGameForPackages] = useState('all');

  const filteredData = useMemo(() => {
    // Get current time or use July 22, 2025 as reference
    const now = new Date();
    const referenceDate = new Date('2025-07-22');
    
    // Use reference date if current date is before July 22, 2025, otherwise use current time
    let currentTime = now < referenceDate ? new Date('2025-07-22T23:59:59') : now;
    
    let startDate: Date;
    let endDate: Date = currentTime;
    
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
      const date = new Date(t.completedAt);
      return date >= startDate && date <= endDate;
    });
  }, [dateRange]);

  const getSalesStats = () => {
    const totalRevenue = filteredData.reduce((sum, t) => sum + t.amount, 0);
    const totalProfit = filteredData.reduce((sum, t) => sum + t.profit, 0);
    const totalTransactions = filteredData.length;
    const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    
    return {
      totalRevenue,
      totalProfit,
      totalTransactions,
      avgOrderValue,
      profitMargin
    };
  };

  const getTopProducts = () => {
    const productStats = products.map(product => {
      const productTransactions = filteredData.filter(t => t.productId === product.id);
      const totalSold = productTransactions.length;
      const totalRevenue = productTransactions.reduce((sum, t) => sum + t.amount, 0);
      const game = games.find(g => g.id === product.gameId);
      
      return {
        ...product,
        game,
        totalSold,
        totalRevenue
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5);
    
    return productStats;
  };

  const getTopGames = () => {
    const gameStats = games.map(game => {
      const gameProducts = products.filter(p => p.gameId === game.id);
      const gameTransactions = filteredData.filter(t => 
        gameProducts.some(p => p.id === t.productId)
      );
      const totalRevenue = gameTransactions.reduce((sum, t) => sum + t.amount, 0);
      const totalTransactions = gameTransactions.length;
      
      return {
        ...game,
        totalRevenue,
        totalTransactions
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);
    
    return gameStats;
  };

  const getPaymentMethodStats = () => {
    const paymentStats = filteredData.reduce((acc, transaction) => {
      if (!acc[transaction.paymentMethod]) {
        acc[transaction.paymentMethod] = { count: 0, amount: 0 };
      }
      acc[transaction.paymentMethod].count++;
      acc[transaction.paymentMethod].amount += transaction.amount;
      return acc;
    }, {} as Record<string, { count: number; amount: number }>);
    
    return Object.entries(paymentStats).map(([method, stats]) => ({
      method,
      ...stats
    })).sort((a, b) => b.amount - a.amount);
  };

  const getDetailedPackageAnalysis = (gameId?: string) => {
    let filteredProducts = products;
    
    if (gameId && gameId !== 'all') {
      filteredProducts = products.filter(p => p.gameId === gameId);
    }

    return filteredProducts.map(product => {
      const game = games.find(g => g.id === product.gameId);
      const productTransactions = filteredData.filter(t => t.productId === product.id);
      const totalSold = productTransactions.length;
      const totalRevenue = productTransactions.reduce((sum, t) => sum + t.amount, 0);
      const totalProfit = productTransactions.reduce((sum, t) => sum + t.profit, 0);
      const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue * 100) : 0;
      const avgSellingPrice = totalSold > 0 ? totalRevenue / totalSold : 0;
      const totalCost = totalSold * product.cost;
      const roi = totalCost > 0 ? (totalProfit / totalCost * 100) : 0;
      
      return {
        id: product.id,
        gameName: game?.name,
        gameIcon: game?.icon,
        denomination: product.denomination,
        unitPrice: product.price,
        unitCost: product.cost,
        unitProfit: product.profit,
        unitMargin: (product.profit / product.price * 100),
        totalSold,
        totalRevenue,
        totalCost,
        totalProfit,
        profitMargin,
        avgSellingPrice,
        roi,
        marketShare: 0 // Will be calculated after
      };
    }).filter(item => item.totalSold > 0)
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  };

  const packageAnalysis = getDetailedPackageAnalysis(selectedGameForPackages);
  const totalMarketRevenue = packageAnalysis.reduce((sum, item) => sum + item.totalRevenue, 0);
  
  // Calculate market share
  packageAnalysis.forEach(item => {
    item.marketShare = totalMarketRevenue > 0 ? (item.totalRevenue / totalMarketRevenue * 100) : 0;
  });

  const stats = getSalesStats();
  const topProducts = getTopProducts();
  const topGames = getTopGames();
  const paymentMethods = getPaymentMethodStats();

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case 'today': return 'Today';
      case '7days': return 'Last 7 Days';
      case '30days': return 'Last 30 Days';
      case '1year': return 'Last Year';
      default: return 'Last 30 Days';
    }
  };

  const exportReport = () => {
    const reportData = {
      period: getDateRangeLabel(),
      stats,
      topProducts: topProducts.map(p => ({
        game: p.game?.name,
        product: p.denomination,
        sold: p.totalSold,
        revenue: p.totalRevenue
      })),
      paymentMethods: paymentMethods.map(p => ({
        method: p.method,
        transactions: p.count,
        amount: p.amount
      })),
      packageAnalysis: packageAnalysis.slice(0, 10).map(p => ({
        game: p.gameName,
        package: p.denomination,
        unitPrice: p.unitPrice,
        unitCost: p.unitCost,
        unitProfit: p.unitProfit,
        sold: p.totalSold,
        revenue: p.totalRevenue,
        profit: p.totalProfit,
        roi: p.roi
      }))
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `sales-report-${getDateRangeLabel().replace(/\s+/g, '-').toLowerCase()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Report</h1>
            <p className="text-gray-600 mt-1">Comprehensive sales analytics and insights</p>
          </div>
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value as DateRange);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="1year">Last Year</option>
            </select>
            <Button onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Period Indicator */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-800 text-sm font-medium">
            📊 Sales Report for: <span className="font-bold">{getDateRangeLabel()}</span>
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    Rp {(stats.totalRevenue / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-sm text-green-600">+12.5%</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Profit</p>
                  <p className="text-2xl font-bold text-gray-900">
                    Rp {(stats.totalProfit / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-sm text-green-600">+15.3%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
                  <p className="text-sm text-green-600">+8.2%</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    Rp {(stats.avgOrderValue / 1000).toFixed(0)}K
                  </p>
                  <p className="text-sm text-green-600">+5.1%</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.profitMargin.toFixed(1)}%</p>
                  <p className="text-sm text-green-600">+2.1%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <p className="text-sm text-gray-600">Revenue analysis for {getDateRangeLabel()}</p>
            </CardHeader>
            <CardContent>
              <RevenueChart dateRange={dateRange} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Game Distribution</CardTitle>
              <p className="text-sm text-gray-600">Revenue distribution by game for {getDateRangeLabel()}</p>
            </CardHeader>
            <CardContent>
              <GameDistributionChart dateRange={dateRange} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Game Profit Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfitAnalysisChart />
          </CardContent>
        </Card>

        {/* Package Sales Analysis */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Package Sales Performance</CardTitle>
                <p className="text-sm text-gray-600">Detailed analysis by individual product packages for {getDateRangeLabel().toLowerCase()}</p>
              </div>
              <select
                value={selectedGameForPackages}
                onChange={(e) => setSelectedGameForPackages(e.target.value)}
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
            <ProductSalesChart gameId={selectedGameForPackages} />
          </CardContent>
        </Card>

        {/* Detailed Package Analysis Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Detailed Package Analysis
            </CardTitle>
            <p className="text-sm text-gray-600">
              Comprehensive benefit, margin, and ROI analysis for each product package for {getDateRangeLabel().toLowerCase()}
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Cost</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Profit</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Margin</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units Sold</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Revenue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Profit</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ROI</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Market Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {packageAnalysis.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{item.gameIcon}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.gameName}</div>
                            <div className="text-sm text-gray-500">{item.denomination}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        Rp {item.unitPrice.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        Rp {item.unitCost.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-green-600">
                        Rp {item.unitProfit.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-sm font-medium ${
                          item.unitMargin >= 20 ? 'text-green-600' : 
                          item.unitMargin >= 10 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {item.unitMargin.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {item.totalSold}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-purple-600">
                        Rp {item.totalRevenue.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        Rp {item.totalCost.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-green-600">
                        Rp {item.totalProfit.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-sm font-medium ${
                          item.roi >= 50 ? 'text-green-600' : 
                          item.roi >= 25 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {item.roi.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(item.marketShare, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {item.marketShare.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Sold
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topProducts.map((product, index) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{product.game?.icon}</span>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {product.game?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {product.denomination}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {product.totalSold}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          Rp {product.totalRevenue.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Transactions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paymentMethods.map((payment, index) => (
                      <tr key={payment.method}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {payment.method}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {payment.count}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          Rp {payment.amount.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};