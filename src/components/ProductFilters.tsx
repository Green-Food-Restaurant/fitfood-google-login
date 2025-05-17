import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface ProductFiltersProps {
  categorias: string[];
  precos: string[];
  filtroCategoria: string;
  filtroPreco: string;
  setFiltroCategoria: (categoria: string) => void;
  setFiltroPreco: (preco: string) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ 
  categorias, 
  precos, 
  filtroCategoria, 
  filtroPreco,
  setFiltroCategoria,
  setFiltroPreco
}) => {
  const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);

  const toggleMobileFilter = () => {
    setMobileFilterOpen(!isMobileFilterOpen);
  };

  return (
    <div className="mb-8">
      {/* Cabeçalho com título e toggle para mobile */}
      <div className="flex items-center justify-between mb-4">
        <motion.h2 
          className="text-xl font-medium dark:text-white flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaFilter className="text-green-600 dark:text-green-400" />
          <span>Filtros</span>
        </motion.h2>
        
        <button 
          onClick={toggleMobileFilter}
          className="md:hidden flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-800/50 rounded-lg px-3 py-1.5 transition-colors"
          aria-expanded={isMobileFilterOpen}
          aria-controls="mobile-filters"
        >
          {isMobileFilterOpen ? (
            <>
              <span>Ocultar filtros</span>
              <FaChevronUp />
            </>
          ) : (
            <>
              <span>Mostrar filtros</span>
              <FaChevronDown />
            </>
          )}
        </button>
      </div>

      {/* Container de filtros com animação para mobile */}
      <motion.div 
        id="mobile-filters"
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 overflow-hidden`}
        initial={{ height: 'auto' }}
        animate={{ 
          height: isMobileFilterOpen ? 'auto' : 'auto',
          opacity: isMobileFilterOpen ? 1 : 1
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Filtro de categoria */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Categoria:</p>
              <div className="flex flex-wrap gap-2">                {categorias.map(categoria => (
                  <button
                    key={categoria}
                    onClick={() => setFiltroCategoria(categoria)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                      filtroCategoria === categoria
                        ? 'bg-green-600 dark:bg-green-500 text-white border-green-600 dark:border-green-500 shadow-sm'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/30 hover:border-green-300 dark:hover:border-green-800'
                    }`}
                    aria-pressed={filtroCategoria === categoria}
                  >
                    {categoria === 'LANCHE' ? 'Lanches' : 
                     categoria === 'BEBIDA' ? 'Bebidas' : 
                     categoria === 'SOBREMESA' ? 'Sobremesas' : 
                     categoria === 'ACOMPANHAMENTO' ? 'Acompanhamentos' : 
                     categoria === 'SALADAS' ? 'Saladas' : 
                     categoria}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro de preço */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Faixa de Preço:</p>
              <div className="flex flex-wrap gap-2">
                {precos.map(preco => (
                  <button
                    key={preco}
                    onClick={() => setFiltroPreco(preco)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                      filtroPreco === preco
                        ? 'bg-green-600 dark:bg-green-500 text-white border-green-600 dark:border-green-500 shadow-sm'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/30 hover:border-green-300 dark:hover:border-green-800'
                    }`}
                    aria-pressed={filtroPreco === preco}
                  >
                    {preco}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Botão para limpar filtros */}
          {(filtroCategoria !== 'Todos' || filtroPreco !== 'Todos') && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => {
                  setFiltroCategoria('Todos');
                  setFiltroPreco('Todos');
                }}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Mostrador de filtros ativos */}
      {(filtroCategoria !== 'Todos' || filtroPreco !== 'Todos') && (
        <motion.div 
          className="mt-4 flex items-center flex-wrap gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-sm text-gray-500 dark:text-gray-400">Filtros ativos:</span>
            {filtroCategoria !== 'Todos' && (
            <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full px-3 py-1 flex items-center gap-1">
              <span>Categoria: {
                filtroCategoria === 'LANCHE' ? 'Lanches' : 
                filtroCategoria === 'BEBIDA' ? 'Bebidas' : 
                filtroCategoria === 'SOBREMESA' ? 'Sobremesas' : 
                filtroCategoria === 'ACOMPANHAMENTO' ? 'Acompanhamentos' : 
                filtroCategoria === 'SALADAS' ? 'Saladas' : 
                filtroCategoria
              }</span>
              <button 
                onClick={() => setFiltroCategoria('Todos')}
                className="ml-1 hover:text-red-500 dark:hover:text-red-400"
                aria-label={`Remover filtro de categoria ${filtroCategoria}`}
              >
                ×
              </button>
            </div>
          )}
          
          {filtroPreco !== 'Todos' && (
            <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full px-3 py-1 flex items-center gap-1">
              <span>Preço: {filtroPreco}</span>
              <button 
                onClick={() => setFiltroPreco('Todos')}
                className="ml-1 hover:text-red-500 dark:hover:text-red-400"
                aria-label={`Remover filtro de preço ${filtroPreco}`}
              >
                ×
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ProductFilters;