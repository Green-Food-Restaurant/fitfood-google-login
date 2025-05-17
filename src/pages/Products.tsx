import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProdutos, filterProdutos, getProdutosByCategoria, getProdutosByPriceRange, ProductResponse } from '../services/productsService';
import { useCart } from 'react-use-cart';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductFilters from '../components/ProductFilters';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

// Definindo categorias exatamente como estão na API
const categorias = ['Todos', 'LANCHE', 'ACOMPANHAMENTO', 'BEBIDA', 'SOBREMESA', 'SALADAS'];
const precos = ['Todos', 'Até R$ 15', 'R$ 15 a R$ 20', 'Acima de R$ 20'];

const Products = () => {
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [filtroPreco, setFiltroPreco] = useState('Todos');
  const [produtos, setProdutos] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const [addingToCart, setAddingToCart] = useState(null);
  const navigate = useNavigate();  // Efeito que redefine a página quando os filtros mudam
  useEffect(() => {
    setPage(0); // Reiniciar para a primeira página sempre que os filtros mudarem
  }, [filtroCategoria, filtroPreco]);
  
  // Efeito para carregar produtos
  useEffect(() => {
    setLoading(true);
    
    // Definir preços mínimo e máximo baseado no filtro selecionado
    let precoMinimo: number | undefined;
    let precoMaximo: number | undefined;
    
    if (filtroPreco === 'Até R$ 15') {
      precoMaximo = 15;
    } else if (filtroPreco === 'R$ 15 a R$ 20') {
      precoMinimo = 15;
      precoMaximo = 20;
    } else if (filtroPreco === 'Acima de R$ 20') {
      precoMinimo = 20;
    }    // Definir a categoria - garantindo que seja exatamente o valor que a API espera
    // A API espera valores em maiúsculo como SALADAS, LANCHE, etc.
    const categoria = filtroCategoria === 'Todos' ? undefined : filtroCategoria;
    
    // Adicionar um pequeno delay para mostrar o loading
    const loadTimeout = setTimeout(() => {
      // Chamar a API com os filtros apropriados
      filterProdutos(
        {
          category: categoria,
          precoMinimo: precoMinimo,
          precoMaximo: precoMaximo,
          ativo: true // Mostrar apenas produtos ativos
        },
        page, // Usar a página atual
        10,
        'nomeProduto',
        'asc'
      )        .then(data => {
          // Aplicar os resultados ao estado
          setProdutos(data.content || []);
          setTotalPages(Math.max(data.totalPages || 0, 1)); // Garantir que sempre tenha pelo menos 1 página
        })
        .catch(error => {
          console.error("Erro ao buscar produtos:", error);
          // Feedback visual para o usuário
          toast.error("Erro ao carregar produtos. Tente novamente.");
          setProdutos([]);
          setTotalPages(1);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300); // Delay pequeno para mostrar o loading
    
    // Limpeza do timeout se o componente desmontar ou os filtros mudarem novamente
    return () => clearTimeout(loadTimeout);
  }, [page, filtroCategoria, filtroPreco]);
  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(prevPage => prevPage - 1);
    }
  };

  const handleAddToCart = (produto) => {
    setAddingToCart(produto.id);
    const item = {
      id: produto.id,
      name: produto.nomeProduto || produto.nome,
      price: produto.preco,
      image: produto.urlImage || produto.imagem,
      category: produto.category || produto.categoria,
    };
    addItem(item, 1);
    toast.success(`${produto.nomeProduto || produto.nome} adicionado ao carrinho!`);
    
    setTimeout(() => setAddingToCart(null), 500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.5
      }
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-[#F4FDF2] dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Navbar />

      <motion.main 
        className="flex-grow px-4 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h1 
            className="text-3xl font-bold text-center mb-6 text-green-800 dark:text-green-400"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
          >
            Nossos Produtos
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <ProductFilters 
              categorias={categorias} 
              precos={precos}
              filtroCategoria={filtroCategoria}
              filtroPreco={filtroPreco}
              setFiltroCategoria={setFiltroCategoria}
              setFiltroPreco={setFiltroPreco}
            />
          </motion.div>          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex justify-center py-20"
              >
                <LoadingSpinner />
              </motion.div>
            ) : produtos.length > 0 ? (
              <motion.div 
                key="produtos"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {produtos.map((produto, index) => (
                  <motion.div 
                    key={produto.id}
                    variants={itemVariants}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ 
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <ProductCard 
                      produto={produto}
                      onAddToCart={handleAddToCart}
                      isAddingToCart={addingToCart === produto.id}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (              <motion.div 
                key="empty"
                className="col-span-full text-center py-20 flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <p className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Nenhum produto encontrado
                </p>                <p className="text-gray-400 dark:text-gray-500 max-w-md">                  {filtroCategoria === 'Todos' 
                    ? 'Não encontramos nenhum produto disponível no momento.' 
                    : `Não encontramos nenhum produto na categoria "${
                        filtroCategoria === 'LANCHE' ? 'Lanches' : 
                        filtroCategoria === 'BEBIDA' ? 'Bebidas' : 
                        filtroCategoria === 'SOBREMESA' ? 'Sobremesas' : 
                        filtroCategoria === 'ACOMPANHAMENTO' ? 'Acompanhamentos' : 
                        filtroCategoria === 'SALADAS' ? 'Saladas' : 
                        filtroCategoria
                      }"`}
                  {filtroPreco !== 'Todos' ? ` com o preço ${filtroPreco}` : ''}.
                  <br />
                  Tente outros filtros ou volte mais tarde.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-8"
          >
            <Pagination 
              currentPage={page}
              totalPages={totalPages}
              onPrevious={handlePreviousPage}
              onNext={handleNextPage}
            />
          </motion.div>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
};

export default Products;
