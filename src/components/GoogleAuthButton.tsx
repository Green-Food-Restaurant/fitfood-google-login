
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from "@/components/LoadingSpinner";
import "./GoogleAuthButton.css";

// Definir manualmente o tipo para CredentialResponse já que não temos @types disponível
interface CredentialResponse {
  credential?: string;
  select_by?: string;
  clientId?: string;
}

interface GoogleAuthButtonProps {
  rememberMe?: boolean;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ rememberMe = false }) => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState<boolean>(false);
  const [googleScriptError, setGoogleScriptError] = useState<boolean>(false);
  const [styleLoaded, setStyleLoaded] = useState<boolean>(false);
  const [checkingStyle, setCheckingStyle] = useState<boolean>(true);

  useEffect(() => {
    // Verificar se o script do Google foi carregado
    const checkGoogleScript = () => {
      if (window.google && window.google.accounts) {
        console.log('Script do Google carregado com sucesso');
        setGoogleScriptLoaded(true);
        setGoogleScriptError(false);
        
        // Verificar se os estilos do botão do Google foram carregados
        setTimeout(() => {
          const googleButton = document.querySelector('.nsm7Bb-HzV7m-LgbsSe');
          if (googleButton) {
            const styles = window.getComputedStyle(googleButton);
            const hasBackgroundColor = styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                                      styles.backgroundColor !== 'transparent';
            setStyleLoaded(hasBackgroundColor);
            console.log('Estilos do botão do Google carregados:', hasBackgroundColor);
          }
          setCheckingStyle(false);
        }, 1000);
      } else {
        console.error('Script do Google não foi carregado');
        setGoogleScriptLoaded(false);
        setGoogleScriptError(true);
        setCheckingStyle(false);
      }
    };

    // Verificar após um tempo para dar chance de carregar
    const timer = setTimeout(checkGoogleScript, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = async (credentialResponse: CredentialResponse): Promise<void> => {
    try {
      console.log('Resposta de credenciais recebida');

      // Verificar se temos a credencial
      if (!credentialResponse.credential) {
        console.error('Credencial não encontrada na resposta');
        toast.error('Falha na autenticação. Credencial inválida.');
        return;
      }

      try {
        // Usar o contexto de autenticação para fazer login, passando a opção de lembrar-me
        await login(credentialResponse.credential, rememberMe);
        
        // Navegar para a página inicial após login bem-sucedido
        navigate('/home');
        toast.success(`Login realizado com sucesso! ${rememberMe ? 'Você permanecerá conectado.' : ''}`);
      } catch (loginError: unknown) {
        console.error('Erro durante o processo de login:', loginError);
        
        // Mensagens de erro mais específicas
        const error = loginError as { message?: string; response?: { status?: number } };
        
        if (error?.message?.includes('network')) {
          toast.error('Erro de conexão. Verifique sua internet e tente novamente.');
        } else if (error?.response?.status === 401) {
          toast.error('Credenciais inválidas ou expiradas.');
        } else if (error?.response?.status === 403) {
          toast.error('Você não tem permissão para acessar o sistema.');
        } else {
          toast.error('Ocorreu um erro durante o login. Tente novamente.');
        }
      }
    } catch (error) {
      console.error('Erro ao processar credencial:', error);
      
      // Tratar possíveis erros específicos
      if (error instanceof Error) {
        toast.error(`Erro: ${error.message}`);
      } else {
        toast.error('Falha no processamento da autenticação. Tente novamente.');
      }
    }
  };

  const handleLoginError = (): void => {
    console.error('Login do Google falhou');
    toast.error('Falha na autenticação com o Google. Tente novamente.');
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center">
      {loading && <span className="text-xs text-gray-500 mb-2">Carregando...</span>}
      {error && <div className="text-xs text-red-500 mb-2">{error}</div>}
      <div className="w-full max-w-xs mx-auto">
        {checkingStyle ? (
          <div className="flex justify-center items-center h-10">
            <LoadingSpinner size="sm" />
          </div>
        ) : !googleScriptError ? (
          <>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              useOneTap={false}
              text="continue_with"
              shape="pill"
              size="large"
              locale="pt-BR"
              theme="filled_blue"
              width="100%"
              logo_alignment="left"
              context="signin"
            />
            {!styleLoaded && (
              <div className="mt-2 text-xs text-amber-600 text-center">
                <p>Se o botão aparecer como um retângulo branco, tente:</p>
                <Button 
                  variant="link" 
                  className="text-xs text-blue-600 p-0 h-auto" 
                  onClick={reloadPage}
                >
                  Recarregar a página
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-4 border border-gray-300 rounded-lg bg-gray-50">
            <div className="text-sm text-gray-700 mb-3">
              Não foi possível carregar o botão de login do Google.
            </div>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={reloadPage}
            >
              Tentar novamente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAuthButton;
