import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 mt-auto py-8 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo e informações da empresa */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center mb-4">
              <div className="bg-green-600 dark:bg-green-500 rounded-full p-2 mr-2">
                <FaLeaf className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white">FitFood</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center md:text-left">
              Nutrição personalizada para um estilo de vida mais saudável.
            </p>
          </div>
          
          {/* Links rápidos */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Links Rápidos</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">Home</Link>
              <Link to="/produtos" className="text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">Produtos</Link>
              <Link to="/sobre" className="text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">Sobre Nós</Link>
              <Link to="/contato" className="text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">Contato</Link>
            </div>
          </div>
          
          {/* Redes sociais */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Siga-nos</h3>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
                <FaInstagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} FitFood. Sua jornada para uma alimentação mais saudável começa aqui.
        </div>
      </div>
    </footer>
  );
};

export default Footer;