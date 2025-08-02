import { useNavigate, useLocation } from "react-router-dom";
// No necesitamos 'React' en el scope con las nuevas versiones de React, pero sí los hooks y tipos.
import { useState, useEffect, FC, Key } from "react";
import { Link } from "@heroui/link";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import Image from "./logo";
import SearchModal from "@/components/search";
import { useAuth } from "../utils/auth-context";
import { PiHamburgerThin, PiNotepadThin, PiBreadThin, PiBoxArrowDownThin, PiMathOperationsThin, PiBagThin } from "react-icons/pi";
import { CiMenuBurger } from "react-icons/ci";
import { AnimatePresence, motion } from "framer-motion";
import useTotalCarrito from "@/hooks/useTotalCarrito";
import { Icon } from "@iconify/react";

// --- Tipos para las props de nuestros componentes ---

interface NavigationTabsProps {
  isVertical?: boolean; // '?' significa que la prop es opcional
}

interface CartDisplayProps {
  total: number;
}


// --- Componentes extraídos para reutilización (ahora tipados) ---

// 1. Pestañas de Navegación
const NavigationTabs: FC<NavigationTabsProps> = ({ isVertical = false }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const selectedKey = pathname === "/purchase-instructions-page" ? "Pedidos" : "Hamburguesas";

  // CORRECCIÓN 1: Tipamos el parámetro 'key'
  const handleSelectionChange = (key: Key) => {
    if (key === "Hamburguesas") navigate("/");
    else if (key === "Pedidos") navigate("/purchase-instructions-page");
  };

  return (
    <Tabs
      aria-label="Options"
      selectedKey={selectedKey}
      onSelectionChange={handleSelectionChange}
      variant="solid"
      radius="lg"
      size="lg"
      color="default"
      isVertical={isVertical}
    >
      <Tab key="Hamburguesas" title={<div className="flex items-center space-x-2"><PiHamburgerThin className='size-7'/><span>Hamburguesas</span></div>} />
      <Tab key="Pedidos" title={<div className="flex items-center space-x-2"><PiNotepadThin className='size-7'/><span>¿Cómo hacer un Pedido?</span></div>} />
    </Tabs>
  );
};

// 2. Menú de Administrador (No necesita props, pero FC es buena práctica)
const AdminMenu: FC = () => (
  <Dropdown>
    <DropdownTrigger>
      <Button color="default" variant="shadow">Menú Admin</Button>
    </DropdownTrigger>
    <DropdownMenu aria-label="Static Actions" variant="faded">
        <DropdownItem key="burgers" href="/BurgerPage" description="Gestión de hamburguesas" startContent={<PiHamburgerThin className="h-7 w-7 shrink-0"/>}>Hamburguesas</DropdownItem>
        <DropdownItem key="elements" href="/ElementPage" description="Gestión de ingredientes" startContent={<PiBreadThin className="h-7 w-7 shrink-0"/>}>Elementos</DropdownItem>
        <DropdownItem key="stock" href="/crud" description="Control de inventario" startContent={<PiBoxArrowDownThin className="h-7 w-7 shrink-0"/>}>Stock</DropdownItem>
        <DropdownItem key="pedidos" href="/crud" description="Administración de pedidos" startContent={<PiNotepadThin className="h-7 w-7 shrink-0"/>}>Pedidos</DropdownItem>
        <DropdownItem key="finazas" href="/crud" description="Control financiero" startContent={<PiMathOperationsThin className="h-7 w-7 shrink-0"/>}>Finanzas</DropdownItem>
    </DropdownMenu>
  </Dropdown>
);

// 3. Display del Carrito
// CORRECCIÓN 2: Tipamos las props que recibe el componente
const CartDisplay: FC<CartDisplayProps> = ({ total }) => (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="flex items-center bg-white rounded-xl px-2"
  >
     <Link href="/carrito" color="foreground">
    <h1>${total.toFixed(2)}</h1>
   
      <Button isIconOnly variant="light"><PiBagThin className="size-7"/></Button>
    </Link>
  </motion.div>
);


// --- Componente Principal Navbar ---

export const Navbar: FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isVisible, setVisible] = useState(true);
  
  const { isLoggedIn } = useAuth();
  const totalCarrito = useTotalCarrito();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      setVisible(window.scrollY < lastScrollY || window.scrollY < 10);
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full p-3 transition-transform duration-300 z-50 ${isVisible ? "translate-y-0" : "-translate-y-full"} bg-red-700`}>
      <div className="grid grid-cols-[auto_1fr_auto] items-center">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/" color="foreground"><Image /></Link>
        </motion.div>

        {/* Contenido de Escritorio */}
        <div className="hidden md:flex justify-center"><NavigationTabs /></div>
        <div className="hidden md:flex items-center gap-5">
          <Button isIconOnly variant="flat" color="default" startContent={<Icon icon="lucide:search" />} onPress={() => setIsSearchOpen(true)} className="text-sm font-medium bg-white" />
          <CartDisplay total={totalCarrito} />
          {isLoggedIn && <AdminMenu />}
        </div>
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

        {/* Botón de Menú Móvil */}
        <Button variant="light" size="lg" isIconOnly radius="lg" className="md:hidden justify-self-end p-2" onPress={() => setMenuOpen(!isMenuOpen)}>
          <CiMenuBurger />
        </Button>
      </div>

      {/* Menú desplegable para móvil */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50, transition: { duration: 0.3 } }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-red-700 shadow-lg p-4 flex flex-col items-center gap-4 md:hidden"
          >
            <NavigationTabs isVertical={true} />
            <div className="flex md:flex items-center justify-center gap-5">
              <Button isIconOnly variant="flat" color="default" startContent={<Icon icon="lucide:search" />} onPress={() => setIsSearchOpen(true)} className="text-sm font-medium bg-white" />
              <CartDisplay total={totalCarrito} />
            </div>
            {isLoggedIn && <AdminMenu />}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};