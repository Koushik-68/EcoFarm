import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Sprout, MessageCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 flex-shrink-0">
        <Sidebar onLogout={handleLogout}>
          <nav>
            <Link 
              to="/crop-manual"
              className="flex items-center gap-2 p-2 hover:bg-green-50 rounded-lg"
            >
              <Sprout className="h-5 w-5 text-green-600" />
              <span>Crop Manual</span>
            </Link>
            <Link
              to="/chatbot"
              className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg ${
                location.pathname === '/chatbot' ? 'bg-gray-100' : ''
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span>AI Assistant</span>
            </Link>
          </nav>
        </Sidebar>
      </div>
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;