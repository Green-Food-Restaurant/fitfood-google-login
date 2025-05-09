
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const Checkout = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const cartTotal = getCartTotal();
  
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
      cvv: ''
    }
  });

  const handleSubmitOrder = (data) => {
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio!");
      return;
    }

    setIsProcessing(true);
    // Simulando processamento de pagamento
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      toast.success("Pedido realizado com sucesso!");
      navigate('/home');
    }, 1500);
  };
  
  if (items.length === 0) {
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
            <span className="text-2xl font-bold text-green-600">FitFood</span>
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
          <div className="lg:col-span-7">
            <Card>
              <CardHeader>
                <CardTitle>Seus Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Seu nome completo" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="seu@email.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="(11) 98765-4321" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <h3 className="font-medium">Endereço de Entrega</h3>
                      
                      <FormField
                        control={form.control}
                        name="endereco"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Endereço completo</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Rua, número, complemento" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="cidade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cidade</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Sua cidade" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cep"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CEP</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="00000-000" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Informações de Pagamento</h3>
                      
                      <FormField
                        control={form.control}
                        name="numeroCartao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número do Cartão</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="0000 0000 0000 0000" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nomeCartao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome no Cartão</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nome como está no cartão" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="validade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Validade</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="MM/AA" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVV</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="123" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-5">
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
                          {item.quantidade} x R$ {item.preco.toFixed(2)}
                        </p>
                      </div>
                      <span className="font-bold">
                        R$ {(item.quantidade * item.preco).toFixed(2)}
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
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={form.handleSubmit(handleSubmitOrder)} 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processando...' : 'Finalizar Compra'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="bg-white mt-16 py-6">
        <div className="container mx-auto text-center text-sm text-gray-500">
          © {new Date().getFullYear()} FitFood. Sua jornada para uma alimentação mais saudável começa aqui.
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
