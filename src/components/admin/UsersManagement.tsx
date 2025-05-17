import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  UserPlus, 
  UserCheck, 
  UserMinus,
  UserX,
  Mail,
  Phone,
  Calendar,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipo para os usuários
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  status: 'active' | 'blocked';
  createdAt: string;
  orders: number;
  totalSpent: number;
  avatar?: string;
}

// Dados simulados para os usuários
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    phone: '(11) 98765-4321',
    role: 'customer',
    status: 'active',
    createdAt: '2024-10-15T14:30:00',
    orders: 8,
    totalSpent: 523.45,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana'
  },
  {
    id: 2,
    name: 'Lucas Mendes',
    email: 'lucas.m@email.com',
    phone: '(11) 91234-5678',
    role: 'customer',
    status: 'active',
    createdAt: '2024-11-22T09:15:00',
    orders: 5,
    totalSpent: 289.70,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas'
  },
  {
    id: 3,
    name: 'Mariana Costa',
    email: 'mari.costa@email.com',
    phone: '(11) 99876-5432',
    role: 'customer',
    status: 'blocked',
    createdAt: '2025-01-08T16:45:00',
    orders: 2,
    totalSpent: 118.50,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana'
  },
  {
    id: 4,
    name: 'Rafael Santos',
    email: 'rafael.s@email.com',
    phone: '(11) 95555-9876',
    role: 'admin',
    status: 'active',
    createdAt: '2024-09-05T11:20:00',
    orders: 0,
    totalSpent: 0,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafael'
  },
  {
    id: 5,
    name: 'Camila Oliveira',
    email: 'camila.o@email.com',
    phone: '(11) 94444-3333',
    role: 'customer',
    status: 'active',
    createdAt: '2025-02-14T13:50:00',
    orders: 3,
    totalSpent: 178.30,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Camila'
  },
];

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openUserDialog, setOpenUserDialog] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Estado simulado para a paginação
  const [pagination, setPagination] = useState({
    page: 0,
    totalPages: 2,
    totalItems: 15
  });

  // Carregar usuários (simulado)
  useEffect(() => {
    // Simular um atraso de carregamento
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM, yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Função para adicionar um novo usuário
  const handleAddUser = () => {
    setSelectedUser({
      id: 0,
      name: '',
      email: '',
      phone: '',
      role: 'customer',
      status: 'active',
      createdAt: new Date().toISOString(),
      orders: 0,
      totalSpent: 0
    });
    setIsEditMode(false);
    setOpenUserDialog(true);
  };

  // Função para editar um usuário existente
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditMode(true);
    setOpenUserDialog(true);
  };

  // Função para alterar o status de um usuário
  const handleToggleUserStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' } 
        : user
    ));
  };

  // Função para submeter o formulário (adicionar/editar usuário)
  const handleSubmitUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      if (isEditMode) {
        // Atualizar usuário existente
        setUsers(users.map(user => 
          user.id === selectedUser.id ? selectedUser : user
        ));
      } else {
        // Adicionar novo usuário
        const newUser = {
          ...selectedUser,
          id: Math.max(...users.map(u => u.id)) + 1,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`
        };
        setUsers([...users, newUser]);
      }
      
      setIsSubmitting(false);
      setOpenUserDialog(false);
    }, 1000); // Simulando um delay de API
  };

  // Filtrar usuários pelos termos de busca e filtros
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
      
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gerenciamento de Usuários</h1>
        
        <Button onClick={handleAddUser} className="bg-green-600 hover:bg-green-700">
          <UserPlus className="mr-2 h-4 w-4" /> Adicionar Usuário
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Usuários</CardTitle>
          <CardDescription>Gerencie os usuários da plataforma.</CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Filtros e pesquisa */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar por nome, email ou telefone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="customer">Cliente</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="blocked">Bloqueado</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Tabela de usuários */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-green-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead className="text-center">Pedidos</TableHead>
                    <TableHead className="text-right">Total Gasto</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <span className="text-xs">{user.name.charAt(0)}</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'outline'} className={
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-200' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }>
                            {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm">{formatDate(user.createdAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{user.orders}</TableCell>
                        <TableCell className="text-right font-medium">
                          {user.totalSpent > 0 ? `R$ ${user.totalSpent.toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-900'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900'
                          }>
                            {user.status === 'active' ? 'Ativo' : 'Bloqueado'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditUser(user)}
                            >
                              <UserCheck className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleToggleUserStatus(user.id)}
                            >
                              {user.status === 'active' ? (
                                <UserX className="h-4 w-4 text-red-500" />
                              ) : (
                                <UserCheck className="h-4 w-4 text-green-500" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-gray-500 dark:text-gray-400">
                        Nenhum usuário encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Paginação */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Mostrando {Math.min(pagination.totalItems, filteredUsers.length)} de {pagination.totalItems} resultados
            </div>
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" disabled={pagination.page === 0}>
                Anterior
              </Button>
              <Button variant="outline" size="sm" disabled={pagination.page >= pagination.totalPages - 1}>
                Próxima
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Modal para adicionar/editar usuário */}
      <Dialog open={openUserDialog} onOpenChange={setOpenUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Atualize as informações do usuário abaixo.' 
                : 'Preencha as informações do novo usuário.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitUser} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input 
                  id="name" 
                  value={selectedUser?.name || ''} 
                  onChange={(e) => setSelectedUser(prev => prev ? {...prev, name: e.target.value} : null)} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    id="email" 
                    type="email"
                    className="pl-10"
                    value={selectedUser?.email || ''} 
                    onChange={(e) => setSelectedUser(prev => prev ? {...prev, email: e.target.value} : null)} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    id="phone" 
                    className="pl-10"
                    value={selectedUser?.phone || ''} 
                    onChange={(e) => setSelectedUser(prev => prev ? {...prev, phone: e.target.value} : null)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Select 
                  value={selectedUser?.role} 
                  onValueChange={(value: 'admin' | 'customer') => setSelectedUser(prev => prev ? {...prev, role: value} : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="customer">Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {isEditMode && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={selectedUser?.status} 
                    onValueChange={(value: 'active' | 'blocked') => setSelectedUser(prev => prev ? {...prev, status: value} : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="blocked">Bloqueado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setOpenUserDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isEditMode ? (
                  'Salvar Alterações'
                ) : (
                  'Adicionar Usuário'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagement;
