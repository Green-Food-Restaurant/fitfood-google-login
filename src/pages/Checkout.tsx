import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useCart } from 'react-use-cart';
import { toast } from 'sonner';

const CHECKOUT_API_URL = import.meta.env.VITE_CHECKOUT_API_URL || 'http://localhost:8090/v1/checkout/create';

const Checkout = () => {
  const { isEmpty, totalItems, items, cartTotal, emptyCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const form = useForm({
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      endereco: '',
      cidade: '',
      cep: '',
      numeroCartao: '',
      nomeCartao: '',
      validade: '',
      cvv: '',
      paymentMethod: 'CREDIT_CARD'
    }
  });

  const paymentMethods = [
    { value: 'CREDIT_CARD', label: 'Cartão de Crédito' },
    { value: 'DEBIT_CARD', label: 'Cartão de Débito' },
    { value: 'PAYPAL', label: 'PayPal' },
    { value: 'BANK_TRANSFER', label: 'Transferência Bancária' },
    { value: 'CASH_ON_DELIVERY', label: 'Pagamento na Entrega' }
  ];

  const handleSubmitOrder = async (data) => {
    if (isEmpty) {
      toast.error("Seu carrinho está vazio!");
      return;
    }

    setIsProcessing(true);
    try {
      // Montar payload para o microserviço de checkout
      const payload = {
        cartId: String(Date.now()), // Pode ser um ID real do carrinho se houver
        totalAmount: Number(cartTotal.toFixed(2)),
        productQuantity: items.length,
        paymentMethod: data.paymentMethod,
        products: items.map(item => ({
          id: String(item.id),
          name: item.nome || item.name || '',
          description: item.descricao || item.description || '',
          price: item.preco ?? item.price ?? 0,
          quantity: item.quantidade ?? item.quantity ?? 1
        }))
      };
      const response = await axios.post(CHECKOUT_API_URL, payload);
      console.log('Resposta do checkout:', response.data);
      emptyCart();
      toast.success("Pedido realizado com sucesso!");
      navigate('/home');
    } catch (error) {
      toast.error("Erro ao processar o pedido. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (isEmpty) {
    return (
      <div className="min-h-screen bg-[#F4FDF2] flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center">Carrinho Vazio</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6">Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.</p>
            <Button onClick={() => navigate('/products')} className="bg-green-600 hover:bg-green-700">
              Ver Produtos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4FDF2]">
      <header className="bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-green-600">Green Food</span>
            <span className="ml-2 text-sm text-green-400 italic">Nutrição que transforma</span>
          </div>
          <button onClick={() => navigate(-1)} className="hover:text-green-600 transition-colors">
            Voltar
          </button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-8 text-center">Finalizar Pedido</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Removido o formulário de dados do cliente */}
          <div className="lg:col-span-5 mx-auto">
            <Form {...form}>
              <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmitOrder)}>
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo do Pedido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {items.map(item => (
                        <div key={item.id} className="flex items-center py-2 border-b">
                          <img 
                            src={item.imagem} 
                            alt={item.nome}
                            className="w-12 h-12 object-contain rounded-md mr-4"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.nome}</h4>
                            <p className="text-sm text-gray-600">
                              {item.quantidade ?? 1} x R$ {(item.preco ?? 0).toFixed(2)}
                            </p>
                          </div>
                          <span className="font-bold">
                            R$ {((item.quantidade ?? 1) * (item.preco ?? 0)).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>R$ {cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Entrega</span>
                        <span>R$ 0.00</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span>R$ {cartTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    {/* Forma de pagamento dentro do resumo */}
                    <div className="space-y-4 mt-6">
                      <h3 className="font-medium">Método de Pagamento</h3>
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Método de Pagamento</FormLabel>
                            <FormControl>
                              <select {...field} className="w-full border rounded px-3 py-2">
                                {paymentMethods.map(method => (
                                  <option key={method.value} value={method.value}>{method.label}</option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processando...' : 'Finalizar Compra'}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </div>
        </div>
      </main>
      
      <footer className="bg-white mt-16 py-6">
        <div className="container mx-auto text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Green Food. Sua jornada para uma alimentação mais saudável começa aqui.
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
