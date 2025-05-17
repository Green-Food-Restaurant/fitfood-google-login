import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getPlaceholderByCategory } from '@/utils/placeholders';
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
import { 
  getProdutos, 
  createProduto, 
  updateProduto, 
  deleteProduto, 
  activateProduto,
  deactivateProduto,
  filterProdutos,
  getProdutosByCategoria,
  uploadProdutoImage,
  ProductRequest,
  ProductResponse
} from '@/services/productsService';
import { toast } from 'sonner';

// Tipo para os produtos que vamos usar internamente na interface administrativa
interface Product {
  id: number;
  name: string;           // Mapped from nomeProduto
  description: string;    // Mapped from descricao
  price: number;          // Mapped from preco
  category: string;       // Mapped from category
  image?: string;         // Mapped from urlImage
  stock: number;          // Mapped from estoque
  active: boolean;        // Mapped from ativo
}

// Função auxiliar para obter o caminho correto do placeholder baseado na categoria
const getProductImagePath = (product: Product) => {
  // Se tem uma imagem válida, use-a
  if (product.image && product.image !== 'null' && product.image !== 'undefined' && product.image.trim() !== '') {
    return product.image;
  }

  // Caso contrário, use um placeholder baseado na categoria
  return getPlaceholderByCategory(product.category);
};

const ProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Estado simulado para a paginação
  const [pagination, setPagination] = useState({
    page: 0,
    totalPages: 5,
    totalItems: 50
  });  // Carregar produtos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data;
        
        // Se houver uma categoria selecionada diferente de 'all', usamos o filtro por categoria
        if (selectedCategory !== 'all') {
          data = await getProdutosByCategoria(selectedCategory, pagination.page, 10, 'nomeProduto');
        } else {
          data = await getProdutos(pagination.page, 10, 'id');
        }
        
        // Mapear a resposta da API para o formato da interface
        if (data && data.content) {
          setProducts(data.content.map((item: ProductResponse) => ({
            id: item.id,
            name: item.nomeProduto,
            description: item.descricao || '',
            price: item.preco,
            category: item.category || 'Sem categoria',
            // Garantir que valores null, undefined ou strings inválidas sejam tratados como ausentes
            image: (item.urlImage && item.urlImage !== 'null' && item.urlImage !== 'undefined' && item.urlImage.trim() !== '') 
              ? item.urlImage 
              : null,
            stock: item.estoque || 0,
            active: item.ativo !== undefined ? item.ativo : true
          })));
          
          setPagination({
            page: data.number,
            totalPages: data.totalPages,
            totalItems: data.totalElements
          });
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        toast.error('Não foi possível carregar a lista de produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pagination.page, selectedCategory]);

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
  const handleDeleteProduct = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        setLoading(true);
        await deleteProduto(id);
        setProducts(products.filter(product => product.id !== id));
        toast.success('Produto excluído com sucesso');
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        toast.error('Não foi possível excluir o produto');
      } finally {
        setLoading(false);
      }
    }
  };
  // Função para lidar com a mudança de status (ativo/inativo)
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      setLoading(true);
      
      if (currentStatus) {
        // Se estiver ativo, desativar
        await deactivateProduto(id);
      } else {
        // Se estiver inativo, ativar
        await activateProduto(id);
      }
      
      // Atualizar o estado local
      setProducts(products.map(product => 
        product.id === id ? { ...product, active: !currentStatus } : product
      ));
      
      toast.success(`Produto ${currentStatus ? 'desativado' : 'ativado'} com sucesso`);
    } catch (error) {
      console.error('Erro ao alterar status do produto:', error);
      toast.error('Não foi possível alterar o status do produto');
    } finally {
      setLoading(false);
    }
  };
  // Função para submeter o formulário (adicionar/editar produto)
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentProduct) return;
    
    setIsSubmitting(true);
    
    try {
      // Mapear do formato da interface para o formato da API
      const productRequest: ProductRequest = {
        nameProduct: currentProduct.name,
        price: currentProduct.price,
        category: currentProduct.category,
        description: currentProduct.description,
        estoque: currentProduct.stock,
        ativo: currentProduct.active,
        imageUrl: currentProduct.image
      };
      
      let updatedProduct: ProductResponse;
      
      if (isEditMode) {
        // Atualizar produto existente
        updatedProduct = await updateProduto(currentProduct.id, productRequest);
        
        // Atualizar a lista local
        setProducts(products.map(product => 
          product.id === currentProduct.id ? {
            id: updatedProduct.id,
            name: updatedProduct.nomeProduto,
            description: updatedProduct.descricao || '',
            price: updatedProduct.preco,
            category: updatedProduct.category,
            image: updatedProduct.urlImage || '',
            stock: updatedProduct.estoque,
            active: updatedProduct.ativo
          } : product
        ));
        
        toast.success('Produto atualizado com sucesso');
      } else {
        // Adicionar novo produto
        updatedProduct = await createProduto(productRequest);
        
        // Adicionar à lista local
        const newProduct = {
          id: updatedProduct.id,
          name: updatedProduct.nomeProduto,
          description: updatedProduct.descricao || '',
          price: updatedProduct.preco,
          category: updatedProduct.category,
          image: updatedProduct.urlImage || '',
          stock: updatedProduct.estoque,
          active: updatedProduct.ativo
        };
        
        setProducts([...products, newProduct]);
        toast.success('Produto criado com sucesso');
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast.error(`Não foi possível ${isEditMode ? 'atualizar' : 'criar'} o produto`);
    } finally {
      setIsSubmitting(false);
      setOpenDialog(false);
    }
  };  // Função para filtrar produtos pelo termo de busca (apenas filtragem local pelo texto)
  const filteredProducts = products.filter(product => {
    // Se não há termo de busca, mostramos todos os produtos (que já estão filtrados por categoria pelo useEffect)
    if (!searchTerm.trim()) return true;
    
    // Filtramos apenas pelo termo de busca, pois a filtragem por categoria já é feita na API
    return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />              <Input 
                placeholder="Buscar produtos..." 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // Se o usuário limpar a busca, recarregamos os produtos com a categoria atual
                  if (e.target.value === '') {
                    // Recarregamos a página atual
                    setPagination(prev => ({ ...prev }));
                  }
                }}
                className={`pl-10 ${searchTerm ? 'border-green-500 dark:border-green-500' : ''}`}
              />
            </div>
            
            <div className="flex space-x-2">              <Select 
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className={`w-[180px] ${selectedCategory !== 'all' ? 'border-green-500 dark:border-green-500' : ''}`}>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categorias</SelectLabel>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="SALADAS">Saladas</SelectItem>
                    <SelectItem value="LANCHE">Lanches</SelectItem>
                    <SelectItem value="BEBIDA">Bebidas</SelectItem>
                    <SelectItem value="SOBREMESA">Sobremesas</SelectItem>
                    <SelectItem value="ACOMPANHAMENTO">Acompanhamentos</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select><Button 
                variant="outline" 
                size="icon" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  // Forçar o recarregamento dos produtos
                  setPagination(prev => ({ ...prev, page: 0 }));
                }}
                title="Limpar filtros"
              >
                <X className="h-4 w-4" />
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
              {/* Indicador de filtro ativo */}
              {selectedCategory !== 'all' && (
                <div className="mb-4 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-center">
                  <Filter className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-green-700 dark:text-green-400">
                    Filtrando por: {selectedCategory === 'LANCHE' ? 'Lanches' : 
                                  selectedCategory === 'BEBIDA' ? 'Bebidas' : 
                                  selectedCategory === 'SOBREMESA' ? 'Sobremesas' : 
                                  selectedCategory === 'ACOMPANHAMENTO' ? 'Acompanhamentos' : 
                                  selectedCategory === 'SALADAS' ? 'Saladas' : selectedCategory}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-auto text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 p-1 h-auto"
                    onClick={() => {
                      setSelectedCategory('all');
                      // Recarregar a página atual
                      setPagination(prev => ({ ...prev }));
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
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
                      <TableRow key={product.id}>                        <TableCell>
                          <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                            <img 
                              src={getProductImagePath(product)} 
                              alt={product.name}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                // Se a imagem principal falhou, tente usar o placeholder genérico
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
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
                        <TableCell className="text-center">{product.stock}</TableCell>                        <TableCell className="text-center">
                          <button
                            onClick={() => handleToggleStatus(product.id, product.active)}
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
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.page === 0 || loading}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Anterior
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.page >= pagination.totalPages - 1 || loading}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
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
                    <SelectItem value="SALADAS">Saladas</SelectItem>
                    <SelectItem value="LANCHE">Lanche</SelectItem>
                    <SelectItem value="BEBIDA">Bebida</SelectItem>
                    <SelectItem value="SOBREMESA">Sobremesa</SelectItem>
                    <SelectItem value="ACOMPANHAMENTO">Acompanhamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>              <div className="space-y-2">
                <Label htmlFor="image">URL da Imagem</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="image" 
                    value={currentProduct?.image || ''} 
                    onChange={(e) => setCurrentProduct(prev => prev ? {...prev, image: e.target.value} : null)} 
                  />
                  {currentProduct?.category && (
                    <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                      <img 
                        src={currentProduct?.image || getPlaceholderByCategory(currentProduct.category)} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          // Fallback para o placeholder genérico se tudo falhar
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  )}
                </div>
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
