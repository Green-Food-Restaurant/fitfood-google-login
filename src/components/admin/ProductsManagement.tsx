import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Filter, 
  ArrowUpDown,
  Eye,
  Check,
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getProdutos } from '@/services/productsService';

// Tipo para os produtos
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
  active: boolean;
}

const ProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Estado simulado para a paginação
  const [pagination, setPagination] = useState({
    page: 0,
    totalPages: 5,
    totalItems: 50
  });

  // Carregar produtos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProdutos();
        
        // Adaptar a resposta da API ao formato que estamos utilizando
        // Isso pode variar dependendo da estrutura exata da resposta da API
        if (data && data.content) {
          setProducts(data.content.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
            price: item.price,
            category: item.category || 'Sem categoria',
            image: item.image || 'https://via.placeholder.com/50',
            stock: item.stock || 100,
            active: item.active !== undefined ? item.active : true
          })));
          
          setPagination({
            page: data.number || 0,
            totalPages: data.totalPages || 1,
            totalItems: data.totalElements || data.content.length
          });
        } else {
          // Dados simulados se a API não retornar resultados
          setProducts([
            { id: 1, name: 'Salada Caesar com Frango', description: 'Salada fresca com peito de frango grelhado', price: 24.90, category: 'Saladas', stock: 50, active: true },
            { id: 2, name: 'Bowl de Açaí Premium', description: 'Açaí batido com guaraná e frutas da estação', price: 19.90, category: 'Sobremesas', stock: 30, active: true },
            { id: 3, name: 'Smoothie Verde Detox', description: 'Blend de vegetais verdes com maçã e gengibre', price: 15.90, category: 'Bebidas', stock: 45, active: true },
            { id: 4, name: 'Wrap Vegetariano', description: 'Recheado com legumes grelhados e homus', price: 18.50, category: 'Lanches', stock: 25, active: true },
            { id: 5, name: 'Sanduíche de Frango Fit', description: 'Peito de frango com abacate e pão integral', price: 22.90, category: 'Lanches', stock: 40, active: true },
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        // Fallback para dados simulados em caso de erro
        setProducts([
          { id: 1, name: 'Salada Caesar com Frango', description: 'Salada fresca com peito de frango grelhado', price: 24.90, category: 'Saladas', stock: 50, active: true },
          { id: 2, name: 'Bowl de Açaí Premium', description: 'Açaí batido com guaraná e frutas da estação', price: 19.90, category: 'Sobremesas', stock: 30, active: true },
          { id: 3, name: 'Smoothie Verde Detox', description: 'Blend de vegetais verdes com maçã e gengibre', price: 15.90, category: 'Bebidas', stock: 45, active: true },
          { id: 4, name: 'Wrap Vegetariano', description: 'Recheado com legumes grelhados e homus', price: 18.50, category: 'Lanches', stock: 25, active: true },
          { id: 5, name: 'Sanduíche de Frango Fit', description: 'Peito de frango com abacate e pão integral', price: 22.90, category: 'Lanches', stock: 40, active: true },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Função para abrir o diálogo para adicionar um novo produto
  const handleAddProduct = () => {
    setCurrentProduct({
      id: 0,
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      active: true
    });
    setIsEditMode(false);
    setOpenDialog(true);
  };

  // Função para abrir o diálogo para editar um produto existente
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsEditMode(true);
    setOpenDialog(true);
  };

  // Função para excluir um produto
  const handleDeleteProduct = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(products.filter(product => product.id !== id));
      // Aqui você chamaria a API para excluir o produto
      // await deleteProduct(id);
    }
  };

  // Função para lidar com a mudança de status (ativo/inativo)
  const handleToggleStatus = (id: number) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, active: !product.active } : product
    ));
    // Aqui você chamaria a API para atualizar o status do produto
    // await updateProductStatus(id, !product.active);
  };

  // Função para submeter o formulário (adicionar/editar produto)
  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentProduct) return;
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      if (isEditMode) {
        // Atualizar produto existente
        setProducts(products.map(product => 
          product.id === currentProduct.id ? currentProduct : product
        ));
        // Aqui você chamaria a API para atualizar o produto
        // await updateProduct(currentProduct);
      } else {
        // Adicionar novo produto
        const newProduct = {
          ...currentProduct,
          id: Math.max(...products.map(p => p.id)) + 1
        };
        setProducts([...products, newProduct]);
        // Aqui você chamaria a API para criar um novo produto
        // await createProduct(newProduct);
      }
      
      setIsSubmitting(false);
      setOpenDialog(false);
    }, 1000); // Simulando um delay de API
  };

  // Função para filtrar produtos pelo termo de busca
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gerenciamento de Produtos</h1>
        
        <Button onClick={handleAddProduct} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" /> Adicionar Produto
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Produtos</CardTitle>
          <CardDescription>Gerencie todos os produtos disponíveis na plataforma.</CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Filtros e pesquisa */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar produtos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex space-x-2">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categorias</SelectLabel>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="saladas">Saladas</SelectItem>
                    <SelectItem value="lanches">Lanches</SelectItem>
                    <SelectItem value="bebidas">Bebidas</SelectItem>
                    <SelectItem value="sobremesas">Sobremesas</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Tabela de produtos */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-green-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Produto <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Preço</TableHead>
                    <TableHead className="text-center">Estoque</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                            ) : (
                              <span className="text-xs text-gray-500">Sem img</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{product.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                            {product.category}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">R$ {product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-center">{product.stock}</TableCell>
                        <TableCell className="text-center">
                          <button
                            onClick={() => handleToggleStatus(product.id)}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                              product.active 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            {product.active ? 'Ativo' : 'Inativo'}
                          </button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-gray-500 dark:text-gray-400">
                        Nenhum produto encontrado
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
              Mostrando {Math.min(pagination.totalItems, 10)} de {pagination.totalItems} resultados
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
      
      {/* Modal para adicionar/editar produto */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Atualize os detalhes do produto abaixo.' 
                : 'Preencha os detalhes do novo produto.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitProduct} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input 
                  id="name" 
                  value={currentProduct?.name || ''} 
                  onChange={(e) => setCurrentProduct(prev => prev ? {...prev, name: e.target.value} : null)} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  value={currentProduct?.description || ''} 
                  onChange={(e) => setCurrentProduct(prev => prev ? {...prev, description: e.target.value} : null)} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    step="0.01" 
                    value={currentProduct?.price || 0} 
                    onChange={(e) => setCurrentProduct(prev => prev ? {...prev, price: parseFloat(e.target.value)} : null)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Estoque</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    value={currentProduct?.stock || 0} 
                    onChange={(e) => setCurrentProduct(prev => prev ? {...prev, stock: parseInt(e.target.value)} : null)} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={currentProduct?.category} 
                  onValueChange={(value) => setCurrentProduct(prev => prev ? {...prev, category: value} : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Saladas">Saladas</SelectItem>
                    <SelectItem value="Lanches">Lanches</SelectItem>
                    <SelectItem value="Bebidas">Bebidas</SelectItem>
                    <SelectItem value="Sobremesas">Sobremesas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">URL da Imagem</Label>
                <Input 
                  id="image" 
                  value={currentProduct?.image || ''} 
                  onChange={(e) => setCurrentProduct(prev => prev ? {...prev, image: e.target.value} : null)} 
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setOpenDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isEditMode ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {isEditMode ? 'Salvar Alterações' : 'Adicionar Produto'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsManagement;
