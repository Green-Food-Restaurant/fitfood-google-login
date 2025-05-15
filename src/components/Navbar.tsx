import React from 'react';
import CartDropdown from './CartDropdown';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">FitFood</span>
          <span className="ml-2 text-sm text-green-400 dark:text-green-300 italic">Nutrição que transforma</span>
        </div>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors">Home</Link>
          <Link to="/produtos" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors">Produtos</Link>
          <Link to="/#sobre" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors">Sobre</Link>
          <Link to="/#contato" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors">Contato</Link>
          <CartDropdown />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;