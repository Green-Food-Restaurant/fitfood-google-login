import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GoogleAuthButton from '@/components/GoogleAuthButton';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, login } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);

  // Verificar se o usuário já está autenticado, se sim, redirecionar para home
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/home';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);
  
  // Variantes de animação para elementos da página
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.6, 
        staggerChildren: 0.2 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      } 
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 relative">
      {/* Theme Toggle Button - Fixed position */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Left side - Visuals and branding */}
      <motion.div 
        className="relative flex-1 hidden md:flex flex-col items-center justify-center p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Animated shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -left-16 top-1/4 w-64 h-64 rounded-full bg-green-200/50 dark:bg-green-900/30 blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -30, 0]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 15,
              ease: "easeInOut" 
            }}
          />
          <motion.div 
            className="absolute right-20 bottom-1/3 w-80 h-80 rounded-full bg-green-100/60 dark:bg-green-800/20 blur-xl"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, -30, 0],
              y: [0, 40, 0]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 18,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute left-1/3 bottom-1/4 w-72 h-72 rounded-full bg-green-300/40 dark:bg-green-700/20 blur-xl"
            animate={{ 
              scale: [1, 0.8, 1],
              y: [0, 25, 0]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 20,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Logo and branding */}
        <motion.div 
          className="relative z-10 flex flex-col items-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="bg-gradient-to-r from-green-600 to-green-400 rounded-full p-6 shadow-lg mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-apple">
              <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z"/>
              <path d="M10 2c1 .5 2 2 2 5"/>
            </svg>
          </div>
          
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Green Food
          </h1>
          
          <div className="flex items-center gap-2 mb-8">
            <div className="h-1 w-6 bg-green-400 rounded-full"></div>
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Nutrição que transforma</p>
            <div className="h-1 w-6 bg-green-400 rounded-full"></div>
          </div>
          
          <motion.div 
            className="space-y-6 max-w-md text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-3 justify-center">
              <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Refeições personalizadas para seus objetivos</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-center gap-3 justify-center">
              <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Acompanhamento nutricional completo</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-center gap-3 justify-center">
              <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Receitas exclusivas de chefs profissionais</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right side - Login form */}
      <motion.div 
        className="flex-1 flex items-center justify-center p-8"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Mobile logo - Visible apenas em mobile */}
        <div className="absolute top-4 left-4 md:hidden">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 dark:bg-gray-800 p-2 rounded-full shadow">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z"/>
                <path d="M10 2c1 .5 2 2 2 5"/>
              </svg>
            </div>
            <span className="text-lg font-semibold text-green-600 dark:text-green-400">Green Food</span>
          </div>
        </div>
        
        <motion.div 
          className="w-full max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-0 shadow-2xl dark:shadow-green-900/20 bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 dark:border-gray-700 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-16 -bottom-16 w-32 h-32 rounded-full bg-green-100 dark:bg-green-900/20 blur-md"></div>
              <div className="absolute -left-16 -top-16 w-32 h-32 rounded-full bg-green-50 dark:bg-green-900/10 blur-md"></div>
            </div>
            
            <CardHeader className="relative z-10 space-y-2 text-center pb-6">
              <div className="flex justify-center mb-4 md:hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-400 rounded-full p-3 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-apple">
                    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z"/>
                    <path d="M10 2c1 .5 2 2 2 5"/>
                  </svg>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold dark:text-white">Bem-vindo</CardTitle>
              <p className="text-gray-500 dark:text-gray-400">
                Acesse sua conta para continuar
              </p>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-6 pb-8">
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex flex-col items-center">
                  <GoogleAuthButton rememberMe={rememberMe} />
                </div>
                
                <div className="flex items-center space-x-2 mt-4 justify-center">
                  <Checkbox 
                    id="rememberMe" 
                    checked={rememberMe} 
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
                  />
                  <Label 
                    htmlFor="rememberMe" 
                    className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
                  >
                    Lembrar-me
                  </Label>
                </div>
                
                <div className="text-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Acesso seguro e protegido
                  </span>
                </div>

                {loading && (
                  <div className="my-4 flex justify-center items-center space-x-2">
                    <div className="w-5 h-5 rounded-full border-2 border-green-500 border-t-transparent animate-spin"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Autenticando...</span>
                  </div>
                )}
                
                <motion.div 
                  className="pt-4 flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((index) => (
                      <motion.div
                        key={index}
                        className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          delay: index * 0.2
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
