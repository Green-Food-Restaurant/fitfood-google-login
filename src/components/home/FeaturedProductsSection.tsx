// filepath: c:\Users\dalex\Documents\Linguagem Java\Workspace\green-food\green-food-web\fitfood-google-login\src\components\home\FeaturedProductsSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

interface Produto {
  id: number;
  nome: string;
  img: string;
  categoria: string;
  preco: number;
  rating: number;
  calorias: number;
  nutrientes: string[];
}

interface FeaturedProductsSectionProps {
  produtos: Produto[];
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({ produtos }) => {
  return (
    <section className="py-20 bg-[#F9FDF7]">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-green-600 font-medium">MAIS PEDIDOS</span>
          <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-4">Produtos em Destaque</h2>
          <p className="text-gray-600">
            Conheça os itens mais populares do nosso cardápio, aprovados pelos nossos clientes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {produtos.map((produto, index) => (
            <ProductCard key={produto.id} produto={produto} index={index} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            to="/produtos"
            className="inline-flex items-center gap-2 border border-green-600 text-green-600 hover:bg-green-50 rounded-full px-6 py-3 font-medium transition-colors"
          >
            Ver todos os produtos
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

interface ProductCardProps {
  produto: Produto;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ produto, index }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={produto.img} 
          alt={produto.nome} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm py-1 px-3 rounded-full text-xs font-semibold text-green-600">
          {produto.categoria}
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg">{produto.nome}</h3>
          <span className="flex items-center text-sm font-medium bg-yellow-100 text-yellow-700 py-1 px-2 rounded">
            <FaStar className="mr-1 text-yellow-500" /> {produto.rating}
          </span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">{produto.calorias} cal</span>
          <span className="text-green-600 font-bold">R$ {produto.preco.toFixed(2)}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {produto.nutrientes.map((nutriente, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              {nutriente}
            </span>
          ))}
        </div>
        <Link 
          to={`/produtos/${produto.id}`}
          className="block w-full text-center bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 font-medium transition-colors"
        >
          Ver Detalhes
        </Link>
      </div>
    </motion.div>
  );
};

export default FeaturedProductsSection;