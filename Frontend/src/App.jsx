import { useState, useEffect } from 'react'
import './App.css';
import './Css/General.css';
import { motion } from "motion/react"
import { isTokenExpired } from "./utils/TokenFunctions"
import MainPage from './Pages/MainPage/MainPage';
import { useNavigate } from 'react-router-dom';


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
    <>
      <MainPage />
    </>
  )
}

export default App
