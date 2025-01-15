import { useState, useEffect } from 'react';
import { useNavigate, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import './Css/General.css';
import { motion } from "motion/react";
import { isTokenExpired } from "./utils/TokenFunctions";
import MainPage from './Pages/MainPage/MainPage';
import Crud from './Pages/CrudPage/CrudPage';
import NotFound from './Pages/NotFound/NotFound';  // Asegúrate de importar tu componente NotFound

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate]);

  return (
    
      <div>
        {/* Aquí va tu header o cualquier componente común en todas las páginas */}
        
        <Routes>
          <Route path="/Home" element={<MainPage />} />  {/* Uso de element en lugar de component */}
          <Route path="/Crud" element={<Crud />} />      {/* Uso de element en lugar de component */}
          
          {/* Página para rutas no encontradas */}
          <Route path="*" element={<NotFound />} />  {/* Correcta ruta de NotFound */}
        </Routes>

        {/* Aquí va tu footer o cualquier componente común en todas las páginas */}
      </div>
    
  );
}

export default App;
