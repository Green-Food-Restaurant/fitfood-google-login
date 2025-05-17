import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const queryClient = new QueryClient();

// Iniciar pré-carregamento de imagens placeholder
const preloadedImages = preloadPlaceholders();

// Armazenamos as imagens pré-carregadas como uma propriedade global para evitar que sejam coletadas pelo garbage collector
(window as any).__preloadedPlaceholderImages = preloadedImages;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/produtos" element={<Navigate to="/products" />} />
              <Route path="/carrinho" element={<Cart />} />
              <Route path="/cart" element={<Navigate to="/carrinho" />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
