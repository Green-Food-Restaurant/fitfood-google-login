
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

// Idealmente você deve usar uma variável de ambiente para armazenar sua chave de cliente
// Para fins de demonstração, colocamos diretamente aqui
// Você precisará substituir isso pela sua própria chave de cliente do Google
const GOOGLE_CLIENT_ID = "SEU_GOOGLE_CLIENT_ID"; // Substitua pelo seu ID de cliente

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
