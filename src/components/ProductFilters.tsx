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
          className="text-xl font-medium flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaFilter className="text-green-600" />
          <span>Filtros</span>
        </motion.h2>
        
        <button 
          onClick={toggleMobileFilter}
          className="md:hidden flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg px-3 py-1.5 transition-colors"
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
        className={`bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden`}
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
              <p className="text-sm font-medium text-gray-700 mb-3">Categoria:</p>
              <div className="flex flex-wrap gap-2">                {categorias.map(categoria => (
                  <button
                    key={categoria}
                    onClick={() => setFiltroCategoria(categoria)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                      filtroCategoria === categoria
                        ? 'bg-green-600 text-white border-green-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-green-50 hover:border-green-300'
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
              <p className="text-sm font-medium text-gray-700 mb-3">Faixa de Preço:</p>
              <div className="flex flex-wrap gap-2">
                {precos.map(preco => (
                  <button
                    key={preco}
                    onClick={() => setFiltroPreco(preco)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                      filtroPreco === preco
                        ? 'bg-green-600 text-white border-green-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-green-50 hover:border-green-300'
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
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => {
                  setFiltroCategoria('Todos');
                  setFiltroPreco('Todos');
                }}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
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
          <span className="text-sm text-gray-500">Filtros ativos:</span>
            {filtroCategoria !== 'Todos' && (
            <div className="bg-green-100 text-green-800 text-xs rounded-full px-3 py-1 flex items-center gap-1">
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
                className="ml-1 hover:text-red-500"
                aria-label={`Remover filtro de categoria ${filtroCategoria}`}
              >
                ×
              </button>
            </div>
          )}
          
          {filtroPreco !== 'Todos' && (
            <div className="bg-green-100 text-green-800 text-xs rounded-full px-3 py-1 flex items-center gap-1">
              <span>Preço: {filtroPreco}</span>
              <button 
                onClick={() => setFiltroPreco('Todos')}
                className="ml-1 hover:text-red-500"
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
