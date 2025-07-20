import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { transactions, products, games } from '../../data/mockData';

const COLORS = [
  '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', 
  '#EF4444', '#8B5A2B', '#6366F1', '#EC4899'
];

interface GameDistributionChartProps {
  dateRange?: 'today' | '7days' | '30days' | '1year';
}

export const GameDistributionChart: React.FC<GameDistributionChartProps> = ({ dateRange = '30days' }) => {
  const data = useMemo(() => {
    // Get current time or use July 22, 2025 as reference
    const now = new Date();
    const referenceDate = new Date('2025-07-22');
    
    // Use reference date if current date is before July 22, 2025, otherwise use current time
    let currentTime = now < referenceDate ? new Date('2025-07-22T23:59:59') : now;
    let endDate = currentTime;
    
    let startDate: Date;
    
    switch (dateRange) {
      case 'today':
        // Today from 1:00 AM to 12:00 PM
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
    
    const filteredTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.completedAt);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
    
    const gameData = filteredTransactions.reduce((acc, transaction) => {
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

    return Object.entries(gameData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Sort by value descending
  }, [dateRange]);

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue']}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};