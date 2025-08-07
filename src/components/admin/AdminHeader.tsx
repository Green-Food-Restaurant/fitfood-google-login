import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Search, Menu, X } from 'lucide-react';

type AdminHeaderProps = {
  toggleMobileSidebar?: () => void;
};

const AdminHeader: React.FC<AdminHeaderProps> = ({ toggleMobileSidebar }) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 md:px-6">
      {/* Botão do menu mobile */}
      <div className="flex items-center md:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleMobileSidebar}
          className="mr-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Título da seção (visível apenas em desktop) */}
      <div className="hidden md:block">
        <h1 className="text-xl font-semibold text-gray-800">Painel Administrativo</h1>
      </div>
      
      {/* Barra de busca */}
      <div className={`${showSearch ? 'flex absolute left-0 right-0 top-0 px-4 h-16 bg-white z-10 items-center border-b border-gray-200' : 'hidden md:flex'} flex-1 max-w-md mx-4`}>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Buscar..." 
            className="pl-10 pr-4 py-2 w-full bg-gray-100 focus:ring-green-500"
          />
          {showSearch && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 md:hidden"
              onClick={() => setShowSearch(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Ações do cabeçalho */}
      <div className="flex items-center space-x-2">
        {/* Botão de pesquisa mobile */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setShowSearch(true)}
        >
          <Search className="h-5 w-5" />
        </Button>
        
        {/* Notificações */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
        {/* Avatar do usuário */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" 
            alt="Admin" 
            className="w-8 h-8 rounded-full" 
          />
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
