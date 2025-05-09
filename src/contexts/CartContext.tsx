
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface CartItem {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  quantidade: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (produto: any, quantidade: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantidade: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (produto: any, quantidade: number = 1) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === produto.id);
      
      if (existingItem) {
        return currentItems.map(item => 
          item.id === produto.id 
            ? { ...item, quantidade: item.quantidade + quantidade } 
            : item
        );
      } else {
        return [...currentItems, { 
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          imagem: produto.imagem,
          quantidade: quantidade 
        }];
      }
    });
  };

  const removeItem = (id: number) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantidade: number) => {
    if (quantidade <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === id ? { ...item, quantidade: quantidade } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantidade, 0);
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart,
      getCartTotal,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};
