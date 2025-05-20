import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import { CartProvider } from "react-use-cart";
import { ThemeProvider } from "next-themes";
import { preloadPlaceholders } from "@/utils/placeholders";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import SessionTimeoutModal from "@/components/SessionTimeoutModal";

const queryClient = new QueryClient();

// Iniciar pré-carregamento de imagens placeholder
const preloadedImages = preloadPlaceholders();

// Armazenamos as imagens pré-carregadas como uma propriedade global para evitar que sejam coletadas pelo garbage collector
(window as any).__preloadedPlaceholderImages = preloadedImages;

// Componente para lidar com eventos de navegação programática
const NavigationEventHandler = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Handler para o evento de redirecionamento personalizado
    const handleRedirectEvent = (e: CustomEvent) => {
      const path = e.detail?.path;
      if (path) {
        navigate(path);
      }
    };
    
    // Adicionar listener para o evento personalizado
    document.addEventListener('auth:redirect', handleRedirectEvent as EventListener);
    
    // Limpar listener na desmontagem
    return () => {
      document.removeEventListener('auth:redirect', handleRedirectEvent as EventListener);
    };
  }, [navigate]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <SessionTimeoutModal />
            <BrowserRouter>
              <NavigationEventHandler />
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
                <Route path="/products" element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                } />
                <Route path="/produtos" element={<Navigate to="/products" />} />
                <Route path="/carrinho" element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } />
                <Route path="/cart" element={<Navigate to="/carrinho" />} />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <Admin />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
