import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, ShoppingBag, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Dados simulados para o dashboard
const dashboardData = {
  totalSales: {
    value: 'R$ 24.875,00',
    percentage: 12.5,
    increasing: true
  },
  totalOrders: {
    value: '384',
    percentage: 8.2,
    increasing: true
  },
  totalCustomers: {
    value: '1.428',
    percentage: 4.6,
    increasing: true
  },
  averageOrder: {
    value: 'R$ 64,78',
    percentage: 2.1,
    increasing: false
  }
};

// Dados simulados para os produtos mais vendidos
const topProducts = [
  { id: 1, name: 'Salada Caesar com Frango', sales: 145, revenue: 'R$ 2.175,00' },
  { id: 2, name: 'Bowl de Açaí Premium', sales: 132, revenue: 'R$ 1.980,00' },
  { id: 3, name: 'Smoothie Verde Detox', sales: 118, revenue: 'R$ 1.416,00' },
  { id: 4, name: 'Sanduíche de Frango Fit', sales: 97, revenue: 'R$ 1.358,00' },
  { id: 5, name: 'Wrap Vegetariano', sales: 89, revenue: 'R$ 1.157,00' },
];

// Dados simulados para os pedidos recentes
const recentOrders = [
  { id: '#12345', customer: 'Ana Silva', date: '15/05/2025', status: 'Entregue', total: 'R$ 78,50' },
  { id: '#12344', customer: 'Lucas Mendes', date: '15/05/2025', status: 'Em preparo', total: 'R$ 124,90' },
  { id: '#12343', customer: 'Mariana Costa', date: '14/05/2025', status: 'Em trânsito', total: 'R$ 67,20' },
  { id: '#12342', customer: 'Rafael Santos', date: '14/05/2025', status: 'Entregue', total: 'R$ 92,80' },
  { id: '#12341', customer: 'Camila Oliveira', date: '13/05/2025', status: 'Entregue', total: 'R$ 45,50' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
      
      {/* Cartões de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Vendas totais */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Vendas Totais</CardDescription>
            <CardTitle className="text-2xl">{dashboardData.totalSales.value}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center">
              <div className={`flex items-center ${dashboardData.totalSales.increasing ? 'text-green-500' : 'text-red-500'} text-sm font-medium`}>
                {dashboardData.totalSales.increasing ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
                {dashboardData.totalSales.percentage}%
              </div>
              <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Total de pedidos */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Pedidos</CardDescription>
            <CardTitle className="text-2xl">{dashboardData.totalOrders.value}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center">
              <div className={`flex items-center ${dashboardData.totalOrders.increasing ? 'text-green-500' : 'text-red-500'} text-sm font-medium`}>
                {dashboardData.totalOrders.increasing ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
                {dashboardData.totalOrders.percentage}%
              </div>
              <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Total de clientes */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Clientes</CardDescription>
            <CardTitle className="text-2xl">{dashboardData.totalCustomers.value}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center">
              <div className={`flex items-center ${dashboardData.totalCustomers.increasing ? 'text-green-500' : 'text-red-500'} text-sm font-medium`}>
                {dashboardData.totalCustomers.increasing ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
                {dashboardData.totalCustomers.percentage}%
              </div>
              <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Valor médio do pedido */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Valor Médio do Pedido</CardDescription>
            <CardTitle className="text-2xl">{dashboardData.averageOrder.value}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center">
              <div className={`flex items-center ${dashboardData.averageOrder.increasing ? 'text-green-500' : 'text-red-500'} text-sm font-medium`}>
                {dashboardData.averageOrder.increasing ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
                {dashboardData.averageOrder.percentage}%
              </div>
              <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Seção principal do dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico simulado de vendas (2/3 width) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visão Geral de Vendas</CardTitle>
            <CardDescription>Vendas dos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Visualização de gráfico de tendências</p>
              {/* Aqui você pode adicionar uma biblioteca de gráficos como Recharts ou Chart.js */}
            </div>
          </CardContent>
        </Card>
        
        {/* Produtos mais vendidos (1/3 width) */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>Top 5 produtos por volume de vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                      index === 0 ? 'bg-yellow-100 text-yellow-600' : 
                      index === 1 ? 'bg-gray-100 text-gray-600' : 
                      index === 2 ? 'bg-orange-100 text-orange-600' : 
                      'bg-green-100 text-green-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{product.sales} vendas</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium">{product.revenue}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Pedidos recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
          <CardDescription>Os últimos 5 pedidos realizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3">ID Pedido</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3 text-sm font-medium">{order.id}</td>
                    <td className="px-4 py-3 text-sm">{order.customer}</td>
                    <td className="px-4 py-3 text-sm">{order.date}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Entregue' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        order.status === 'Em trânsito' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <a href="#" className="text-sm text-green-600 dark:text-green-400 hover:underline">Ver todos os pedidos</a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;
