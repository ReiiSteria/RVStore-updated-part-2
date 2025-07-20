import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  History, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  LogOut,
  Gamepad2,
  Users,
  User,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transaction History', href: '/transactions', icon: History },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Sales Report', href: '/sales-report', icon: BarChart3 },
  { name: 'Manage Accounts', href: '/manage-accounts', icon: Users },
  { name: 'Chat History', href: '/chat-history', icon: MessageCircle },
];

export const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-900 via-purple-800 to-blue-900 text-white">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-purple-700">
        <Gamepad2 className="h-8 w-8 text-purple-300" />
        <div className="ml-3">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
            RVS
          </span>
          <p className="text-xs text-purple-300">Reli Vault Store</p>
        </div>
      </div>

      {/* User Info */}
      <NavLink 
        to="/profile"
        className="px-6 py-4 border-b border-purple-700 hover:bg-purple-800 transition-colors"
      >
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-white">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-purple-100">{user?.name}</p>
            <p className="text-xs text-purple-300">{user?.role}</p>
          </div>
        </div>
      </NavLink>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'text-purple-200 hover:bg-purple-800 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-purple-700">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-purple-200 rounded-lg hover:bg-purple-800 hover:text-white transition-all duration-200"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};