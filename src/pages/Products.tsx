
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProdutos } from '../services/productsService';
import { Button } from '@/components/ui/button';
import { CartButton } from '@/components/CartButton';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const categorias = ['Todos', 'Pratos', 'Saladas', 'Snacks'];
const precos = ['Todos', 'Até R$ 15', 'R$ 15 a R$ 20', 'Acima de R$ 20'];

const Products = () => {
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [filtroPreco, setFiltroPreco] = useState('Todos');
  const [produtos, setProdutos] = useState([]);
  const { addItem } = useCart();
  const navigate = useNavigate();
    
  useEffect(() => {
    getProdutos().then(data => setProdutos(data)).catch(console.error);
  }, []);

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

  const handleAddToCart = (produto) => {
    addItem(produto, 1);
    toast.success(`${produto.nome} adicionado ao carrinho!`);
  };

  const produtosFiltrados = filtrarProdutos();

  return (
    <div className="min-h-screen bg-[#F4FDF2] text-gray-800">
      {/* Cabeçalho */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-green-600">FitFood</span>
            <span className="ml-2 text-sm text-green-400 italic">Nutrição que transforma</span>
          </div>
          <nav className="flex items-center space-x-6">
            <a href="/" className="hover:text-green-600 transition-colors">Home</a>
            <a href="/products" className="hover:text-green-600 transition-colors">Produtos</a>
            <a href="#sobre" className="hover:text-green-600 transition-colors">Sobre</a>
            <a href="#contato" className="hover:text-green-600 transition-colors">Contato</a>
            <CartButton />
          </nav>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">Nossos Produtos</h1>

          {/* Filtros */}
          <div className="flex flex-col lg:flex-row justify-center mb-8 gap-6">
            <div className="flex flex-wrap justify-center gap-4">
              {categorias.map(categoria => (
                <button
                  key={categoria}
                  onClick={() => setFiltroCategoria(categoria)}
                  className={`px-4 py-2 rounded-full border transition-colors duration-200 ${
                    filtroCategoria === categoria
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-green-600 border-green-300 hover:bg-green-50'
                  }`}
                >
                  {categoria}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {precos.map(preco => (
                <button
                  key={preco}
                  onClick={() => setFiltroPreco(preco)}
                  className={`px-4 py-2 rounded-full border transition-colors duration-200 ${
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {produtosFiltrados.map(produto => (
              <div
                key={produto.id}
                className="bg-white rounded-xl shadow hover:shadow-md transition-shadow p-6"
              >
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-full h-48 object-contain rounded mb-4"
                />
                <h2 className="text-xl font-semibold mb-1">{produto.nome}</h2>
                <p className="text-sm text-gray-600 mb-2">{produto.descricao}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-green-600 font-bold">R$ {produto.preco.toFixed(2)}</span>
                  <Button 
                    onClick={() => handleAddToCart(produto)} 
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="bg-white mt-16 py-6">
        <div className="container mx-auto text-center text-sm text-gray-500">
          © {new Date().getFullYear()} FitFood. Sua jornada para uma alimentação mais saudável começa aqui.
        </div>
      </footer>
    </div>
  );
};

export default Products;
