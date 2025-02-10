import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async'; 
import "./index.css";
import { UserProvider } from './context/index.tsx';
import { QueryProvider } from './query/QueryProvider.tsx';
import { Toaster } from "@/components/ui/toaster"

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <BrowserRouter>
    <QueryProvider>
    <UserProvider>
      <App />
      <Toaster />
      </UserProvider>
      </QueryProvider>
    </BrowserRouter>
  </HelmetProvider>
);