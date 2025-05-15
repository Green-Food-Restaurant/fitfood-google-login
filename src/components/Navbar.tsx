import React from 'react';
import CartDropdown from './CartDropdown';
import { Link } from 'react-router-dom'; // Assumindo que você está usando React Router

const Navbar = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-green-600">FitFood</span>
          <span className="ml-2 text-sm text-green-400 italic">Nutrição que transforma</span>
        </div>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
          <Link to="/produtos" className="hover:text-green-600 transition-colors">Produtos</Link>
          <Link to="/#sobre" className="hover:text-green-600 transition-colors">Sobre</Link>
          <Link to="/#contato" className="hover:text-green-600 transition-colors">Contato</Link>
          <CartDropdown />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;