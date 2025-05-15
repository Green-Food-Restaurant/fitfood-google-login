import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white mt-16 py-6">
      <div className="container mx-auto text-center text-sm text-gray-500">
        © {new Date().getFullYear()} FitFood. Sua jornada para uma alimentação mais saudável começa aqui.
      </div>
    </footer>
  );
};

export default Footer;