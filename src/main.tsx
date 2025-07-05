import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';


const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID; 

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider 
      clientId={GOOGLE_CLIENT_ID}
      onScriptLoadError={() => console.error('Falha ao carregar Google OAuth')}
      onScriptLoadSuccess={() => console.log('Google OAuth carregado com sucesso')}
      // scriptAsync={true}
    >
      <App />
    </GoogleOAuthProvider>
);
