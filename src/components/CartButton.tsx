
import React from 'react';
import { 
  Drawer, 
  DrawerContent, 
  DrawerTrigger,
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter 
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export const CartButton = () => {
  const { items, removeItem, updateQuantity, getCartTotal, getItemCount } = useCart();
  const navigate = useNavigate();
  const itemCount = getItemCount();
  const total = getCartTotal();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <Drawer>      <DrawerTrigger asChild>
        <button className="relative p-2">
          <ShoppingCart className="h-6 w-6 text-green-600" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {itemCount}
            </span>
          )}
        </button>
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerHeader className="px-0">
          <DrawerTitle>Seu Carrinho</DrawerTitle>
        </DrawerHeader>
        
        <div className="space-y-4 mt-2 max-h-[60vh] overflow-auto">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Seu carrinho está vazio</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex items-center gap-4 pb-4 border-b">
                <img 
                  src={item.imagem} 
                  alt={item.nome} 
                  className="w-16 h-16 object-contain rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.nome}</h3>
                  <p className="text-green-600 font-bold">R$ {item.preco.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded-md"
                  >
                    -
                  </button>
                  <span>{item.quantidade}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded-md"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  X
                </button>
              </div>
            ))
          )}
        </div>
        
        {items.length > 0 && (
          <DrawerFooter className="px-0 pt-4">
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCheckout} className="w-full bg-green-600 hover:bg-green-700">
                Finalizar Compra
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">Continuar Comprando</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};
