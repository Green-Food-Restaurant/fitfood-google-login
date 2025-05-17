import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { getPlaceholderByCategory } from '@/utils/placeholders';

interface ProductCardProps {
  produto: {
    id: number;
    nomeProduto: string;
    preco: number;
    urlImage: string | null;
    category: string;
    descricao?: string;
    estoque?: number;
    ativo?: boolean;
  };
  onAddToCart: (produto: ProductCardProps['produto']) => void;
  isAddingToCart: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ produto, onAddToCart, isAddingToCart }) => {
  return (    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg dark:shadow-gray-900 transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      <div className="relative p-4">        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="w-full h-48"
        >
          <img
            src={produto.urlImage || getPlaceholderByCategory(produto.category)}
            alt={produto.nomeProduto}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              // Fallback para o placeholder genérico se tudo falhar
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </motion.div>
        <motion.span 
          className="absolute top-6 right-6 bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-400 text-xs font-semibold px-2 py-1 rounded-full"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {produto.category}
        </motion.span>
      </div>
      
      <div className="p-6 flex-grow">
        <motion.h2 
          className="text-xl font-semibold mb-1 text-gray-800 dark:text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {produto.nomeProduto}
        </motion.h2>
        <motion.p 
          className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {produto.descricao || "Refeição saudável preparada com ingredientes naturais."}
        </motion.p>
      </div>
        <div className="px-6 pb-4">
        <div className="flex items-center justify-between">
          <motion.span 
            className="text-green-600 dark:text-green-400 font-bold text-lg"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            R$ {produto.preco.toFixed(2)}
          </motion.span>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => onAddToCart(produto)} 
              className={`transition-all ${
                isAddingToCart 
                  ? "bg-green-700 scale-95" 
                  : "bg-green-600 hover:bg-green-700"
              } text-white`}
              size="sm"
              disabled={isAddingToCart || (produto.estoque !== undefined && produto.estoque <= 0) || (produto.ativo === false)}
            >
              {isAddingToCart ? "✓" : (produto.estoque !== undefined && produto.estoque <= 0) ? "Esgotado" : "Adicionar"}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;