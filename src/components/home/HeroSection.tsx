import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { FaStar, FaLeaf, FaClock } from 'react-icons/fa';

interface HeroSectionProps {
  scrollYProgress: MotionValue<number>;
  heroImages?: string[]; // Tornamos opcional para usar imagens dinâmicas como fallback
}

// Função para carregar todas as imagens .png da pasta
const loadHeroImages = () => {
  const images: string[] = [];
  
  try {
    // Vite usa um padrão diferente do Webpack para imports dinâmicos
    const modules = import.meta.glob('/src/assets/image/herosection/*.png', { eager: true });
    
    // Convertendo os módulos em uma array de URLs
    Object.values(modules).forEach((module: any) => {
      if (module.default) {
        images.push(module.default);
      }
    });
    
    // Ordenar as imagens pelo nome do arquivo se necessário
    images.sort();
    
    console.log('Imagens carregadas:', images);
  } catch (error) {
    console.error('Erro ao carregar imagens:', error);
  }
  
  return images;
};

const HeroSection: React.FC<HeroSectionProps> = ({ scrollYProgress, heroImages: propHeroImages }) => {
  // Usar imagens das props se fornecidas, senão carregar dinamicamente
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.5]);
  
  useEffect(() => {
    // Carregar imagens dinamicamente se não forem fornecidas pelas props
    if (!propHeroImages || propHeroImages.length === 0) {
      const images = loadHeroImages();
      setLoadedImages(images);
    }
  }, [propHeroImages]);
  
  // Usar imagens das props ou as carregadas dinamicamente
  const heroImages = propHeroImages && propHeroImages.length > 0
    ? propHeroImages
    : loadedImages;
  
  // Efeito de transição de imagens hero
  useEffect(() => {
    if (heroImages.length <= 1) return; // Não iniciar intervalo se houver apenas uma imagem
    
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % heroImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroImages.length]);
  
  // Se não houver imagens, mostrar uma mensagem ou fallback
  if (heroImages.length === 0) {
    return (
      <div className="flex justify-center items-center h-96 bg-green-50">
        <p className="text-gray-500">Carregando imagens...</p>
      </div>
    );
  }
  
  return (
    <motion.section 
      className="relative pt-16 pb-24 overflow-hidden"
      style={{ opacity: heroOpacity }}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-transparent"></div>
        {/* Formas orgânicas decorativas */}
        <motion.div 
          className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-green-100 opacity-70"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute top-20 right-20 w-40 h-40 rounded-full bg-yellow-100 opacity-60"
          animate={{ 
            scale: [1, 1.15, 1],
            x: [0, 10, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 18,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-5xl lg:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
                Alimente-se bem,
              </span>
              <br />viva melhor
            </motion.h1>
            <motion.p 
              className="text-lg mb-8 max-w-lg text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Descubra refeições saudáveis e deliciosas personalizadas para seus objetivos fitness. 
              Seu paladar e seus músculos vão agradecer!
            </motion.p>
            
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/produtos" className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium shadow-lg flex items-center gap-2 transition-all">
                  Explorar Cardápio
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/sobre" className="px-8 py-3 bg-white border border-green-200 text-green-600 hover:bg-green-50 rounded-full font-medium flex items-center gap-2 transition-all">
                  Saiba mais
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="mt-8 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <FaStar key={star} className="text-yellow-400 text-lg" />
                ))}
              </div>
              <span className="text-gray-600">
                <strong>4.9/5</strong> baseado em <strong>1.2k</strong> avaliações
              </span>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative h-[450px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {heroImages.map((src, index) => (
              <motion.div
                key={index}
                className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
                initial={false}
                animate={{ 
                  opacity: current === index ? 1 : 0,
                  scale: current === index ? 1 : 1.05,
                  zIndex: current === index ? 1 : 0
                }}
                transition={{ duration: 0.7 }}
              >
                <img
                  src={src}
                  alt={`Hero ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay glassmorphism cards */}
                <motion.div 
                  className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-[200px]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: current === index ? 1 : 0, x: current === index ? 0 : -20 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <FaLeaf /> Ingredientes naturais
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute top-6 right-6 bg-white/80 backdrop-blur-sm py-1 px-3 rounded-full shadow-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: current === index ? 1 : 0, y: current === index ? 0 : -20 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <FaClock className="text-xs" /> Entrega em 30min
                  </div>
                </motion.div>
              </motion.div>
            ))}
            
            {/* Navegação das imagens - Mostrar apenas se houver mais de uma imagem */}
            {heroImages.length > 1 && (
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      current === index ? 'bg-green-600 w-6' : 'bg-gray-300'
                    }`}
                    aria-label={`Ver imagem ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
