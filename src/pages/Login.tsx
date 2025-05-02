
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import GoogleAuthButton from '@/components/GoogleAuthButton';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image and branding */}
      <div className="md:w-1/2 bg-fitfood-light p-6 flex flex-col justify-between bg-food-pattern">
        <div>
          <h1 className="text-3xl font-bold text-fitfood-dark mb-2">FitFood</h1>
          <p className="text-fitfood-dark/80">Nutrição que transforma</p>
        </div>
        
        <div className="hidden md:block">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-fitfood-dark mb-4">Alimente-se bem, viva melhor</h2>
            <p className="text-gray-700 mb-4">
              Descubra refeições saudáveis e deliciosas personalizadas para seus objetivos fitness.
              Faça login para acessar seu plano de alimentação personalizado.
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-fitfood-primary animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-fitfood-secondary animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 rounded-full bg-fitfood-accent animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="md:w-1/2 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Bem-vindo ao FitFood</CardTitle>
            <CardDescription>
              Faça login para acessar suas refeições personalizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <GoogleAuthButton />
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Informações
                </span>
              </div>
            </div>
            
            <div className="text-sm text-center text-gray-600">
              <p>Ao fazer login com o Google, você concorda com nossos</p>
              <div className="mt-1 flex justify-center space-x-2">
                <Link to="/terms" className="text-fitfood-primary hover:text-fitfood-dark underline">
                  Termos de Serviço
                </Link>
                <span>&</span>
                <Link to="/privacy" className="text-fitfood-primary hover:text-fitfood-dark underline">
                  Política de Privacidade
                </Link>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-xs text-center text-gray-500">
              FitFood - Sua jornada para uma alimentação mais saudável começa aqui
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
