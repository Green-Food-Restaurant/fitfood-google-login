
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, Utensils, Calendar, User, Apple } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  // Verificação básica de autenticação
  const isLoggedIn = localStorage.getItem('googleToken') !== null;

  // Se não estiver logado, redirecionar para a página de login
  if (!isLoggedIn) {
    window.location.href = '/';
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-fitfood-primary rounded-full p-2">
              <Apple className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-fitfood-primary to-fitfood-accent bg-clip-text text-transparent">
              FitFood
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/home" className="font-medium text-gray-800 hover:text-fitfood-primary">Início</Link>
            <Link to="/menu" className="font-medium text-gray-600 hover:text-fitfood-primary">Cardápio</Link>
            <Link to="/planos" className="font-medium text-gray-600 hover:text-fitfood-primary">Planos</Link>
            <Link to="/sobre" className="font-medium text-gray-600 hover:text-fitfood-primary">Sobre</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-fitfood-primary to-fitfood-accent py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-white mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sua alimentação saudável personalizada</h1>
            <p className="text-lg mb-8 opacity-90">
              Descubra refeições deliciosas e nutritivas que se encaixam perfeitamente na sua rotina e objetivos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-white text-fitfood-primary hover:bg-gray-100">
                Ver cardápio da semana
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Personalizar plano
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="h-64 w-64 md:h-80 md:w-80 rounded-full bg-white/20 absolute -top-6 -left-6"></div>
              <img 
                src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                alt="Bowl de comida saudável"
                className="rounded-lg shadow-2xl relative z-10 w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">O que oferecemos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nossa missão é tornar a alimentação saudável simples, deliciosa e personalizada para seu estilo de vida.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-fitfood-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Utensils className="h-7 w-7 text-fitfood-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Refeições Balanceadas</h3>
                <p className="text-gray-600">
                  Todas as nossas refeições são elaboradas por nutricionistas para garantir o equilíbrio perfeito entre sabor e nutrição.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-fitfood-accent/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Calendar className="h-7 w-7 text-fitfood-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Planos Flexíveis</h3>
                <p className="text-gray-600">
                  Escolha entre planos diários, semanais ou mensais, com opções para diferentes objetivos e preferências alimentares.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-fitfood-secondary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Heart className="h-7 w-7 text-fitfood-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ingredientes Frescos</h3>
                <p className="text-gray-600">
                  Utilizamos apenas ingredientes frescos e de qualidade, preferencialmente orgânicos e de produtores locais.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Weekly Menu Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Cardápio da Semana</h2>
            <Button variant="outline" size="sm">Ver completo</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Bowl Mediterrâneo",
                image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                calories: "450 cal",
                protein: "22g",
                category: "Almoço"
              },
              {
                name: "Salada de Quinoa",
                image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                calories: "380 cal",
                protein: "18g",
                category: "Almoço"
              },
              {
                name: "Wrap de Frango",
                image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                calories: "420 cal",
                protein: "28g",
                category: "Jantar"
              },
              {
                name: "Smoothie Verde",
                image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                calories: "250 cal",
                protein: "12g",
                category: "Café"
              }
            ].map((meal, index) => (
              <Card key={index} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                <div className="h-44 overflow-hidden">
                  <img 
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-4">
                  <span className="text-xs font-medium text-fitfood-primary px-2 py-1 bg-fitfood-primary/10 rounded-full">
                    {meal.category}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold">{meal.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm text-gray-600">{meal.calories}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="text-sm text-gray-600">Proteína: {meal.protein}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">O que nossos clientes dizem</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Mariana Silva",
                role: "Atleta",
                comment: "Desde que comecei a usar o FitFood, minha performance nos treinos melhorou consideravelmente. As refeições são deliciosas e me mantêm com energia o dia todo."
              },
              {
                name: "Carlos Mendes",
                role: "Empresário",
                comment: "Com a rotina corrida, o FitFood me ajudou a manter uma alimentação saudável sem perder tempo. Recomendo para quem valoriza qualidade e praticidade."
              },
              {
                name: "Juliana Costa",
                role: "Nutricionista",
                comment: "Como profissional da área, aprovo totalmente as refeições do FitFood. Balanceadas, nutritivas e com opções para diversos perfis alimentares."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-none shadow-lg p-6">
                <div className="flex flex-col h-full">
                  <div className="text-amber-400 flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 flex-grow">"{testimonial.comment}"</p>
                  <div className="mt-auto">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-fitfood-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Pronto para transformar sua alimentação?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Experimente nosso serviço e descubra como uma alimentação balanceada pode transformar sua qualidade de vida.
          </p>
          <Button className="bg-white text-fitfood-primary hover:bg-gray-100">
            Comece agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-fitfood-primary rounded-full p-2">
                  <Apple className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">FitFood</span>
              </div>
              <p className="text-gray-400">Alimentação saudável e personalizada para seu estilo de vida.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Menu</h4>
              <ul className="space-y-2">
                <li><Link to="/home" className="text-gray-400 hover:text-white">Início</Link></li>
                <li><Link to="/menu" className="text-gray-400 hover:text-white">Cardápio</Link></li>
                <li><Link to="/planos" className="text-gray-400 hover:text-white">Planos</Link></li>
                <li><Link to="/sobre" className="text-gray-400 hover:text-white">Sobre nós</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/termos" className="text-gray-400 hover:text-white">Termos de Serviço</Link></li>
                <li><Link to="/privacidade" className="text-gray-400 hover:text-white">Política de Privacidade</Link></li>
                <li><Link to="/cookies" className="text-gray-400 hover:text-white">Política de Cookies</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M10 4a6 6 0 100 12 6 6 0 000-12zm0 10a4 4 0 100-8 4 4 0 000 8z" clipRule="evenodd" />
                  </svg>
                  São Paulo, SP
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  (11) 9999-9999
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  contato@fitfood.com.br
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 FitFood. Todos os direitos reservados.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
