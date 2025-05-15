// src/pages/Cart.jsx
import React from 'react';
import { useCart } from 'react-use-cart';
import { MinusIcon, PlusIcon, TrashIcon, ShoppingBagIcon, ArrowLeftIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Importamos AnimatePresence também
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';

const Cart = () => {
  const {
    isEmpty,
    items,
    updateItemQuantity,
    removeItem,
    cartTotal,
    emptyCart,
    totalItems
  } = useCart();

  // Variants para animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    exit: { 
      opacity: 0, 
      x: -300,
      transition: { duration: 0.2 } 
    }
  };

  const summaryVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        delay: 0.2 
      } 
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FDF2]">
      <Navbar />
      
      <motion.div 
        className="max-w-6xl mx-auto px-4 py-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Cabeçalho do Carrinho */}
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Seu Carrinho</h1>
            <p className="text-gray-500 mt-1">{totalItems} {totalItems === 1 ? 'item' : 'itens'} no carrinho</p>
          </div>
          <Link to="/produtos" className="flex items-center text-green-600 hover:text-green-700 transition-colors">
            <ArrowLeftIcon size={16} className="mr-2" />
            <span>Continuar comprando</span>
          </Link>
        </motion.div>
        
        {isEmpty ? (
          <motion.div 
            className="text-center py-16 bg-white rounded-lg shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <motion.div 
              className="inline-flex justify-center items-center w-20 h-20 bg-gray-100 rounded-full mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20, 
                delay: 0.2 
              }}
            >
              <ShoppingBagIcon size={32} className="text-gray-400" />
            </motion.div>
            <motion.h2 
              className="text-xl font-medium text-gray-800 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Seu carrinho está vazio
            </motion.h2>
            <motion.p 
              className="text-gray-500 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Parece que você ainda não adicionou nenhum item ao seu carrinho
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/produtos">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Explorar Produtos
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de Itens */}
            <motion.div 
              className="lg:col-span-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                  <div className="grid grid-cols-12 text-sm font-medium text-gray-500">
                    <div className="col-span-6">Produto</div>
                    <div className="col-span-2 text-center">Preço</div>
                    <div className="col-span-2 text-center">Quantidade</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                  </div>
                </div>
                
                <AnimatePresence>
                  <motion.ul className="divide-y divide-gray-100">
                    {items.map(item => (
                      <motion.li 
                        key={item.id} 
                        className="p-4 hover:bg-gray-50"
                        variants={itemVariants}
                        layout
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                      >
                        <div className="grid grid-cols-12 items-center gap-4">
                          {/* Produto com imagem */}
                          <div className="col-span-6">
                            <div className="flex items-center">
                              <motion.div 
                                className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border"
                                whileHover={{ scale: 1.05 }}
                              >
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover" 
                                />
                              </motion.div>
                              <div className="ml-4">
                                <h3 className="font-medium text-gray-800">{item.name}</h3>
                                <p className="text-xs text-gray-500">{item.category}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Preço */}
                          <div className="col-span-2 text-center">
                            <span className="text-gray-800">R$ {item.price.toFixed(2)}</span>
                          </div>
                          
                          {/* Quantidade */}
                          <div className="col-span-2">
                            <div className="flex items-center justify-center space-x-1">
                              <motion.button
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600"
                                aria-label="Diminuir quantidade"
                                whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <MinusIcon size={14} />
                              </motion.button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <motion.button
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600"
                                aria-label="Aumentar quantidade"
                                whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <PlusIcon size={14} />
                              </motion.button>
                            </div>
                          </div>
                          
                          {/* Subtotal e botão remover */}
                          <div className="col-span-2 text-right">
                            <div className="flex flex-col items-end">
                              <span className="font-medium text-gray-800">
                                R$ {(item.price * item.quantity).toFixed(2)}
                              </span>
                              <motion.button
                                onClick={() => removeItem(item.id)}
                                className="mt-1 inline-flex items-center text-xs text-red-500"
                                whileHover={{ scale: 1.05, color: "#ef4444" }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <TrashIcon size={14} className="mr-1" />
                                Remover
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                </AnimatePresence>
              </div>
              
              {/* Ações adicionais */}
              <motion.div 
                className="mt-4 flex justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    variant="outline"
                    className="text-gray-600 hover:text-red-600"
                    onClick={() => emptyCart()}
                  >
                    Esvaziar Carrinho
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Resumo do Pedido */}
            <motion.div 
              className="lg:col-span-1"
              variants={summaryVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="font-bold text-lg mb-4 pb-2 border-b border-gray-100">
                  Resumo do Pedido
                </h2>
                
                <motion.div 
                  className="space-y-3 text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entrega:</span>
                    <span className="text-green-600">Grátis</span>
                  </div>
                  
                  <motion.div 
                    className="pt-3 mt-3 border-t border-gray-100 flex justify-between font-bold text-lg text-gray-800"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    <span>Total:</span>
                    <span>R$ {cartTotal.toFixed(2)}</span>
                  </motion.div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button 
                    className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-3"
                    onClick={() => window.location.href = '/checkout'}
                  >
                    Finalizar Compra
                  </Button>
                </motion.div>
                
                <motion.div 
                  className="mt-4 text-xs text-center text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="mb-1">Aceitamos os seguintes métodos de pagamento</p>
                  <div className="flex justify-center space-x-2">
                    {/* Ícones de pagamento com animações */}
                    {[1, 2, 3, 4].map((index) => (
                      <motion.span 
                        key={index}
                        className="w-8 h-5 bg-gray-200 rounded"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + (index * 0.1) }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default Cart;