import React from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingBasket,
  Package,
  Users,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Tipo para as abas do painel de administração
type AdminTab = 'dashboard' | 'products' | 'orders' | 'users' | 'settings';

type AdminSidebarProps = {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
};

type SidebarItem = {
  id: AdminTab;
  label: string;
  icon: React.ReactNode;
};

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'products', label: 'Produtos', icon: <ShoppingBasket size={18} /> },
    { id: 'orders', label: 'Pedidos', icon: <Package size={18} /> },
    { id: 'users', label: 'Usuários', icon: <Users size={18} /> },
    { id: 'settings', label: 'Configurações', icon: <Settings size={18} /> },
  ];

  // Função para lidar com o logout
  const handleLogout = () => {
    // Implementação de logout (remover tokens, limpar localStorage, etc.)
    localStorage.removeItem('userRole');
    // Redirecionar para a página de login
    navigate('/');
  };

  return (
    <aside className="h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0 hidden md:block">
      {/* Logo */}
      <div className="flex items-center justify-start h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="bg-green-600 dark:bg-green-500 rounded-full p-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z"></path>
              <path d="M10 2c1 .5 2 2 2 5"></path>
            </svg>
          </div>
          <span className="ml-2 text-lg font-semibold text-green-600 dark:text-green-400">FitFood Admin</span>
        </div>
      </div>

      {/* Menu de navegação */}
      <nav className="px-4 py-6">
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors group",
                  activeTab === item.id
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
                <ChevronRight
                  size={16}
                  className={cn(
                    "ml-auto transition-transform",
                    activeTab === item.id ? "transform rotate-90" : "opacity-0 group-hover:opacity-100"
                  )}
                />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-10 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Sair
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
