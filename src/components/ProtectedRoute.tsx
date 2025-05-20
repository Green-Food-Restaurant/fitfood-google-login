import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from '@/components/ui/sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isAdmin, loading, user, error } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Verificação adicional para garantir que temos um usuário válido
  useEffect(() => {
    // Se não estiver carregando, estiver autenticado, mas não tiver dados do usuário
    if (!loading && isAuthenticated && !user) {
      console.warn('Estado de autenticação inconsistente: autenticado, mas sem dados de usuário');
      toast.error('Erro de autenticação', {
        description: 'Seus dados de usuário estão incompletos. Por favor, faça login novamente.'
      });
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loading, user, navigate]);

  // Mostrar erro de autenticação se existir
  useEffect(() => {
    if (error) {
      toast.error('Erro de autenticação', {
        description: error
      });
    }
  }, [error]);

  // Verificar se o usuário tem permissão para acessar a rota protegida para administradores
  useEffect(() => {
    if (!loading && isAuthenticated && requireAdmin && !isAdmin) {
      toast.error('Acesso negado', {
        description: 'Você não tem permissão para acessar esta área.'
      });
    }
  }, [loading, isAuthenticated, requireAdmin, isAdmin]);

  // Enquanto verifica a autenticação, mostra um spinner de carregamento
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Verificando autenticação...
        </p>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    // Salvar a página que o usuário tentou acessar
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Se a rota requer admin e o usuário não é admin, redireciona para home
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  // Se estiver autenticado e tiver as permissões necessárias, renderiza o componente filho
  return <>{children}</>;
};

export default ProtectedRoute;
