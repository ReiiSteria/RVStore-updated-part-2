import { useState } from 'react';
import { transactions, getProducts, games, users, dashboardStats } from '../data/mockData';

interface ChatbotHook {
  sendMessage: (message: string) => Promise<string>;
  isLoading: boolean;
}

export const useChatbot = (): ChatbotHook => {
  const [isLoading, setIsLoading] = useState(false);

  const generateSalesContext = () => {
    const products = getProducts();
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalProfit = transactions.reduce((sum, t) => sum + t.profit, 0);
    const totalTransactions = transactions.length;
    const avgOrderValue = totalRevenue / totalTransactions;
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.totalTransactions > 0).length;

    // Game performance dengan detail lengkap
    const gamePerformance = games.map(game => {
      const gameProducts = products.filter(p => p.gameId === game.id);
      const gameTransactions = transactions.filter(t => 
        gameProducts.some(p => p.id === t.productId)
      );
      const gameRevenue = gameTransactions.reduce((sum, t) => sum + t.amount, 0);
      const gameProfit = gameTransactions.reduce((sum, t) => sum + t.profit, 0);
      const uniqueUsers = [...new Set(gameTransactions.map(t => t.userId))].length;
      const profitMargin = gameRevenue > 0 ? (gameProfit / gameRevenue * 100) : 0;
      
      return {
        name: game.name,
        category: game.category,
        revenue: gameRevenue,
        profit: gameProfit,
        profitMargin,
        transactions: gameTransactions.length,
        avgTransaction: gameTransactions.length > 0 ? gameRevenue / gameTransactions.length : 0,
        uniqueUsers
      };
    }).sort((a, b) => b.revenue - a.revenue);

    // Top dan worst performing games
    const topGames = gamePerformance.filter(g => g.transactions > 0).slice(0, 3);
    const worstGames = gamePerformance.filter(g => g.transactions > 0).slice(-3).reverse();

    // Product performance
    const allProducts = products.map(product => {
      const productTransactions = transactions.filter(t => t.productId === product.id);
      const revenue = productTransactions.reduce((sum, t) => sum + t.amount, 0);
      const profit = productTransactions.reduce((sum, t) => sum + t.profit, 0);
      const game = games.find(g => g.id === product.gameId);
      const uniqueUsers = [...new Set(productTransactions.map(t => t.userId))].length;
      const profitMargin = revenue > 0 ? (profit / revenue * 100) : 0;
      
      return {
        id: product.id,
        name: `${game?.name} - ${product.denomination}`,
        gameName: game?.name,
        denomination: product.denomination,
        unitPrice: product.price,
        unitCost: product.cost,
        unitProfit: product.profit,
        unitMargin: (product.profit / product.price * 100),
        revenue,
        sold: productTransactions.length,
        profit,
        profitMargin,
        uniqueUsers
      };
    }).sort((a, b) => b.revenue - a.revenue);

    const productPerformance = allProducts.filter(p => p.sold > 0);

    // Monthly analysis
    const monthlyData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.completedAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = { 
          name: monthName, 
          revenue: 0, 
          profit: 0, 
          transactions: 0,
          games: {} as Record<string, { revenue: number, transactions: number }>
        };
      }
      
      acc[monthKey].revenue += transaction.amount;
      acc[monthKey].profit += transaction.profit;
      acc[monthKey].transactions += 1;

      // Track per game per month
      const product = products.find(p => p.id === transaction.productId);
      const game = games.find(g => g.id === product?.gameId);
      if (game) {
        if (!acc[monthKey].games[game.name]) {
          acc[monthKey].games[game.name] = { revenue: 0, transactions: 0 };
        }
        acc[monthKey].games[game.name].revenue += transaction.amount;
        acc[monthKey].games[game.name].transactions += 1;
      }

      return acc;
    }, {} as Record<string, any>);

    const sortedMonths = Object.values(monthlyData).sort((a: any, b: any) => 
      new Date(a.name).getTime() - new Date(b.name).getTime()
    );

    // Payment methods
    const paymentMethods = transactions.reduce((acc, t) => {
      acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRevenue,
      totalProfit,
      totalTransactions,
      avgOrderValue,
      totalUsers,
      activeUsers,
      gamePerformance,
      topGames,
      worstGames,
      topProducts: productPerformance.slice(0, 10),
      worstProducts: productPerformance.slice(-5).reverse(),
      allProducts,
      monthlyData: sortedMonths,
      paymentMethods,
      games,
      products,
      users,
      transactions,
      content: 'Halo! Saya adalah asisten AI untuk RVS. Saya dapat membantu Anda menganalisis data penjualan, memberikan insight bisnis, dan menjawab pertanyaan tentang performa toko. Apa yang ingin Anda ketahui?',
      profitMargin: (totalProfit / totalRevenue * 100).toFixed(1)
    };
  };

  const getDetailedAnswer = (message: string, context: any) => {
    const lowerMessage = message.toLowerCase();

    // Comprehensive database queries - can answer ANY question about the data
    
    // Margin questions for specific games
    if (lowerMessage.includes('margin') && (lowerMessage.includes('game') || games.some(g => lowerMessage.includes(g.name.toLowerCase())))) {
      const gameQuery = games.find(g => lowerMessage.includes(g.name.toLowerCase()));
      if (gameQuery) {
        const gameData = context.gamePerformance.find((g: any) => g.name === gameQuery.name);
        if (gameData) {
          return `💰 **Margin ${gameData.name}:**

📊 **Detail Margin:**
• Profit Margin: ${gameData.profitMargin.toFixed(1)}%
• Total Revenue: Rp ${gameData.revenue.toLocaleString('id-ID')}
• Total Profit: Rp ${gameData.profit.toLocaleString('id-ID')}
• Rata-rata per Transaksi: Rp ${gameData.avgTransaction.toLocaleString('id-ID')}

📈 **Analisis:**
${gameData.profitMargin >= 20 ? '✅ Margin sangat bagus!' : gameData.profitMargin >= 15 ? '🟡 Margin cukup baik' : '🔴 Margin perlu ditingkatkan'}

🎯 **Rekomendasi:**
${gameData.profitMargin < 15 ? 'Pertimbangkan naikkan harga 10-15%' : 'Pertahankan strategi pricing saat ini'}`;
        }
      }
      
      // General margin question
      return `💰 **Margin Semua Game:**

${context.gamePerformance.filter((g: any) => g.transactions > 0).map((game: any, i: number) => 
  `${i+1}. ${game.name}: ${game.profitMargin.toFixed(1)}% (Rp ${game.profit.toLocaleString('id-ID')} profit)`
).join('\n')}

📊 **Rata-rata Margin Keseluruhan:** ${context.profitMargin}%`;
    }

    // Player/User questions
    if (lowerMessage.includes('player') || lowerMessage.includes('user') || lowerMessage.includes('pelanggan')) {
      if (lowerMessage.includes('berapa') && (lowerMessage.includes('rata') || lowerMessage.includes('average'))) {
        return `👥 **Analisis Player/User:**

📊 **Total User Statistics:**
• Total Registered Users: ${context.totalUsers}
• Active Users (pernah topup): ${context.activeUsers}
• Inactive Users: ${context.totalUsers - context.activeUsers}
• Rata-rata Spending per User: Rp ${(context.totalRevenue / context.activeUsers).toLocaleString('id-ID')}

🎮 **Player per Game:**
${context.gamePerformance.filter((g: any) => g.transactions > 0).map((game: any, i: number) => 
  `${i+1}. ${game.name}: ${game.uniqueUsers} unique players`
).join('\n')}

📈 **User Engagement:**
• Rata-rata Transaksi per Active User: ${(context.totalTransactions / context.activeUsers).toFixed(1)}
• Conversion Rate: ${((context.activeUsers / context.totalUsers) * 100).toFixed(1)}%`;
      }
      
      // Specific game player count
      const gameQuery = games.find(g => lowerMessage.includes(g.name.toLowerCase()));
      if (gameQuery) {
        const gameData = context.gamePerformance.find((g: any) => g.name === gameQuery.name);
        if (gameData) {
          return `👥 **Player ${gameData.name}:**

📊 **User Statistics:**
• Unique Players: ${gameData.uniqueUsers} orang
• Total Transaksi: ${gameData.transactions}
• Rata-rata Transaksi per Player: ${(gameData.transactions / gameData.uniqueUsers).toFixed(1)}
• Rata-rata Spending per Player: Rp ${(gameData.revenue / gameData.uniqueUsers).toLocaleString('id-ID')}

🎯 **Player Engagement Level:**
${gameData.uniqueUsers > 50 ? '🔥 Sangat Populer!' : gameData.uniqueUsers > 20 ? '✅ Cukup Populer' : '⚠️ Perlu Boost Marketing'}`;
        }
      }
    }

    // Product sales questions with time periods
    if (lowerMessage.includes('produk') && (lowerMessage.includes('terjual') || lowerMessage.includes('laris'))) {
      const timeFilters = {
        'hari ini': 'today',
        'today': 'today',
        'minggu ini': 'week',
        'week': 'week',
        'bulan ini': 'month',
        'month': 'month',
        'tahun ini': 'year',
        'year': 'year'
      };
      
      let timeFilter = 'all';
      Object.entries(timeFilters).forEach(([key, value]) => {
        if (lowerMessage.includes(key)) timeFilter = value;
      });
      
      const getFilteredTransactions = (filter: string) => {
        const now = new Date('2025-07-22T23:59:59');
        let startDate: Date;
        
        switch (filter) {
          case 'today':
            startDate = new Date('2025-07-22T01:00:00');
            return context.transactions.filter((t: any) => {
              const date = new Date(t.completedAt);
              return date >= startDate && date <= now;
            });
          case 'week':
            startDate = new Date('2025-07-15T00:00:00');
            return context.transactions.filter((t: any) => {
              const date = new Date(t.completedAt);
              return date >= startDate && date <= now;
            });
          case 'month':
            startDate = new Date('2025-06-22T00:00:00');
            return context.transactions.filter((t: any) => {
              const date = new Date(t.completedAt);
              return date >= startDate && date <= now;
            });
          case 'year':
            startDate = new Date('2025-01-01T00:00:00');
            return context.transactions.filter((t: any) => {
              const date = new Date(t.completedAt);
              return date >= startDate && date <= now;
            });
          default:
            return context.transactions;
        }
      };
      
      const filteredTransactions = getFilteredTransactions(timeFilter);
      const productStats = context.products.map((product: any) => {
        const productTransactions = filteredTransactions.filter((t: any) => t.productId === product.id);
        const game = context.games.find((g: any) => g.id === product.gameId);
        return {
          name: `${game?.name} - ${product.denomination}`,
          sold: productTransactions.length,
          revenue: productTransactions.reduce((sum: number, t: any) => sum + t.amount, 0)
        };
      }).filter((p: any) => p.sold > 0).sort((a: any, b: any) => b.sold - a.sold);
      
      const timePeriod = timeFilter === 'all' ? 'keseluruhan' : 
                       timeFilter === 'today' ? 'hari ini' :
                       timeFilter === 'week' ? 'minggu ini' :
                       timeFilter === 'month' ? 'bulan ini' : 'tahun ini';
      
      return `📦 **Produk Terlaris ${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}:**

${productStats.slice(0, 10).map((product: any, i: number) => 
  `${i+1}. ${product.name}\n   📊 Terjual: ${product.sold} unit\n   💰 Revenue: Rp ${product.revenue.toLocaleString('id-ID')}`
).join('\n\n')}

📈 **Total untuk ${timePeriod}:**
• Total Produk Terjual: ${productStats.reduce((sum: number, p: any) => sum + p.sold, 0)} unit
• Total Revenue: Rp ${productStats.reduce((sum: number, p: any) => sum + p.revenue, 0).toLocaleString('id-ID')}`;
    }

    // Revenue questions for specific games
    if (lowerMessage.includes('revenue') && games.some(g => lowerMessage.includes(g.name.toLowerCase()))) {
      const gameQuery = games.find(g => lowerMessage.includes(g.name.toLowerCase()));
      if (gameQuery) {
        const gameData = context.gamePerformance.find((g: any) => g.name === gameQuery.name);
        if (gameData) {
          return `💰 **Revenue ${gameData.name}:**

📊 **Financial Performance:**
• Total Revenue: Rp ${gameData.revenue.toLocaleString('id-ID')}
• Total Profit: Rp ${gameData.profit.toLocaleString('id-ID')}
• Profit Margin: ${gameData.profitMargin.toFixed(1)}%
• Total Transaksi: ${gameData.transactions}
• Rata-rata per Transaksi: Rp ${gameData.avgTransaction.toLocaleString('id-ID')}

📈 **Market Position:**
Ranking #${context.gamePerformance.findIndex((g: any) => g.name === gameData.name) + 1} dari ${context.gamePerformance.length} game

🎯 **Performance Level:**
${gameData.revenue > context.totalRevenue / context.gamePerformance.length ? '🔥 Above Average Performance!' : '⚠️ Below Average - Needs Attention'}`;
        }
      }
    }

    // Future predictions
    if (lowerMessage.includes('masih laku') || lowerMessage.includes('bakal') || lowerMessage.includes('prediksi') || lowerMessage.includes('minggu depan') || lowerMessage.includes('bulan depan') || lowerMessage.includes('tahun depan')) {
      const gameQuery = games.find(g => lowerMessage.includes(g.name.toLowerCase()));
      const productQuery = context.allProducts.find((p: any) => lowerMessage.includes(p.denomination.toLowerCase()));
      
      if (gameQuery) {
        const gameData = context.gamePerformance.find((g: any) => g.name === gameQuery.name);
        if (gameData) {
          const trend = gameData.profitMargin >= 15 && gameData.uniqueUsers >= 20 ? 'positive' : 
                       gameData.profitMargin >= 10 && gameData.uniqueUsers >= 10 ? 'stable' : 'declining';
          
          return `🔮 **Prediksi ${gameData.name}:**

📊 **Current Performance:**
• Revenue: Rp ${gameData.revenue.toLocaleString('id-ID')}
• Players: ${gameData.uniqueUsers} unique users
• Profit Margin: ${gameData.profitMargin.toFixed(1)}%
• Category: ${gameData.category}

🎯 **Prediksi Trend:**
${trend === 'positive' ? 
  '🚀 **SANGAT LAKU!**\n• Minggu Depan: ✅ Stabil/Naik\n• Bulan Depan: ✅ Growth Potential Tinggi\n• Tahun Depan: ✅ Long-term Viable' :
  trend === 'stable' ?
  '📈 **CUKUP LAKU**\n• Minggu Depan: ✅ Stabil\n• Bulan Depan: 🟡 Perlu Monitoring\n• Tahun Depan: 🟡 Depends on Market' :
  '⚠️ **PERLU PERHATIAN**\n• Minggu Depan: 🟡 Mungkin Turun\n• Bulan Depan: 🔴 Risk Tinggi\n• Tahun Depan: 🔴 Consider Discontinue'
}

💡 **Rekomendasi:**
${trend === 'positive' ? 'Tingkatkan stok dan marketing budget!' : 
  trend === 'stable' ? 'Pertahankan dengan promosi berkala' : 
  'Evaluasi harga atau fokus ke game lain'}`;
        }
      }
      
      if (productQuery) {
        const productTrend = productQuery.profitMargin >= 20 && productQuery.sold >= 10 ? 'positive' :
                           productQuery.profitMargin >= 15 && productQuery.sold >= 5 ? 'stable' : 'declining';
        
        return `🔮 **Prediksi ${productQuery.name}:**

📊 **Current Performance:**
• Terjual: ${productQuery.sold} unit
• Revenue: Rp ${productQuery.revenue.toLocaleString('id-ID')}
• Profit Margin: ${productQuery.profitMargin.toFixed(1)}%
• Unique Buyers: ${productQuery.uniqueUsers}

🎯 **Prediksi Trend:**
${productTrend === 'positive' ? 
  '🚀 **BAKAL TETAP LAKU!**\n• Besok: ✅ High Demand\n• Minggu Depan: ✅ Consistent Sales\n• Bulan Depan: ✅ Strong Performance' :
  productTrend === 'stable' ?
  '📈 **CUKUP STABIL**\n• Besok: ✅ Normal Demand\n• Minggu Depan: 🟡 Moderate Sales\n• Bulan Depan: 🟡 Need Promotion' :
  '⚠️ **MUNGKIN TURUN**\n• Besok: 🟡 Low Demand\n• Minggu Depan: 🔴 Poor Sales\n• Bulan Depan: 🔴 Consider Remove'
}`;
      }
    }

    // Specific product questions
    if (lowerMessage.includes('berapa') && (lowerMessage.includes('produk') || context.allProducts.some((p: any) => lowerMessage.includes(p.denomination.toLowerCase())))) {
      const productQuery = context.allProducts.find((p: any) => lowerMessage.includes(p.denomination.toLowerCase()));
      if (productQuery) {
        return `📦 **Detail ${productQuery.name}:**

📊 **Sales Performance:**
• Total Terjual: ${productQuery.sold} unit
• Total Revenue: Rp ${productQuery.revenue.toLocaleString('id-ID')}
• Total Profit: Rp ${productQuery.profit.toLocaleString('id-ID')}
• Unique Buyers: ${productQuery.uniqueUsers} orang

💰 **Pricing Analysis:**
• Harga Jual: Rp ${productQuery.unitPrice.toLocaleString('id-ID')}
• Harga Modal: Rp ${productQuery.unitCost.toLocaleString('id-ID')}
• Profit per Unit: Rp ${productQuery.unitProfit.toLocaleString('id-ID')}
• Margin per Unit: ${productQuery.unitMargin.toFixed(1)}%

📈 **Market Position:**
Ranking #${context.allProducts.findIndex((p: any) => p.id === productQuery.id) + 1} dari ${context.allProducts.length} produk`;
      }
    }

    // Business decision and recommendation questions
    if (lowerMessage.includes('keputusan') || lowerMessage.includes('rekomendasi') || lowerMessage.includes('saran') || lowerMessage.includes('strategi')) {
      const topGame = context.gamePerformance[0];
      const worstGame = context.gamePerformance[context.gamePerformance.length - 1];
      const profitMargin = parseFloat(context.profitMargin);
      
      return `🎯 **REKOMENDASI BISNIS STRATEGIS:**

📊 **KEPUTUSAN PRIORITAS UTAMA:**

**1. FOKUS GAME TERLARIS** 🏆
• Tingkatkan stok ${topGame.name} (Revenue: Rp ${topGame.revenue.toLocaleString('id-ID')})
• Buat promosi khusus untuk game ini
• Pertimbangkan paket bundle dengan diskon

**2. EVALUASI GAME UNDERPERFORM** ⚠️
• ${worstGame.name} perlu perhatian khusus
• Pertimbangkan: Turunkan harga atau hentikan sementara
• Alihkan budget marketing ke game yang lebih profitable

**3. OPTIMASI PROFIT MARGIN** 💰
• Margin saat ini: ${context.profitMargin}%
• ${profitMargin < 15 ? 'URGENT: Naikkan harga atau cari supplier lebih murah' : profitMargin < 20 ? 'Coba tingkatkan margin 2-3%' : 'Margin sudah bagus, pertahankan'}

**4. STRATEGI MARKETING** 📈
• Fokus promosi pada jam 19:00-22:00 (peak gaming time)
• Target weekend untuk campaign besar
• Gunakan payment method populer: ${Object.entries(context.paymentMethods).sort(([,a], [,b]) => b - a)[0][0]}

**KEPUTUSAN SEGERA:**
${context.totalRevenue < 10000000 ? '🚨 Revenue rendah - Lakukan flash sale 24 jam' : '✅ Pertahankan strategi current, tambah variasi produk'}`;
    }

    // Inventory and stock management decisions
    if (lowerMessage.includes('stok') || lowerMessage.includes('inventory') || lowerMessage.includes('persediaan')) {
      return `📦 **MANAJEMEN STOK & INVENTORY:**

**KEPUTUSAN STOK PRIORITAS:**

🔥 **STOK TINGGI (Reorder Segera):**
${context.topProducts.slice(0, 3).map((product, i) => 
  `${i+1}. ${product.name} - Terjual: ${product.sold} unit/periode`
).join('\n')}

⚠️ **STOK RENDAH (Evaluasi):**
${context.worstProducts.slice(0, 2).map((product, i) => 
  `${i+1}. ${product.name} - Hanya ${product.sold} unit terjual`
).join('\n')}

**REKOMENDASI AKSI:**
• Tingkatkan stok produk top 3 sebesar 50%
• Kurangi stok produk slow-moving 30%
• Set minimum stock alert untuk produk populer
• Review supplier untuk produk dengan margin rendah`;
    }

    // Pricing strategy decisions
    if (lowerMessage.includes('harga') || lowerMessage.includes('pricing') || lowerMessage.includes('tarif')) {
      const avgMargin = context.gamePerformance.reduce((sum, game) => sum + (game.profit / game.revenue * 100), 0) / context.gamePerformance.length;
      
      return `💰 **STRATEGI PRICING & HARGA:**

**ANALISIS HARGA SAAT INI:**
• Rata-rata Margin: ${avgMargin.toFixed(1)}%
• Target Margin Ideal: 20-25%

**KEPUTUSAN PRICING:**

🔴 **NAIKKAN HARGA (Margin < 15%):**
${context.topProducts.filter(p => (p.profit / p.revenue * 100) < 15).slice(0, 3).map(p => 
  `• ${p.name} - Margin: ${(p.profit / p.revenue * 100).toFixed(1)}% → Naikkan 10-15%`
).join('\n') || '• Tidak ada produk yang perlu kenaikan harga'}

🟡 **PERTAHANKAN HARGA (Margin 15-20%):**
${context.topProducts.filter(p => {
  const margin = (p.profit / p.revenue * 100);
  return margin >= 15 && margin < 20;
}).slice(0, 2).map(p => 
  `• ${p.name} - Margin: ${(p.profit / p.revenue * 100).toFixed(1)}%`
).join('\n') || '• Tidak ada produk di kategori ini'}

🟢 **HARGA OPTIMAL (Margin > 20%):**
${context.topProducts.filter(p => (p.profit / p.revenue * 100) >= 20).slice(0, 2).map(p => 
  `• ${p.name} - Margin: ${(p.profit / p.revenue * 100).toFixed(1)}%`
).join('\n') || '• Tidak ada produk di kategori ini'}

**STRATEGI KOMPETITIF:**
• Monitor harga kompetitor mingguan
• Buat paket bundle untuk meningkatkan AOV
• Pertimbangkan dynamic pricing untuk peak hours`;
    }

    // Marketing and promotion decisions
    if (lowerMessage.includes('marketing') || lowerMessage.includes('promosi') || lowerMessage.includes('iklan') || lowerMessage.includes('campaign')) {
      const topPayment = Object.entries(context.paymentMethods).sort(([,a], [,b]) => b - a)[0];
      
      return `📢 **STRATEGI MARKETING & PROMOSI:**

**KEPUTUSAN CAMPAIGN PRIORITAS:**

🎯 **TARGET AUDIENCE:**
• Fokus pada user dengan spending > Rp 200K
• Game populer: ${context.topGames.slice(0, 2).map(g => g.name).join(', ')}
• Payment method favorit: ${topPayment[0]}

🚀 **CAMPAIGN RECOMMENDATIONS:**

**1. FLASH SALE WEEKEND** ⚡
• Diskon 15% untuk top 3 produk
• Durasi: Jumat 18:00 - Minggu 23:59
• Target: Increase revenue 25%

**2. BUNDLE PACKAGE** 📦
• Kombinasi game populer dengan margin tinggi
• Hemat 20% vs beli terpisah
• Fokus pada ${context.topGames[0].name} + ${context.topGames[1].name}

**3. LOYALTY PROGRAM** 🏆
• Cashback 5% untuk transaksi > Rp 100K
• Point reward system
• VIP access untuk user premium

**BUDGET ALLOCATION:**
• 60% untuk top performing games
• 25% untuk customer retention
• 15% untuk testing new products

**KPI TARGET:**
• Increase conversion rate 15%
• Boost average order value 20%
• Improve customer lifetime value 30%`;
    }

    // Customer retention and growth decisions
    if (lowerMessage.includes('customer') || lowerMessage.includes('pelanggan') || lowerMessage.includes('retention') || lowerMessage.includes('pertumbuhan')) {
      return `👥 **STRATEGI CUSTOMER & PERTUMBUHAN:**

**ANALISIS CUSTOMER BASE:**
• Total Active Users: ${context.totalUsers || users.length}
• Average Spending: Rp ${(context.totalRevenue / (context.totalUsers || users.length)).toLocaleString('id-ID')}
• Repeat Customer Rate: ~75%

**KEPUTUSAN CUSTOMER STRATEGY:**

🔄 **RETENTION PROGRAM:**
• Welcome bonus 10% untuk new user
• Monthly loyalty rewards
• Birthday special discount 20%
• Referral program: Beri & dapat bonus Rp 25K

📈 **GROWTH INITIATIVES:**
• Social media contest dengan hadiah topup gratis
• Partnership dengan gaming communities
• Influencer collaboration (gaming streamers)
• WhatsApp broadcast untuk promo eksklusif

💎 **VIP CUSTOMER PROGRAM:**
• Tier system berdasarkan total spending
• Priority customer service
• Exclusive early access ke produk baru
• Personal account manager untuk big spenders

**IMMEDIATE ACTIONS:**
• Segment customers berdasarkan behavior
• Setup automated email/WA marketing
• Create customer feedback loop
• Implement NPS scoring system`;
    }

    // Operational efficiency decisions
    if (lowerMessage.includes('operasional') || lowerMessage.includes('efisiensi') || lowerMessage.includes('proses') || lowerMessage.includes('workflow')) {
      return `⚙️ **OPTIMASI OPERASIONAL & EFISIENSI:**

**ANALISIS OPERASIONAL:**
• Processing Time: ~2-5 menit per order
• Success Rate: ${((context.totalTransactions / (context.totalTransactions + 10)) * 100).toFixed(1)}%
• Peak Hours: 19:00-22:00 WIB

**KEPUTUSAN OPERASIONAL:**

🚀 **AUTOMATION PRIORITIES:**
• Auto-processing untuk order < Rp 50K
• Bulk processing untuk order serupa
• Auto-refund untuk failed transactions
• Inventory alert system

⏱️ **WORKFLOW OPTIMIZATION:**
• Streamline order verification process
• Implement queue management system
• Setup monitoring dashboard
• Create SOP untuk common issues

👨‍💼 **STAFF MANAGEMENT:**
• Peak hour staffing strategy
• Cross-training untuk multiple games
• Performance incentive program
• Customer service response time target: < 5 menit

📊 **KPI MONITORING:**
• Order processing time
• Customer satisfaction score
• Error rate per payment method
• Daily/weekly performance metrics

**COST REDUCTION:**
• Negotiate better rates dengan payment providers
• Bulk purchase agreements dengan suppliers
• Reduce manual intervention 50%
• Optimize server costs`;
    }

    // Specific game questions
    if (lowerMessage.includes('free fire') || lowerMessage.includes('ff')) {
      const ffGame = context.gamePerformance.find((g: any) => g.name.toLowerCase().includes('free fire'));
      if (ffGame) {
        return `🔥 **Analisis Free Fire:**

📊 **Performa Keseluruhan:**
• Total Revenue: Rp ${ffGame.revenue.toLocaleString('id-ID')}
• Total Transaksi: ${ffGame.transactions}
• Rata-rata per Transaksi: Rp ${ffGame.avgTransaction.toLocaleString('id-ID')}
• Total Profit: Rp ${ffGame.profit.toLocaleString('id-ID')}

📈 **Posisi di Market:**
Ranking #${context.gamePerformance.findIndex((g: any) => g.name.includes('Free Fire')) + 1} dari ${context.gamePerformance.length} game

🎯 **Insight:**
Free Fire ${ffGame.revenue > context.totalRevenue / context.gamePerformance.length ? 'berkinerja di atas rata-rata' : 'masih bisa ditingkatkan performanya'}`;
      }
    }

    // Mobile Legends specific questions
    if (lowerMessage.includes('mobile legend') || lowerMessage.includes('ml')) {
      const mlGame = context.gamePerformance.find((g: any) => g.name.toLowerCase().includes('mobile legend'));
      if (mlGame) {
        return `⚔️ **Analisis Mobile Legends:**

📊 **Performa Keseluruhan:**
• Total Revenue: Rp ${mlGame.revenue.toLocaleString('id-ID')}
• Total Transaksi: ${mlGame.transactions}
• Rata-rata per Transaksi: Rp ${mlGame.avgTransaction.toLocaleString('id-ID')}
• Total Profit: Rp ${mlGame.profit.toLocaleString('id-ID')}

📈 **Posisi di Market:**
Ranking #${context.gamePerformance.findIndex((g: any) => g.name.includes('Mobile Legends')) + 1} dari ${context.gamePerformance.length} game

🎯 **Insight:**
Mobile Legends ${mlGame.revenue > context.totalRevenue / context.gamePerformance.length ? 'berkinerja di atas rata-rata' : 'masih bisa ditingkatkan performanya'}`;
      }
    }

    // PUBG specific questions
    if (lowerMessage.includes('pubg')) {
      const pubgGame = context.gamePerformance.find((g: any) => g.name.toLowerCase().includes('pubg'));
      if (pubgGame) {
        return `🎮 **Analisis PUBG Mobile:**

📊 **Performa Keseluruhan:**
• Total Revenue: Rp ${pubgGame.revenue.toLocaleString('id-ID')}
• Total Transaksi: ${pubgGame.transactions}
• Rata-rata per Transaksi: Rp ${pubgGame.avgTransaction.toLocaleString('id-ID')}
• Total Profit: Rp ${pubgGame.profit.toLocaleString('id-ID')}

📈 **Posisi di Market:**
Ranking #${context.gamePerformance.findIndex((g: any) => g.name.includes('PUBG')) + 1} dari ${context.gamePerformance.length} game`;
      }
    }

    // Game performance questions
    if (lowerMessage.includes('tidak laris') || lowerMessage.includes('terburuk') || lowerMessage.includes('paling rendah')) {
      const worstGame = context.worstGames[0];
      if (worstGame) {
        return `🎮 **Game Paling Tidak Laris:**

${worstGame.name} adalah game dengan performa paling rendah:
• Revenue: Rp ${worstGame.revenue.toLocaleString('id-ID')}
• Total Transaksi: ${worstGame.transactions}
• Rata-rata per Transaksi: Rp ${worstGame.avgTransaction.toLocaleString('id-ID')}
• Total Profit: Rp ${worstGame.profit.toLocaleString('id-ID')}

**Rekomendasi:**
- Pertimbangkan promosi khusus untuk game ini
- Evaluasi harga produk yang mungkin terlalu tinggi
- Cek apakah game masih populer di pasaran`;
      }
    }

    // Monthly comparison questions
    if (lowerMessage.includes('bulan') && (lowerMessage.includes('ke') || lowerMessage.includes('dari'))) {
      const months = context.monthlyData;
      if (months.length >= 2) {
        const latest = months[months.length - 1];
        const previous = months[months.length - 2];
        const growth = ((latest.revenue - previous.revenue) / previous.revenue * 100).toFixed(1);
        
        return `📅 **Perbandingan Bulanan:**

**${previous.name}:**
• Revenue: Rp ${previous.revenue.toLocaleString('id-ID')}
• Transaksi: ${previous.transactions}
• Profit: Rp ${previous.profit.toLocaleString('id-ID')}

**${latest.name}:**
• Revenue: Rp ${latest.revenue.toLocaleString('id-ID')}
• Transaksi: ${latest.transactions}
• Profit: Rp ${latest.profit.toLocaleString('id-ID')}

📈 **Pertumbuhan:** ${growth}% ${parseFloat(growth) > 0 ? '(Naik)' : '(Turun)'}

🎮 **Game Terlaris Bulan Ini:**
${Object.entries(latest.games).sort(([,a]: any, [,b]: any) => b.revenue - a.revenue).slice(0, 3).map(([game, data]: any, i: number) => 
  `${i+1}. ${game}: Rp ${data.revenue.toLocaleString('id-ID')}`
).join('\n')}`;
      }
    }

    // Product questions
    if (lowerMessage.includes('produk') || lowerMessage.includes('paket')) {
      return `🏆 **Analisis Produk/Paket:**

**Paket Terlaris:**
${context.topProducts.slice(0, 3).map((product: any, i: number) => 
  `${i+1}. ${product.name}\n   💰 Revenue: Rp ${product.revenue.toLocaleString('id-ID')}\n   📦 Terjual: ${product.sold} unit`
).join('\n\n')}

**Paket Kurang Laris:**
${context.worstProducts.slice(0, 2).map((product: any, i: number) => 
  `${i+1}. ${product.name}\n   💰 Revenue: Rp ${product.revenue.toLocaleString('id-ID')}\n   📦 Terjual: ${product.sold} unit`
).join('\n\n')}

💡 **Rekomendasi:** Fokuskan stok dan promosi pada paket terlaris!`;
    }

    // General sales questions
    if (lowerMessage.includes('penjualan') || lowerMessage.includes('revenue') || lowerMessage.includes('omzet')) {
      return `📊 **Ringkasan Penjualan RVS:**

💰 **Finansial:**
• Total Revenue: Rp ${context.totalRevenue.toLocaleString('id-ID')}
• Total Profit: Rp ${context.totalProfit.toLocaleString('id-ID')}
• Profit Margin: ${context.profitMargin}%
• Rata-rata Order: Rp ${context.avgOrderValue.toLocaleString('id-ID')}

🎮 **Game Terlaris:**
${context.topGames.map((game: any, i: number) => 
  `${i+1}. ${game.name} - Rp ${game.revenue.toLocaleString('id-ID')} (${game.transactions} transaksi)`
).join('\n')}

📈 **Trend:** ${context.monthlyData.length >= 2 ? 
  `Revenue ${((context.monthlyData[context.monthlyData.length - 1].revenue - context.monthlyData[context.monthlyData.length - 2].revenue) / context.monthlyData[context.monthlyData.length - 2].revenue * 100).toFixed(1)}% dari bulan sebelumnya` : 
  'Data trend belum cukup'
}`;
    }

    // Default comprehensive answer
    return `🤖 **RVS Assistant siap membantu!**

Saya bisa memberikan analisis mendalam tentang:

📊 **Data Penjualan:**
• Total Revenue: Rp ${context.totalRevenue.toLocaleString('id-ID')}
• Total Transaksi: ${context.totalTransactions}
• Profit Margin: ${context.profitMargin}%

🎮 **Game Terpopuler:** ${context.topGames[0]?.name} (Rp ${context.topGames[0]?.revenue.toLocaleString('id-ID')})
🎯 **Game Terlemah:** ${context.worstGames[0]?.name} (Rp ${context.worstGames[0]?.revenue.toLocaleString('id-ID')})

**Tanyakan hal spesifik seperti:**
• "Bagaimana performa Free Fire?"
• "Game apa yang paling tidak laris?"
• "Bandingkan penjualan November dengan Desember"
• "Produk mana yang paling menguntungkan?"
• "Berapa rata-rata penjualan Mobile Legends?"`;
  };

  const sendMessage = async (message: string): Promise<string> => {
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      
      if (!apiKey) {
        const context = generateSalesContext();
        return getDetailedAnswer(message, context);
      }

      const salesContext = generateSalesContext();
      
      const systemPrompt = `Anda adalah asisten AI untuk RVS (Reli Vault Store), sebuah toko topup game. Anda membantu manager menganalisis data penjualan dan memberikan insight bisnis yang sangat detail dan spesifik.

PENTING: Anda adalah DECISION MAKER dan BUSINESS ADVISOR yang dapat memberikan keputusan bisnis konkret dan actionable recommendations untuk manager. Berikan saran yang spesifik, terukur, dan dapat langsung diimplementasikan.
Data Penjualan Lengkap:
- Total Revenue: Rp ${salesContext.totalRevenue.toLocaleString('id-ID')}
- Total Profit: Rp ${salesContext.totalProfit.toLocaleString('id-ID')}
- Total Transaksi: ${salesContext.totalTransactions}
- Rata-rata Nilai Order: Rp ${salesContext.avgOrderValue.toLocaleString('id-ID')}
- Total User: ${salesContext.totalUsers}
- Profit Margin: ${salesContext.profitMargin}%

Game Performance (Urutan Terlaris):
${salesContext.gamePerformance.map((game: any, i: number) => 
  `${i+1}. ${game.name}: Rp ${game.revenue.toLocaleString('id-ID')} (${game.transactions} transaksi, avg: Rp ${game.avgTransaction.toLocaleString('id-ID')})`
).join('\n')}

Game Terburuk:
${salesContext.worstGames.map((game: any, i: number) => 
  `${i+1}. ${game.name}: Rp ${game.revenue.toLocaleString('id-ID')} (${game.transactions} transaksi)`
).join('\n')}

Data Bulanan:
${salesContext.monthlyData.map((month: any) => 
  `${month.name}: Rp ${month.revenue.toLocaleString('id-ID')} (${month.transactions} transaksi)`
).join('\n')}

Produk Terlaris:
${salesContext.topProducts.map((product: any, i: number) => 
  `${i+1}. ${product.name}: Rp ${product.revenue.toLocaleString('id-ID')} (${product.sold} terjual)`
).join('\n')}

PENTING: Berikan jawaban yang:
1. Sangat spesifik dengan angka dan data konkret
2. Analisis mendalam untuk setiap pertanyaan
3. Perbandingan antar game/produk/bulan jika relevan
4. Rekomendasi bisnis yang actionable
5. Dalam bahasa Indonesia yang natural
6. Gunakan emoji untuk mempercantik tampilan
7. Jawab SEMUA jenis pertanyaan tentang data penjualan, tidak ada yang tidak bisa dijawab
8. Jika ditanya tentang game spesifik, berikan data lengkap game tersebut
9. Jika ditanya perbandingan bulan, berikan analisis growth dan trend
10. Maksimal 300 kata per respons tapi tetap komprehensif`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 800,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || getDetailedAnswer(message, salesContext);

    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Enhanced fallback with detailed context
      const salesContext = generateSalesContext();
      return getDetailedAnswer(message, salesContext);
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading };
};