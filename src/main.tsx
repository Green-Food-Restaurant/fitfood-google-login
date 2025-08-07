import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';


const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Função para gerar um nonce aleatório sem depender de bibliotecas externas
function generateNonce(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);
  randomValues.forEach(val => {
    result += chars.charAt(val % chars.length);
  });
  return result;
}

// Gerar um nonce único para o script do Google OAuth
const nonce = generateNonce();

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider 
      clientId={GOOGLE_CLIENT_ID}
      onScriptLoadError={() => console.error('Falha ao carregar Google OAuth')}
      onScriptLoadSuccess={() => console.log('Google OAuth carregado com sucesso')}
      nonce={nonce}
      // scriptAsync={true}
    >
      <App />
    </GoogleOAuthProvider>
);
