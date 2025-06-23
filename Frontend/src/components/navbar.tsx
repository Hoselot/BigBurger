import { useNavigate, useLocation } from "react-router-dom";





import React from "react";
import { useState, useEffect } from "react";
import { Link } from "@heroui/link";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Button } from "@heroui/button";
import {Tabs, Tab} from "@heroui/tabs";
import Image from "./logo";
import  SearchModal  from "@/components/search";
import { useAuth } from "../utils/auth-context";
import { PiHamburgerThin, PiNotepadThin,PiBreadThin, PiBoxArrowDownThin, PiMathOperationsThin, PiBagThin } from "react-icons/pi";
import { CiMenuBurger } from "react-icons/ci";
import { AnimatePresence, motion } from "motion/react"
import useTotalCarrito from "@/hooks/useTotalCarrito";

import { Icon } from "@iconify/react";




export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

// Menu Principal
const location = useLocation();
const navigate = useNavigate();
const currentPath = location.pathname;




  // Stilos del Navbar
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
 
  let lastScrollY = 0;
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setVisible(false); // Oculta el nav al bajar
      } else {
        setVisible(true); // Muestra el nav al subir
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
// verificacion de logueo
  const { isLoggedIn } = useAuth(); // Se asume que useAuth está correctamente tipado
  // menu
  const total = useTotalCarrito();
  return (
    <nav
    className={`fixed top-0 left-0 w-full p-3 transition-transform duration-300 z-50 ${
      visible ? "translate-y-0" : "-translate-y-full"
    } bg-red-700 `}
  >
    {/* Logo */}
    
    <div className="grid grid-cols-[auto_1fr_auto] items-center">
  {/* Logo */}
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Link href="/" color="foreground">
      <Image />
    </Link>
  </motion.div>

  {/* Tabs (solo en pantallas grandes) */}
  
  <motion.div
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}
  className="hidden md:flex justify-center "
>
  
    <Tabs
  aria-label="Options"
  selectedKey={
    currentPath === "/purchase-instructions-page"
      ? "Pedidos"
      : "Hamburguesas"
  }
  onSelectionChange={(key) => {
    if (key === "Hamburguesas") navigate("/");
    else if (key === "Pedidos") navigate("/purchase-instructions-page");
  }}
  variant="solid"
  radius="lg"
  size="lg"
  color="default"
>
  <Tab key="Hamburguesas" title={<div className="flex items-center space-x-2"><PiHamburgerThin className='size-7'/><span>Hamburguesas</span></div>} />
  <Tab key="Pedidos" title={<div className="flex items-center space-x-2"><PiNotepadThin className='size-7'/><span>¿Cómo hacer un Pedido?</span></div>} />
</Tabs>
<div className="d">

      
</div>
  </motion.div>

  {/* Carrito + Menú Admin (espaciado adecuado) */}
  <div className="hidden md:flex items-center gap-5">
    <Button
      isIconOnly
        variant="flat"
        color="default"
        startContent={<Icon icon="lucide:search" />}
        onPress={handleOpen}
        className="text-sm font-medium bg-white"
      >
        
      </Button>
      <SearchModal isOpen={isOpen} onClose={handleClose} />
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex items-center bg-white rounded-xl px-2"
    >
      
      <h1>${total.toFixed(2)}</h1>
      <Link href="/carrito" color="foreground">
      <Button isIconOnly variant="light">
        <PiBagThin className="size-7"/>
      </Button>
      
      </Link>
    </motion.div>
    

    {isLoggedIn && (
      <Dropdown>
        <DropdownTrigger>
          <Button color="default" variant="shadow">
            Menú Admin
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions" variant="faded">
          <DropdownItem key="burgers" href="/BurgerPage" description="Gestión de hamburguesas" startContent={<PiHamburgerThin className="h-7 w-7 shrink-0"/>}>
            Hamburguesas
          </DropdownItem>
          <DropdownItem key="elements" href="/ElementPage" description="Gestión de ingredientes" startContent={<PiBreadThin className="h-7 w-7 shrink-0"/>}>
            Elementos
          </DropdownItem>
          <DropdownItem key="stock" href="/crud" description="Control de inventario" startContent={<PiBoxArrowDownThin className="h-7 w-7 shrink-0"/>}>
            Stock
          </DropdownItem>
          <DropdownItem key="pedidos" href="/crud" description="Administración de pedidos" startContent={<PiNotepadThin className="h-7 w-7 shrink-0"/>}>
            Pedidos
          </DropdownItem>
          <DropdownItem key="finazas" href="/crud" description="Control financiero" startContent={<PiMathOperationsThin className="h-7 w-7 shrink-0"/>}>
            Finanzas
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )}
  </div>

  {/* Botón Menú Hamburguesa en pantallas pequeñas */}
  <Button 
    variant="light" 
    size="lg" 
    isIconOnly 
    radius="lg" 
    className="md:hidden absolute right-3  p-2"
    onPress={() => setMenuOpen(!menuOpen)}
  >
    <CiMenuBurger />
  </Button>
</div>


    {/* Menú hamburguesa (solo en pantallas pequeñas y si está abierto) */}
    <AnimatePresence>
    {menuOpen && (
      

      <motion.div
      key="menu"
      initial={{ opacity: 0, y: -20 }}
      animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      exit={{ opacity: 0, y: -50, transition: { duration: 0.3 } }} // Aquí cambiamos la animación de salida
      transition={{ duration: 0.3 }}
      className="absolute top-full left-0 w-full bg-red-700 shadow-lg p-4 flex flex-col items-center space-y-4 md:hidden"
    >
      <Tabs aria-label="Options" variant="solid" radius="lg" size="lg" color="default" isVertical>
        <Tab key="burguers" title={<div className="flex items-center space-x-2"><PiHamburgerThin className='size-7'/><span>Hamburguesas</span></div>} />
        <Tab key="pedido" title={<div className="flex items-center space-x-2"><PiNotepadThin className='size-7'/><span>¿Cómo hacer un Pedido?</span></div>} />
      </Tabs>
      <div
        
        className="md:flex flex items-center gap-5   bg-white rounded-xl px-2 mx-5">
          <h1>
            $0.00
          </h1>
          <Button isIconOnly variant="light" >
          <PiBagThin className="size-7"/>
          </Button>
      </div>
      {isLoggedIn ? (
            <Dropdown >
              <DropdownTrigger>
                <Button color="default" variant="shadow">
                  Menú Admin
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions" variant="faded">
                <DropdownItem key="burgers" href="/BurgerPage" description="Gestión de hamburguesas" startContent={<PiHamburgerThin className="h-7 w-7 shrink-0"/>}>
                  Hamburguesas
                </DropdownItem>
                <DropdownItem key="elements" href="/ElementPage" description="Gestión de ingredientes" startContent={<PiBreadThin className="h-7 w-7 shrink-0"/>}>
                  Elementos
                </DropdownItem>
                <DropdownItem key="stock" href="/crud" description="Control de inventario" startContent={<PiBoxArrowDownThin className="h-7 w-7 shrink-0"/>}>
                  Stock
                </DropdownItem>
                <DropdownItem key="pedidos" href="/crud" description="Administración de pedidos" startContent={<PiNotepadThin className="h-7 w-7 shrink-0"/>}>
                Pedidos
                </DropdownItem>
                <DropdownItem key="finazas" href="/crud" description="Control financiero" startContent={<PiMathOperationsThin className="h-7 w-7 shrink-0"/>}>
                  Finanzas
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : null}
    </motion.div>
     
      
      
    )}
     </AnimatePresence>
  </nav>
   
   
  );
};
