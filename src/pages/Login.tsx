import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import GoogleAuthButton from '@/components/GoogleAuthButton';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

const Login = () => {
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
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden dark:bg-gray-900 relative">
      {/* Theme Toggle Button - Fixed position */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Left side - Visuals and branding */}
      <motion.div 
        className="relative hidden md:flex flex-col items-start justify-between p-8 bg-[#F4FDF2] dark:bg-gray-800"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo e Branding */}
        <motion.div 
          className="z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-green-600 dark:bg-green-500 rounded-full p-3 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-apple">
                <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z"/>
                <path d="M10 2c1 .5 2 2 2 5"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">FitFood</h1>
              <div className="flex items-center">
                <div className="h-0.5 w-3 bg-green-400 rounded-full mr-1"></div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium italic">Nutrição que transforma</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Imagem de fundo - Formas orgânicas */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <motion.div 
            className="absolute -left-16 -top-16 w-64 h-64 rounded-full bg-green-200 dark:bg-green-900/30 opacity-70"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 20,
              ease: "easeInOut" 
            }}
          />
          <motion.div 
            className="absolute right-24 top-48 w-96 h-96 rounded-full bg-green-100 dark:bg-green-800/30 opacity-60"
            animate={{ 
              scale: [1, 1.15, 1],
              x: [0, 20, 0]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 25,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute left-24 bottom-24 w-72 h-72 rounded-full bg-green-300 dark:bg-green-700/30 opacity-50"
            animate={{ 
              scale: [1, 0.9, 1],
              y: [0, 15, 0]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 18,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Conteúdo explicativo */}
        <motion.div 
          className="relative z-10 max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100 dark:border-green-900/30"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-2xl font-bold text-gray-800 dark:text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Sua jornada para um estilo de vida mais saudável
          </motion.h2>
          
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="flex items-start gap-3">
              <div className="mt-1 bg-green-100 dark:bg-green-900/50 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300">Refeições personalizadas com base nos seus objetivos de saúde e preferências dietéticas</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-start gap-3">
              <div className="mt-1 bg-green-100 dark:bg-green-900/50 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300">Acompanhamento de nutrientes e calorias para ajudar você a manter-se no caminho certo</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-start gap-3">
              <div className="mt-1 bg-green-100 dark:bg-green-900/50 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300">Receitas exclusivas desenvolvidas por nutricionistas e chefs profissionais</p>
            </motion.div>
          </motion.div>
          
          <div className="mt-6 flex items-center space-x-3">
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

      {/* Right side - Login form */}
      <motion.div 
        className="flex items-center justify-center p-8 bg-white dark:bg-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Mobile Theme Toggle - Visible apenas em mobile */}
        <div className="absolute top-4 left-4 md:hidden">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 dark:bg-gray-800 p-1.5 rounded-full shadow">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z"/>
                <path d="M10 2c1 .5 2 2 2 5"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">FitFood</span>
          </div>
        </div>
        
        <motion.div 
          className="w-full max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-0 shadow-xl dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="space-y-2 text-center pb-6">
              <div className="flex justify-center mb-2 md:hidden">
                <div className="bg-green-600 dark:bg-green-500 rounded-full p-2 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-apple">
                    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z"/>
                    <path d="M10 2c1 .5 2 2 2 5"/>
                  </svg>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold dark:text-white">Bem-vindo ao FitFood</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Faça login para acessar suas refeições personalizadas
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <GoogleAuthButton />
                
                <div className="text-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Rápido, seguro e sem senhas adicionais
                  </span>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="absolute inset-0 flex items-center">
                  <Separator className="dark:bg-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card dark:bg-gray-800 px-2 text-muted-foreground dark:text-gray-400">
                    Informações
                  </span>
                </div>
              </motion.div>
              
              <motion.div 
                className="text-sm text-center text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p>Ao fazer login com o Google, você concorda com nossos</p>
                <div className="mt-1 flex justify-center space-x-2">
                  <Link to="/terms" className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 underline transition-colors">
                    Termos de Serviço
                  </Link>
                  <span>&</span>
                  <Link to="/privacy" className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 underline transition-colors">
                    Política de Privacidade
                  </Link>
                </div>
              </motion.div>
            </CardContent>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <CardFooter className="flex flex-col space-y-2 pb-6 pt-2">
                <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                  FitFood - Sua jornada para uma alimentação mais saudável começa aqui
                </p>
              </CardFooter>
            </motion.div>
          </Card>
          
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ainda não tem uma conta?{" "}
              <Link to="/signup" className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium">
                Criar conta
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
