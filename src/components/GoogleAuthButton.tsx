
import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import axios from 'axios';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const GoogleAuthButton = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse: CredentialResponse): void => {
    try {
      console.log('Resposta de credenciais completa:', credentialResponse);

      // Verificar se temos a credencial
      if (!credentialResponse.credential) {
        console.error('Credencial não encontrada na resposta');
        return;
      }

      const idToken = credentialResponse.credential;
      console.log('ID Token recebido:', idToken);

      // Armazenar o ID token no localStorage
      localStorage.setItem('idToken', idToken);

      // Decodificar o ID token para obter informações do usuário
      try {
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        console.log('Informações do usuário decodificadas do token:', payload);

        // Armazenar informações do usuário no localStorage
        localStorage.setItem('user', JSON.stringify({
          name: payload.name,
          email: payload.email,
          picture: payload.picture
        }));
      } catch (e) {
        console.error('Erro ao decodificar o ID token:', e);
      }

      // Enviar o ID token para o backend para autenticação
      axios.post('http://173.249.12.112:8081/green-food/api/v1/auth/google/login', {
        idToken: idToken
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          console.log('Resposta do backend:', response.data);
          navigate('/home');
        })
        .catch(error => {
          console.error('Erro na autenticação com o backend:', error);
          // Mesmo se a autenticação do backend falhar, ainda navegar para a página inicial
          console.log('Navegando para a página inicial apesar do erro no backend');
          navigate('/home');
        });

    } catch (error) {
      console.error('Erro durante o processo de login:', error);
    }
  };

  const handleLoginError = (): void => {
    console.error('Login do Google falhou');
  };
  const handleGoogleLogin = () => {
    // This is a placeholder for the Google authentication logic
    // In a real application, you would integrate with Google OAuth here
    toast.info("Google authentication would happen here. This is a demo.");
    console.log("Google authentication initiated");
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={handleLoginError}
      useOneTap
      //    theme="filled_green"
      text="signin_with"
      shape="pill"
      size="large"
      locale="pt-BR"
      logo_alignment="center"
    />
  );
};

export default GoogleAuthButton;
