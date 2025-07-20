import React from 'react';
import { useScroll } from 'framer-motion';

// Importando componentes
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/home/HeroSection';
import SpecialtiesSection from '../components/home/SpecialtiesSection';
import FeaturedProductsSection from '../components/home/FeaturedProductsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/home/CTASection';

// Importando assets
import hero1 from '../assets/hero-food.png';
import hero2 from '../assets/hero-food2.png';

const Home = () => {
  // Para animações de scroll
  const { scrollYProgress } = useScroll();
  
  // Arrays e dados para os componentes
  const heroImages = [hero1, hero2];
  
  // Produtos destaque
  const destaques = [
    { 
      id: 1, 
      nome: 'Bowl de Proteína', 
      img: hero1, 
      categoria: 'Pratos Principais',
      preco: 29.90,
      rating: 4.8,
      calorias: 450,
      nutrientes: ['27g proteína', '15g carboidratos', '12g gorduras boas']
    },
    { 
      id: 2, 
      nome: 'Salada Caesar Fitness', 
      img: hero2, 
      categoria: 'Saladas',
      preco: 24.90,
      rating: 4.9,
      calorias: 320,
      nutrientes: ['22g proteína', '8g carboidratos', '14g gorduras boas']
    },
    { 
      id: 3, 
      nome: 'Energy Bites', 
      img: hero1, 
      categoria: 'Snacks',
      preco: 15.90,
      rating: 4.7,
      calorias: 180,
      nutrientes: ['8g proteína', '15g carboidratos', '9g gorduras boas']
    }
  ];
  
  // Depoimentos
  const testimonials = [
    {
      id: 1,
      name: 'Mariana Silva',
      avatar: hero1,
      rating: 5,
      comment: "As refeições do Green Food mudaram minha rotina completamente! Consigo manter minha dieta mesmo com a correria do dia a dia. Os pratos são deliciosos e me ajudaram a atingir meus objetivos fitness."
    },
    {
      id: 2,
      name: 'Rafael Mendes',
      avatar: hero2,
      rating: 4.8,
      comment: "Como atleta, preciso de uma alimentação balanceada e que atenda às minhas necessidades nutricionais. O Green Food não só cumpre isso, como também surpreende no sabor. Recomendo muito!"
    }
  ];
  
  return (
    <div className="min-h-screen bg-[#F9FDF7] dark:bg-gray-900 text-gray-800 dark:text-gray-100 overflow-x-hidden">
      <Navbar />
      
      <HeroSection scrollYProgress={scrollYProgress} />
      
      <SpecialtiesSection scrollYProgress={scrollYProgress} />
      
      <FeaturedProductsSection produtos={destaques} />
      
      <TestimonialsSection testimonials={testimonials} />
      
      <CTASection />
      
      <Footer />
    </div>
  );
};

export default Home;
