import { useEffect } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import { isTokenExpired } from "./utils/token-functions";
import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import IndividualBurgerPage from "@/pages/individual-product-page";
import PruebaTabla from "@/components/probartabla"
import ElementPage from "@/pages/element-page";

import BurgerPage from "@/pages/burger-page";
import LocationPicker from './components/LocationPicker';

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
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<IndividualBurgerPage />} path="/IndividualBurgerPage/:id" />
      <Route element={<ElementPage />} path="/ElementPage" />
      <Route element={<BurgerPage />} path="/BurgerPage" />
      <Route element={<LocationPicker />} path="/LocationPicker" />
      <Route element={<PruebaTabla />} path="/ppp" />
    </Routes>
  );
}

export default App;
