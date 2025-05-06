import React, { useEffect, useState } from 'react';
import hero1 from '../assets/hero-food.png';
import hero2 from '../assets/hero-food.png';
import { FaAppleAlt, FaCarrot, FaDrumstickBite } from 'react-icons/fa';

const Home = () => {
  const images = [hero1, hero2];
  const [current, setCurrent] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);
  
  return (
    <div className="min-h-screen bg-[#F4FDF2] text-gray-800">
      {/* Cabeçalho */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-green-600">FitFood</span>
            <span className="ml-2 text-sm text-green-400 italic">Nutrição que transforma</span>
          </div>
          <nav className="space-x-6">
            <a href="#" className="hover:text-green-600 transition-colors">Home</a>
            <a href="#menu" className="hover:text-green-600 transition-colors">Menu</a>
            <a href="#sobre" className="hover:text-green-600 transition-colors">Sobre</a>
            <a href="#contato" className="hover:text-green-600 transition-colors">Contato</a>
          </nav>
        </div>
      </header>

      {/* Seção Hero com transição de imagens */}
      <main className="container mx-auto px-6 py-16">
        <section className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2">
            <h1 className="text-4xl font-extrabold mb-4">Alimente-se bem, viva melhor</h1>
            <p className="mb-6">
              Descubra refeições saudáveis e deliciosas personalizadas para seus objetivos fitness. Seu paladar e seus músculos vão agradecer!
            </p>
            <a
              href="#menu"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Explorar Cardápio
            </a>
          </div>

          <div className="lg:w-1/2 mt-10 lg:mt-0 relative h-80">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Hero ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg transition-opacity duration-1000 ${
                  current === index ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Seção de Especialidades */}
        <section id="menu" className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Nossas Especialidades</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <FaCarrot className="text-4xl mx-auto mb-4 text-orange-500" />
              <h3 className="text-xl font-semibold mb-2">Pratos Principais</h3>
              <p>Saborosos e nutritivos para abastecer seu dia.</p>
              <a href="#" className="block mt-4 text-green-600 hover:underline">Ver opções</a>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <FaAppleAlt className="text-4xl mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-semibold mb-2">Saladas</h3>
              <p>Frescas e coloridas para manter a leveza.</p>
              <a href="#" className="block mt-4 text-green-600 hover:underline">Ver opções</a>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <FaDrumstickBite className="text-4xl mx-auto mb-4 text-yellow-500" />
              <h3 className="text-xl font-semibold mb-2">Snacks</h3>
              <p>Pequenas delícias para saciar a fome entre as refeições.</p>
              <a href="#" className="block mt-4 text-green-600 hover:underline">Ver opções</a>
            </div>
          </div>
        </section>
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

export default Home;
