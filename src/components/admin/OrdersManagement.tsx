import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  ChevronDown,
  Loader2,
  Calendar,
  X
} from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipo para os pedidos
interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  status: 'pendente' | 'preparando' | 'entregando' | 'entregue' | 'cancelado';
  items: OrderItem[];
  total: number;
  address: string;
}

// Dados simulados para os pedidos
const mockOrders: Order[] = [
  {
    id: '#12345',
    customerName: 'Ana Silva',
    email: 'ana.silva@email.com',
    phone: '(11) 98765-4321',
    date: '2025-05-15T14:30:00',
    status: 'entregue',
    items: [
      { id: 1, name: 'Salada Caesar com Frango', price: 24.90, quantity: 1 },
      { id: 3, name: 'Smoothie Verde Detox', price: 15.90, quantity: 2 }
    ],
    total: 56.70,
    address: 'Av. Paulista, 1000, ap. 50, São Paulo, SP'
  },
  {
    id: '#12344',
    customerName: 'Lucas Mendes',
    email: 'lucas.m@email.com',
    phone: '(11) 91234-5678',
    date: '2025-05-15T12:15:00',
    status: 'preparando',
    items: [
      { id: 2, name: 'Bowl de Açaí Premium', price: 19.90, quantity: 2 },
      { id: 5, name: 'Sanduíche de Frango Fit', price: 22.90, quantity: 1 },
      { id: 3, name: 'Smoothie Verde Detox', price: 15.90, quantity: 3 }
    ],
    total: 114.40,
    address: 'Rua Augusta, 500, Casa 2, São Paulo, SP'
  },
  {
    id: '#12343',
    customerName: 'Mariana Costa',
    email: 'mari.costa@email.com',
    phone: '(11) 99876-5432',
    date: '2025-05-14T18:45:00',
    status: 'entregando',
    items: [
      { id: 4, name: 'Wrap Vegetariano', price: 18.50, quantity: 2 },
      { id: 3, name: 'Smoothie Verde Detox', price: 15.90, quantity: 1 }
    ],
    total: 52.90,
    address: 'Rua Oscar Freire, 200, ap. 104, São Paulo, SP'
  },
  {
    id: '#12342',
    customerName: 'Rafael Santos',
    email: 'rafael.s@email.com',
    phone: '(11) 95555-9876',
    date: '2025-05-14T10:30:00',
    status: 'entregue',
    items: [
      { id: 1, name: 'Salada Caesar com Frango', price: 24.90, quantity: 1 },
      { id: 5, name: 'Sanduíche de Frango Fit', price: 22.90, quantity: 1 },
      { id: 2, name: 'Bowl de Açaí Premium', price: 19.90, quantity: 1 }
    ],
    total: 67.70,
    address: 'Alameda Santos, 800, ap. 75, São Paulo, SP'
  },
  {
    id: '#12341',
    customerName: 'Camila Oliveira',
    email: 'camila.o@email.com',
    phone: '(11) 94444-3333',
    date: '2025-05-13T17:20:00',
    status: 'entregue',
    items: [
      { id: 3, name: 'Smoothie Verde Detox', price: 15.90, quantity: 2 }
    ],
    total: 31.80,
    address: 'Rua dos Pinheiros, 300, São Paulo, SP'
  },
];

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);

  // Estado simulado para a paginação
  const [pagination, setPagination] = useState({
    page: 0,
    totalPages: 3,
    totalItems: 12
  });

  // Carregar pedidos (simulado)
  useEffect(() => {
    // Simular um atraso de carregamento
    const timer = setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Função para visualizar os detalhes de um pedido
  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setOpenDetailsDialog(true);
  };

  // Função para atualizar o status de um pedido
  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Função para obter a classe de cor baseada no status do pedido
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
      case 'preparando':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
      case 'entregando':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500';
      case 'entregue':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      case 'cancelado':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Filtrar pedidos pelo termo de busca e status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gerenciamento de Pedidos</h1>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Pedidos</CardTitle>
          <CardDescription>Gerencie todos os pedidos feitos na plataforma.</CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Filtros e pesquisa */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar pedidos por ID ou cliente..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="preparando">Em Preparo</SelectItem>
                    <SelectItem value="entregando">Em Entrega</SelectItem>
                    <SelectItem value="entregue">Entregue</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Tabela de pedidos */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-green-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center">
                        ID Pedido <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Data <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p>{order.customerName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{order.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{new Date(order.date).toLocaleDateString('pt-BR')}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(order.date).toLocaleTimeString('pt-BR')}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">R$ {order.total.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleViewOrderDetails(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-gray-500 dark:text-gray-400">
                        Nenhum pedido encontrado
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
              Mostrando {Math.min(pagination.totalItems, filteredOrders.length)} de {pagination.totalItems} resultados
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
      
      {/* Modal de detalhes do pedido */}
      <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Detalhes do Pedido {selectedOrder?.id}</span>
              <Badge className={selectedOrder ? getStatusColor(selectedOrder.status) : ''}>
                {selectedOrder?.status.charAt(0).toUpperCase() + selectedOrder?.status.slice(1)}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Informações do cliente */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Informações do Cliente</h3>
                <div className="mt-2 space-y-1">
                  <p className="font-medium">{selectedOrder.customerName}</p>
                  <p className="text-sm">{selectedOrder.email}</p>
                  <p className="text-sm">{selectedOrder.phone}</p>
                </div>
              </div>
              
              {/* Endereço de entrega */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Endereço de Entrega</h3>
                <p className="mt-2 text-sm">{selectedOrder.address}</p>
              </div>
              
              {/* Data e hora */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Data e Hora</h3>
                <p className="mt-2 text-sm">{formatDate(selectedOrder.date)}</p>
              </div>
              
              {/* Itens do pedido */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Itens do Pedido</h3>
                <div className="mt-2 border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                        <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qtde</th>
                        <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Preço</th>
                        <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm">{item.name}</td>
                          <td className="px-4 py-2 text-sm text-center">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-right">R$ {item.price.toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm font-medium text-right">R$ {(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-sm font-medium text-right">Total</td>
                        <td className="px-4 py-2 text-sm font-bold text-right">R$ {selectedOrder.total.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              {/* Atualizar status */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Atualizar Status</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={selectedOrder.status === 'pendente' ? 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-800' : ''}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'pendente')}
                  >
                    Pendente
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={selectedOrder.status === 'preparando' ? 'bg-blue-100 border-blue-300 dark:bg-blue-900/20 dark:border-blue-800' : ''}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'preparando')}
                  >
                    Em Preparo
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={selectedOrder.status === 'entregando' ? 'bg-purple-100 border-purple-300 dark:bg-purple-900/20 dark:border-purple-800' : ''}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'entregando')}
                  >
                    Em Entrega
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={selectedOrder.status === 'entregue' ? 'bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-800' : ''}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'entregue')}
                  >
                    Entregue
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={selectedOrder.status === 'cancelado' ? 'bg-red-100 border-red-300 dark:bg-red-900/20 dark:border-red-800' : ''}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelado')}
                  >
                    Cancelado
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManagement;
