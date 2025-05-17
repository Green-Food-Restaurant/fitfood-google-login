import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CartDropdown from './CartDropdown';
import ThemeToggle from './ThemeToggle';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Detectar scroll para mudar a aparência do navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Verificar posição inicial
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar menu mobile quando mudar de página
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  // Verificar se o usuário é admin
  const isAdmin = localStorage.getItem('userRole') === 'ADMIN';
  
  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Produtos', path: '/produtos' },
    { title: 'Sobre', path: '/#sobre' },
    { title: 'Contato', path: '/#contato' },
    ...(isAdmin ? [{ title: 'Admin', path: '/admin' }] : [])
  ];

  // Verificar se o link está ativo
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Calcular a altura do navbar para o spacer
  const navbarHeight = isScrolled ? '64px' : '80px'; // Valores aproximados baseados no padding

  return (
    <>
      {/* Spacer para evitar sobreposição */}
      <div style={{ height: navbarHeight }} aria-hidden="true"></div>
      
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg py-2' 
            : 'bg-green-800/50 dark:bg-gray-900 backdrop-blur-sm py-4'
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className={`flex items-center justify-center rounded-full p-2 ${
              isScrolled ? 'bg-green-600 dark:bg-green-600' : 'bg-green-500 dark:bg-green-600'
            } transition-all duration-300 group-hover:scale-105`}>
              <FaLeaf className="text-white text-lg" />
            </div>
            <div className="ml-2">
              <span className={`font-bold text-xl transition-all duration-300 ${
                isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'
              }`}>
                FitFood
              </span>
              <span className={`block text-xs italic transition-all duration-300 ${
                isScrolled 
                  ? 'text-green-600 dark:text-green-500' 
                  : 'text-green-200 dark:text-green-400'
              }`}>
                Nutrição que transforma
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`relative py-1 transition-colors duration-300 ${
                  isActive(link.path) 
                    ? isScrolled 
                      ? 'text-green-600 dark:text-green-500 font-medium' 
                      : 'text-white font-medium'
                    : isScrolled 
                      ? 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500' 
                      : 'text-white/80 dark:text-gray-300 hover:text-white dark:hover:text-white'
                }`}
              >
                {link.title}
                {isActive(link.path) && (
                  <motion.div 
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                      isScrolled ? 'bg-green-600 dark:bg-green-500' : 'bg-white dark:bg-green-500'
                    }`}
                    layoutId="navbar-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            <div className="flex items-center space-x-4">
              <CartDropdown isScrolled={isScrolled} />
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center space-x-4 md:hidden">
            <CartDropdown isScrolled={isScrolled} />
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-full ${
                isScrolled ? 'text-gray-700 dark:text-white' : 'text-white'
              }`}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white dark:bg-gray-900 shadow-lg"
            >
              <div className="container mx-auto px-6 py-4">
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`py-2 px-4 rounded-md ${
                        isActive(link.path)
                          ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-500 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {link.title}
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;