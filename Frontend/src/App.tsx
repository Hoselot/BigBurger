import { useEffect } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import { isTokenExpired } from "./utils/token-functions";
import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import CrudPage from "@/pages/crud";

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
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<CrudPage />} path="/crud" />
    </Routes>
  );
}

export default App;
