import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { products, games, transactions } from '../../data/mockData';

interface ProductSalesChartProps {
  gameId?: string;
}

export const ProductSalesChart: React.FC<ProductSalesChartProps> = ({ gameId }) => {
  const getProductSalesData = () => {
    let filteredProducts = products;
    
    if (gameId && gameId !== 'all') {
      filteredProducts = products.filter(p => p.gameId === gameId);
    }

    const productData = filteredProducts.map(product => {
      const game = games.find(g => g.id === product.gameId);
      const productTransactions = transactions.filter(t => t.productId === product.id);
      const totalSold = productTransactions.length;
      const totalRevenue = productTransactions.reduce((sum, t) => sum + t.amount, 0);
      const totalProfit = productTransactions.reduce((sum, t) => sum + t.profit, 0);
      const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue * 100) : 0;
      
      return {
        name: `${game?.name} - ${product.denomination}`,
        shortName: product.denomination,
        gameName: game?.name,
        totalSold,
        revenue: totalRevenue,
        profit: totalProfit,
        profitMargin: profitMargin,
        unitPrice: product.price,
        unitProfit: product.profit
      };
    }).filter(item => item.totalSold > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10); // Top 10 products

    return productData;
  };

  const data = getProductSalesData();

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="shortName" 
            stroke="#6B7280"
            fontSize={11}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis 
            stroke="#6B7280"
            fontSize={12}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip 
            formatter={(value: number, name: string) => {
              if (name === 'revenue') return [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue'];
              if (name === 'profit') return [`Rp ${value.toLocaleString('id-ID')}`, 'Profit'];
              if (name === 'totalSold') return [value, 'Units Sold'];
              return [value, name];
            }}
            labelFormatter={(label) => {
              const item = data.find(d => d.shortName === label);
              return item ? `${item.gameName} - ${item.shortName}` : label;
            }}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Bar dataKey="revenue" fill="#3B82F6" name="revenue" radius={[2, 2, 0, 0]} />
          <Bar dataKey="profit" fill="#8B5CF6" name="profit" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};