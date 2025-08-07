
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

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

  useEffect(() => {
    // Verificar se o script do Google foi carregado
    const checkGoogleScript = () => {
      if (window.google && window.google.accounts) {
        console.log('Script do Google carregado com sucesso');
        setGoogleScriptLoaded(true);
        setGoogleScriptError(false);
      } else {
        console.error('Script do Google não foi carregado');
        setGoogleScriptLoaded(false);
        setGoogleScriptError(true);
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
    <div className="google-login-wrapper">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
        useOneTap={true}
        text="continue_with"
        shape="pill"
        size="large"
        locale="pt-BR"
        theme="filled_black"
        logo_alignment="left"
        context="signin"
      />
    </div>
  );
};

export default GoogleAuthButton;
