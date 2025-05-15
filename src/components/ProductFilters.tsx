import React from 'react';

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
  return (
    <div className="mb-8">
      <h2 className="text-center text-xl font-medium mb-4">Filtrar por</h2>
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Categoria:</p>
            <div className="flex flex-wrap gap-2">
              {categorias.map(categoria => (
                <button
                  key={categoria}
                  onClick={() => setFiltroCategoria(categoria)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors duration-200 ${
                    filtroCategoria === categoria
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-green-600 border-green-300 hover:bg-green-50'
                  }`}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Faixa de Preço:</p>
            <div className="flex flex-wrap gap-2">
              {precos.map(preco => (
                <button
                  key={preco}
                  onClick={() => setFiltroPreco(preco)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors duration-200 ${
                    filtroPreco === preco
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-green-600 border-green-300 hover:bg-green-50'
                  }`}
                >
                  {preco}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;