import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';


const clientId = "565009893604-sp8bd8vhclislma6b4anlla3sd23f0dr.apps.googleusercontent.com"; 

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
);
