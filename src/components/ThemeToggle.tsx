// components/ThemeToggle.tsx
import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Verificar preferência no carregamento
    const isDarkMode = localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDark(!isDark);
  };

  return (
    <button 
      onClick={toggleTheme} 
      className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md"
      aria-label="Alternar tema"
    >
      {isDark ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
    </button>
  );
};

export default ThemeToggle;