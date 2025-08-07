import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white mt-auto py-8 border-t border-gray-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo e informações da empresa */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center mb-4">
              <div className="bg-green-600 rounded-full p-2 mr-2">
                <FaLeaf className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-800">Green Food</span>
            </Link>
            <p className="text-sm text-gray-600 text-center md:text-left">
              Nutrição personalizada para um estilo de vida mais saudável.
            </p>
          </div>
          
          {/* Links rápidos */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-gray-800 mb-3">Links Rápidos</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-sm text-gray-600 hover:text-green-600 transition-colors">Home</Link>
              <Link to="/produtos" className="text-sm text-gray-600 hover:text-green-600 transition-colors">Produtos</Link>
              <Link to="/sobre" className="text-sm text-gray-600 hover:text-green-600 transition-colors">Sobre Nós</Link>
              <Link to="/contato" className="text-sm text-gray-600 hover:text-green-600 transition-colors">Contato</Link>
            </div>
          </div>
          
          {/* Redes sociais */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-gray-800 mb-3">Siga-nos</h3>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600">
                <FaInstagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Green Food. Sua jornada para uma alimentação mais saudável começa aqui.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
