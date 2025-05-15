import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProdutos } from '../services/productsService';
import { useCart } from 'react-use-cart';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductFilters from '../components/ProductFilters';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

const categorias = ['Todos', 'Pratos', 'Saladas', 'Snacks'];
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
  const navigate = useNavigate();
  
  useEffect(() => {
    setLoading(true);
    getProdutos(page, 10, 'id')
      .then(data => {
        setProdutos(data.content);
        setTotalPages(data.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  const filtrarProdutos = () => {
    return produtos.filter(produto => {
      const categoriaOk =
        filtroCategoria === 'Todos' || produto.categoria === filtroCategoria;
      const precoOk =
        filtroPreco === 'Todos' ||
        (filtroPreco === 'Até R$ 15' && produto.preco <= 15) ||
        (filtroPreco === 'R$ 15 a R$ 20' && produto.preco > 15 && produto.preco <= 20) ||
        (filtroPreco === 'Acima de R$ 20' && produto.preco > 20);
      return categoriaOk && precoOk;
    });
  };

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
      category: produto.categoria,
    };
    addItem(item, 1);
    toast.success(`${produto.nomeProduto || produto.nome} adicionado ao carrinho!`);
    
    setTimeout(() => setAddingToCart(null), 500);
  };

  const produtosFiltrados = filtrarProdutos();

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
            className="text-3xl font-bold text-center mb-6 dark:text-white"
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
          </motion.div>

          <AnimatePresence mode="wait">
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
            ) : produtosFiltrados.length > 0 ? (
              <motion.div 
                key="produtos"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {produtosFiltrados.map((produto, index) => (
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
            ) : (
              <motion.div 
                key="empty"
                className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                Nenhum produto encontrado com os filtros selecionados.
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
