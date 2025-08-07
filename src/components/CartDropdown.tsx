import React from 'react';
import { useCart } from 'react-use-cart';
import { ShoppingCart } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { Button } from '@/components/ui/button';

const CartDropdown = () => {
  const { items, totalItems, cartTotal, emptyCart } = useCart();
  if (totalItems === 0) {
    return (
      <div className="relative">
        <ShoppingCart className="h-6 w-6 text-green-600" />
      </div>
    );
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="relative focus:outline-none" aria-label="Abrir carrinho">
          <ShoppingCart className="h-6 w-6 text-green-600" />
          <span className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full text-xs h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        </button>
      </Popover.Trigger>
        <Popover.Portal>
        <Popover.Content 
          className="bg-white rounded-md shadow-lg z-50 w-72 animate-in fade-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2" 
          sideOffset={8}
          align="end"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-800">Seu Carrinho ({totalItems})</p>
          </div>
          
          <div className="max-h-64 overflow-y-auto py-2">
            {items.length > 0 ? (
              <>
                {items.slice(0, 4).map((item) => (
                  <div 
                    key={item.id} 
                    className="px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium truncate text-gray-800">{item.name}</p>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">{item.quantity}x</span>
                        <span className="text-xs font-medium">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {items.length > 4 && (
                  <div className="px-4 py-2 text-xs text-gray-500 text-center">
                    +{items.length - 4} {items.length - 4 === 1 ? 'item' : 'itens'} adicionais
                  </div>
                )}
              </>
            ) : (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                Seu carrinho está vazio
              </div>
            )}
          </div>
          
          <div className="px-4 py-3 border-t border-gray-100">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium">Total:</span>
              <span className="text-sm font-bold">R$ {cartTotal.toFixed(2)}</span>
            </div>
              <div className="flex gap-2">
              <Button 
                asChild 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <a href="/carrinho">Ver Carrinho</a>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                onClick={() => emptyCart()}
              >
                Limpar
              </Button>
            </div>
          </div>
          
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default CartDropdown;
