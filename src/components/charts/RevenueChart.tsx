import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { transactions } from '../../data/mockData';

interface RevenueChartProps {
  dateRange?: 'today' | '7days' | '30days' | '1year';
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ dateRange = '30days' }) => {
  const data = useMemo(() => {
    // Get current time or use July 22, 2025 as reference
    const now = new Date();
    const referenceDate = new Date('2025-07-22');
    
    // Use reference date if current date is before July 22, 2025, otherwise use current time
    let currentTime = now < referenceDate ? new Date('2025-07-22T23:59:59') : now;
    let endDate = currentTime;
    
    let startDate: Date;
    let groupBy: 'hour' | 'day' | 'week' | 'month';
    
    switch (dateRange) {
      case 'today':
        // Today from 1:00 AM to 12:00 PM
        startDate = new Date('2025-07-22T01:00:00');
        endDate = new Date('2025-07-22T12:00:00');
        groupBy = 'hour';
        break;
      case '7days':
        // Exactly 7 days before current date
        startDate = new Date(currentTime);
        startDate.setDate(currentTime.getDate() - 6); // 7 days including today
        startDate.setHours(0, 0, 0, 0);
        groupBy = 'day';
        break;
      case '30days':
        // Exactly 30 days before current date
        startDate = new Date(currentTime);
        startDate.setDate(currentTime.getDate() - 29); // 30 days including today
        startDate.setHours(0, 0, 0, 0);
        groupBy = 'day';
        break;
      case '1year':
        startDate = new Date(2025, 0, 1); // January 1, 2025
        groupBy = 'month';
        break;
      default:
        startDate = new Date(currentTime);
        startDate.setDate(currentTime.getDate() - 29);
        startDate.setHours(0, 0, 0, 0);
        groupBy = 'day';
    }
    
    const filteredTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.completedAt);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
    
    if (groupBy === 'month') {
      // For yearly view, group by month and ensure proper ordering
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
      const monthlyData: Record<number, { name: string; value: number; profit: number }> = {};
      
      // Initialize all months from January to July
      for (let i = 0; i < 7; i++) {
        monthlyData[i] = {
          name: monthNames[i],
          value: 0,
          profit: 0
        };
      }
      
      // Aggregate data by month
      filteredTransactions.forEach(transaction => {
        const date = new Date(transaction.completedAt);
        const monthIndex = date.getMonth();
        
        if (monthIndex >= 0 && monthIndex <= 6) { // Only Jan-Jul
          monthlyData[monthIndex].value += transaction.amount;
          monthlyData[monthIndex].profit += transaction.profit;
        }
      });
      
      // Return ordered months
      return Object.keys(monthlyData)
        .map(key => monthlyData[parseInt(key)])
        .filter(month => month.value > 0 || month.name === 'Jan'); // Always show at least Jan
    }
    
    if (groupBy === 'hour') {
      // For today view, create hourly data from 1 AM to 12 PM
      const hourlyData: Record<number, { name: string; value: number; profit: number }> = {};
      
      // Initialize all hours from 1 to 12
      for (let hour = 1; hour <= 12; hour++) {
        hourlyData[hour] = {
          name: `${hour}:00`,
          value: 0,
          profit: 0
        };
      }
      
      // Aggregate data by hour
      filteredTransactions.forEach(transaction => {
        const date = new Date(transaction.completedAt);
        const hour = date.getHours();
        
        if (hour >= 1 && hour <= 12) {
          hourlyData[hour].value += transaction.amount;
          hourlyData[hour].profit += transaction.profit;
        }
      });
      
      // Return ordered hours from 1 to 12
      return Object.keys(hourlyData)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map(key => hourlyData[parseInt(key)]);
    }
    
    const groupedData = filteredTransactions.reduce((acc, transaction) => {
      const date = new Date(transaction.completedAt);
      let key: string;
      let name: string;
      
      switch (groupBy) {
        case 'day':
          key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          name = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          name = `Week ${Math.ceil(date.getDate() / 7)}`;
          break;
        default:
          key = date.toISOString().split('T')[0];
          name = date.toLocaleDateString('id-ID');
      }
      
      if (!acc[key]) {
        acc[key] = { name, value: 0, profit: 0 };
      }
      acc[key].value += transaction.amount;
      acc[key].profit += transaction.profit;
      return acc;
    }, {} as Record<string, { name: string; value: number; profit: number }>);
    
    // Sort by actual date for proper chronological order
    const sortedData = Object.entries(groupedData)
      .map(([key, data]) => ({ key, ...data }))
      .sort((a, b) => {
        if (groupBy === 'day') {
          return new Date(a.key).getTime() - new Date(b.key).getTime();
        }
        return a.key.localeCompare(b.key);
      })
      .map(({ key, ...data }) => data);
    
    return sortedData;
  }, [dateRange]);

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6B7280"
            fontSize={12}
            tickFormatter={(value) => `Rp ${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip 
            formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue']}
            labelStyle={{ color: '#374151' }}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#8B5CF6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};