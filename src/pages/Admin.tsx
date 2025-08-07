import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import ProductsManagement from '../components/admin/ProductsManagement';
import OrdersManagement from '../components/admin/OrdersManagement';
import Dashboard from '../components/admin/Dashboard';
import UsersManagement from '../components/admin/UsersManagement';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

// Tipo para as abas do painel de administração
type AdminTab = 'dashboard' | 'products' | 'orders' | 'users' | 'settings';

const Admin = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  // Renderize o componente apropriado com base na aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductsManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'users':
        return <UsersManagement />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAdmin) {
    // Renderizando um estado de carregamento enquanto verifica permissões
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar de navegação */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />

        {/* Conteúdo principal */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default Admin;
