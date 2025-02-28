import { useEffect } from 'react';
import { useNavigate, Route, Routes, matchPath} from 'react-router-dom';
import { isTokenExpired } from "./utils/token-functions";
import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import IndividualBurgerPage from "@/pages/individual-product-page";
import PruebaTabla from "@/components/probartabla"
import ElementPage from "@/pages/element-page";
import PapasPage from "@/pages/papas-page";
import BurgerPage from "@/pages/burger-page";
import LocationPicker from './components/LocationPicker';

function App() {
  const navigate = useNavigate();
  const publicRoutes = ["/", "/IndividualBurgerPage/:id"];

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    // Verificar si la ruta actual está dentro de las públicas
    const isPublicRoute = publicRoutes.some(route =>
      matchPath(route, location.pathname)
    );

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      if (!isPublicRoute) {
        navigate("/");
      }
    }
  }, [navigate, location]);
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<IndividualBurgerPage />} path="/IndividualBurgerPage/:id" />
      <Route element={<ElementPage />} path="/ElementPage" />
      <Route element={<PapasPage />} path="/PapasPage" />
      <Route element={<BurgerPage />} path="/BurgerPage" />
      <Route element={<LocationPicker />} path="/LocationPicker" />
      <Route element={<PruebaTabla />} path="/ppp" />
    </Routes>
  );
}

export default App;
