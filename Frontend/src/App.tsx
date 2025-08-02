import { Suspense, lazy, useEffect } from 'react';
import { useNavigate, Route, Routes, matchPath, useLocation } from 'react-router-dom';
import { isTokenExpired } from "./utils/token-functions";

// ------------------------------------------------------------------------------------
// PASO 1: Convertir todas las importaciones de páginas a carga diferida (lazy loading)
// En lugar de importarlas directamente, usamos la función `lazy`.
// Esto le dice a Vite/Rollup que empaquete cada página en su propio archivo JS.
// ------------------------------------------------------------------------------------

const IndexPage = lazy(() => import('@/pages/index'));
const IntructionsPage = lazy(() => import('@/pages/purchase-instructions-page'));
const DocsPage = lazy(() => import('@/pages/docs'));
const IndividualBurgerPage = lazy(() => import('@/pages/individual-product-page'));
const ElementPage = lazy(() => import('@/pages/element-page'));
const PapasPage = lazy(() => import('@/pages/papas-page'));
const BurgerPage = lazy(() => import('@/pages/burger-page'));
const DrinksPage = lazy(() => import('@/pages/drink-page'));
const CarritoPage = lazy(() => import('./pages/carrito-page'));
const PruebaTabla = lazy(() => import('@/components/probartabla'));
const LocationPicker = lazy(() => import('./components/LocationPicker'));

// Páginas de pago
const PagoExitoso = lazy(() => import("./pages/PagoExitoso"));
const PagoFallido = lazy(() => import("./pages/PagoFallido"));
const PagoPendiente = lazy(() => import("./pages/PagoPendiente"));
const MPCheckOut = lazy(() => import("./pages/checkout"));


function App() {
  // El useEffect del tema no cambia, está perfecto.
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const navigate = useNavigate();
  const location = useLocation(); // Es mejor práctica obtener 'location' de este hook.
  const publicRoutes = ["/", "/IndividualBurgerPage/:id", "/mp-checkout", "/pago-exitoso", "/pago-fallido", "/pago-pendiente", "/carrito", "/purchase-instructions-page"];

  // El useEffect de la autenticación tampoco cambia.
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const isPublicRoute = publicRoutes.some(route => matchPath(route, location.pathname));

    if (!token || isTokenExpired(token as string)) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      if (!isPublicRoute) {
        navigate("/");
      }
    }
  }, [navigate, location]);


  return (
    // --------------------------------------------------------------------------
    // PASO 2: Envolver el componente <Routes> con <Suspense>
    // 'fallback' es el JSX que se mostrará mientras React descarga el código
    // de la página solicitada. Puede ser un simple texto o un componente de spinner.
    // --------------------------------------------------------------------------
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center">
        Cargando...
      </div>
    }>
      <Routes>
        {/* Las rutas no cambian, pero ahora usan los componentes cargados con lazy */}
        <Route element={<IndexPage />} path="/" />
        <Route element={<DocsPage />} path="/docs" />
        <Route element={<IndividualBurgerPage />} path="/IndividualBurgerPage/:id" />
        <Route element={<ElementPage />} path="/ElementPage" />
        <Route element={<DrinksPage />} path="/DrinksPage" />
        <Route element={<PapasPage />} path="/PapasPage" />
        <Route element={<BurgerPage />} path="/BurgerPage" />
        <Route element={<LocationPicker />} path="/LocationPicker" />
        <Route element={<PruebaTabla />} path="/ppp" />
        <Route element={<PagoExitoso />} path="/pago-exitoso" />
        <Route element={<PagoFallido />} path="/pago-fallido" />
        <Route element={<PagoPendiente />} path="/pago-pendiente" />
        <Route element={<MPCheckOut />} path="/mp-checkout" />
        <Route element={<CarritoPage />} path="/carrito" />
        <Route element={<IntructionsPage />} path="/purchase-instructions-page" />
      </Routes>
    </Suspense>
  );
}

export default App;