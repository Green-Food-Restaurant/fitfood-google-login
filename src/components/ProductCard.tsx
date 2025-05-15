import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  produto: {
    id: number;
    nomeProduto: string;
    preco: number;
    urlImage: string;
    categoria: string;
    descricao?: string;
  };
  onAddToCart: (produto: any) => void;
  isAddingToCart: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ produto, onAddToCart, isAddingToCart }) => {
  return (
    <div
      className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      <div className="relative p-4">
        <motion.img
          src={produto.urlImage}
          alt={produto.nomeProduto}
          className="w-full h-48 object-cover rounded-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <motion.span 
          className="absolute top-6 right-6 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {produto.categoria}
        </motion.span>
      </div>
      
      <div className="p-6 flex-grow">
        <motion.h2 
          className="text-xl font-semibold mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {produto.nomeProduto}
        </motion.h2>
        <motion.p 
          className="text-sm text-gray-600 mb-2 line-clamp-2"
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
            className="text-green-600 font-bold text-lg"
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
              disabled={isAddingToCart}
            >
              {isAddingToCart ? "✓" : "Adicionar"}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;