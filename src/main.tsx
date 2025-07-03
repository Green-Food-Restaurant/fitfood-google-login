import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';


const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "565009893604-sp8bd8vhclislma6b4anlla3sd23f0dr.apps.googleusercontent.com"; 

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider 
      clientId={GOOGLE_CLIENT_ID}
      onScriptLoadError={() => console.error('Falha ao carregar script do Google OAuth')}
      onScriptLoadSuccess={() => console.log('Script do Google OAuth carregado com sucesso')}
      nonce="fitfood-nonce"
      scriptAsync={true}
    >
      <App />
    </GoogleOAuthProvider>
);
