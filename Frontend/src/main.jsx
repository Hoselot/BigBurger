import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from "./utils/AuthContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <NextUIProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </NextUIProvider>
    </BrowserRouter>
  </StrictMode>
);