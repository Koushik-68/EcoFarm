import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, LayoutDashboard, FlaskRound as Flask, BarChart3, Calendar, BookOpen, Settings, Cloud, LogOut, MessageCircle, ShoppingBasket } from 'lucide-react';
import clsx from 'clsx';
import { logoutUser } from '../utils/auth';

interface SidebarProps {
  onLogout: () => void;
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, children }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    // { name: 'Soil Analysis', href: '/soil-input', icon: Flask },
    { name: 'Soil Analysis', href: '/soil-analysis', icon: Flask },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Weather', href: '/weather', icon: Cloud },
    { name: 'Planting Calendar', href: '/calendar', icon: Calendar },
    { name: 'Knowledge Base', href: '/knowledge', icon: BookOpen },
    { name: 'Chatbot', href: '/chatbot', icon: MessageCircle },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBasket },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
        <Sprout className="h-8 w-8 text-green-600" />
        <span className="text-xl font-semibold text-gray-900">EcoFarm</span>
      </div>

      <div className="flex-1 px-4 space-y-1 overflow-y-auto">
        <div className="px-2 py-4">
          <p className="text-sm font-medium text-gray-500">Welcome back,</p>
          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  location.pathname === item.href
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-600 hover:bg-gray-50',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
                )}
              >
                <Icon
                  className={clsx(
                    location.pathname === item.href
                      ? 'text-green-600'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 h-5 w-5 flex-shrink-0'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
          <Link 
            to="/crop-manual"
            className="flex items-center gap-2 p-2 hover:bg-green-50 rounded-lg"
          >
            <Sprout className="h-5 w-5 text-green-600" />
            <span>Crop Manual</span>
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            logoutUser();
            onLogout();
          }}
          className="flex items-center justify-center w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;