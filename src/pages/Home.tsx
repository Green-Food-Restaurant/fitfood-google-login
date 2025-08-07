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
import hero3 from '../assets/image/herosection/20250514_2157_Refeições Saudáveis Vibrantes_simple_compose_01jv8q19def21vxb0mkekkek36.png';
import hero4 from '../assets/image/herosection/20250514_2157_Refeições Saudáveis Vibrantes_simple_compose_01jv8q19dffsja07a5y5kwvb83.png';
import hero5 from '../assets/image/herosection/20250514_2157_Refeições Saudáveis Vibrantes_simple_compose_01jv8q1zqsey6snp1gwv2axrde.png';
import hero6 from '../assets/image/herosection/20250514_2157_Refeições Saudáveis Vibrantes_simple_compose_01jv8q1zqtf01shvr9n0k6bvqz.png';

const Home = () => {
  // Para animações de scroll
  const { scrollYProgress } = useScroll();
  
  // Arrays e dados para os componentes
  const heroImages = [hero1, hero2, hero3, hero4, hero5, hero6];
  
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
    <div className="min-h-screen bg-[#F9FDF7] text-gray-800 overflow-x-hidden">
      <Navbar />
      
      <HeroSection scrollYProgress={scrollYProgress} heroImages={heroImages} />
      
      <SpecialtiesSection scrollYProgress={scrollYProgress} />
      
      <FeaturedProductsSection produtos={destaques} />
      
      <TestimonialsSection testimonials={testimonials} />
      
      <CTASection />
      
      <Footer />
    </div>
  );
};

export default Home;
