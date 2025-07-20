import React, { useState, useEffect } from 'react';
import { Search, Package, TrendingUp, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { games, transactions, getProducts, updateProduct, addProduct, deleteProduct } from '../data/mockData';
import { Product } from '../types';

interface EditingProduct {
  id: string;
  name: string;
  denomination: string;
  price: number;
  cost: number;
}

export const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [products, setProducts] = useState(getProducts());
  const [newProduct, setNewProduct] = useState({
    gameId: '',
    name: '',
    denomination: '',
    price: 0,
    cost: 0
  });

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const filteredProducts = products.filter(product => {
    const game = games.find(g => g.id === product.gameId);
    
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.denomination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGame = gameFilter === 'all' || product.gameId === gameFilter;
    
    return matchesSearch && matchesGame;
  });

  const getProductStats = (productId: string) => {
    const productTransactions = transactions.filter(t => t.productId === productId);
    const totalSold = productTransactions.length;
    const totalRevenue = productTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return { totalSold, totalRevenue };
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
        isActive 
          ? 'bg-green-100 text-green-800 border-green-200' 
          : 'bg-gray-100 text-gray-800 border-gray-200'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const getProfitMargin = (product: Product) => {
    const margin = ((product.profit / product.price) * 100);
    return margin;
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      denomination: product.denomination,
      price: product.price,
      cost: product.cost
    });
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;
    
    const updatedProduct = updateProduct(editingProduct.id, {
      name: editingProduct.name,
      denomination: editingProduct.denomination,
      price: editingProduct.price,
      cost: editingProduct.cost
    });
    
    if (updatedProduct) {
      setProducts(getProducts());
      setEditingProduct(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleAddProduct = () => {
    if (!newProduct.gameId || !newProduct.name || !newProduct.denomination || newProduct.price <= 0 || newProduct.cost <= 0) {
      alert('Please fill in all fields with valid values');
      return;
    }

    const addedProduct = addProduct({
      gameId: newProduct.gameId,
      name: newProduct.name,
      denomination: newProduct.denomination,
      price: newProduct.price,
      cost: newProduct.cost,
      isActive: true
    });

    if (addedProduct) {
      setProducts(getProducts());
      setIsAddingProduct(false);
      setNewProduct({
        gameId: '',
        name: '',
        denomination: '',
        price: 0,
        cost: 0
      });
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const deleted = deleteProduct(productId);
      if (deleted) {
        setProducts(getProducts());
      }
    }
  };

  const groupedProducts = games.map(game => ({
    game,
    products: filteredProducts.filter(p => p.gameId === game.id)
  })).filter(group => group.products.length > 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">Manage your topup game products and pricing</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsAddingProduct(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <Button variant="secondary">
              <Package className="h-4 w-4 mr-2" />
              Export Products
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Products</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {products.filter(p => p.isActive).length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Games Available</p>
                  <p className="text-2xl font-bold text-gray-900">{games.length}</p>
                </div>
                <div className="text-2xl">🎮</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Profit Margin</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(products.reduce((sum, p) => sum + getProfitMargin(p), 0) / products.length).toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search products by name, denomination, or game..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={gameFilter}
                  onChange={(e) => setGameFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Games</option>
                  {games.map(game => (
                    <option key={game.id} value={game.id}>{game.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Product Modal */}
        {isAddingProduct && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Game</label>
                  <select
                    value={newProduct.gameId}
                    onChange={(e) => setNewProduct({...newProduct, gameId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Game</option>
                    {games.map(game => (
                      <option key={game.id} value={game.id}>{game.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <Input
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="e.g., Free Fire Diamonds"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Denomination</label>
                  <Input
                    value={newProduct.denomination}
                    onChange={(e) => setNewProduct({...newProduct, denomination: e.target.value})}
                    placeholder="e.g., 70 Diamonds"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rp)</label>
                  <Input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    placeholder="12000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost (Rp)</label>
                  <Input
                    type="number"
                    value={newProduct.cost}
                    onChange={(e) => setNewProduct({...newProduct, cost: Number(e.target.value)})}
                    placeholder="10000"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddProduct}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Product
                </Button>
                <Button variant="secondary" onClick={() => setIsAddingProduct(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products by Game */}
        {groupedProducts.map(({ game, products: gameProducts }) => (
          <Card key={game.id}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-3">{game.icon}</span>
                {game.name} Products ({gameProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Margin</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sold</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {gameProducts.map((product) => {
                      const stats = getProductStats(product.id);
                      const profitMargin = getProfitMargin(product);
                      const isEditing = editingProduct?.id === product.id;
                      
                      return (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <div className="space-y-2">
                                <Input
                                  value={editingProduct.name}
                                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                  className="text-sm"
                                />
                                <Input
                                  value={editingProduct.denomination}
                                  onChange={(e) => setEditingProduct({...editingProduct, denomination: e.target.value})}
                                  className="text-sm"
                                />
                              </div>
                            ) : (
                              <div>
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.denomination}</div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <Input
                                type="number"
                                value={editingProduct.price}
                                onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                                className="text-sm w-24"
                              />
                            ) : (
                              <span className="text-sm font-medium">Rp {product.price.toLocaleString('id-ID')}</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <Input
                                type="number"
                                value={editingProduct.cost}
                                onChange={(e) => setEditingProduct({...editingProduct, cost: Number(e.target.value)})}
                                className="text-sm w-24"
                              />
                            ) : (
                              <span className="text-sm">Rp {product.cost.toLocaleString('id-ID')}</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-green-600">
                              Rp {(isEditing ? editingProduct.price - editingProduct.cost : product.profit).toLocaleString('id-ID')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-medium ${profitMargin >= 20 ? 'text-green-600' : profitMargin >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {profitMargin.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">{stats.totalSold}</td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-purple-600">
                              Rp {stats.totalRevenue.toLocaleString('id-ID')}
                            </span>
                          </td>
                          <td className="px-6 py-4">{getStatusBadge(product.isActive)}</td>
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <div className="flex gap-1">
                                <Button size="sm" onClick={handleSaveEdit}>
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="secondary" onClick={handleCancelEdit}>
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" onClick={() => handleEditProduct(product)}>
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleDeleteProduct(product.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
};