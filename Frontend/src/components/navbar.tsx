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
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const total = useTotalCarrito();

  useEffect(() => {
    let lastScrollY = 0;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setVisible(currentScrollY <= lastScrollY);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const navItems = [
    { key: "Hamburguesas", icon: "lucide:hamburger", label: "Hamburguesas", path: "/" },
    { key: "Pedidos", icon: "lucide:clipboard-list", label: "¿Cómo hacer un Pedido?", path: "/purchase-instructions-page" },
  ];

  const adminMenuItems = [
    { key: "burgers", icon: "lucide:hamburger", label: "Hamburguesas", description: "Gestión de hamburguesas", href: "/BurgerPage" },
    { key: "elements", icon: "lucide:bread", label: "Elementos", description: "Gestión de ingredientes", href: "/ElementPage" },
    { key: "stock", icon: "lucide:box", label: "Stock", description: "Control de inventario", href: "/crud" },
    { key: "pedidos", icon: "lucide:clipboard-list", label: "Pedidos", description: "Administración de pedidos", href: "/crud" },
    { key: "finazas", icon: "lucide:calculator", label: "Finanzas", description: "Control financiero", href: "/crud" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full p-3 transition-transform duration-300 z-50 ${
        visible ? "translate-y-0" : "-translate-y-full"
      } bg-red-700`}
    >
      <div className="grid grid-cols-[auto_1fr_auto] items-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" color="foreground">
            <Image />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:flex justify-center"
        >
          <Tabs
            aria-label="Navigation options"
            selectedKey={location.pathname === "/purchase-instructions-page" ? "Pedidos" : "Hamburguesas"}
            onSelectionChange={(key) => navigate(navItems.find(item => item.key === key)?.path || "/")}
            variant="solid"
            radius="lg"
            size="lg"
            color="default"
          >
            {navItems.map((item) => (
              <Tab 
                key={item.key} 
                title={
                  <div className="flex items-center space-x-2">
                    <Icon icon={item.icon} className="size-7"/>
                    <span>{item.label}</span>
                  </div>
                } 
              />
            ))}
          </Tabs>
        </motion.div>

        <div className="hidden md:flex items-center gap-5">
          <Button
            isIconOnly
            variant="flat"
            color="default"
            onPress={handleOpen}
            className="text-sm font-medium bg-white"
          >
            <Icon icon="lucide:search" />
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
                <Icon icon="lucide:shopping-bag" className="size-7"/>
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
              <DropdownMenu aria-label="Admin Actions" variant="faded">
                {adminMenuItems.map((item) => (
                  <DropdownItem 
                    key={item.key} 
                    href={item.href} 
                    description={item.description}
                    startContent={<Icon icon={item.icon} className="h-7 w-7 shrink-0"/>}
                  >
                    {item.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
        </div>

        <Button 
          variant="light" 
          size="lg" 
          isIconOnly 
          radius="lg" 
          className="md:hidden absolute right-3 p-2"
          onPress={() => setMenuOpen(!menuOpen)}
        >
          <Icon icon="lucide:menu" />
        </Button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50, transition: { duration: 0.3 } }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-red-700 shadow-lg p-4 flex flex-col items-center space-y-4 md:hidden"
          >
            <Tabs aria-label="Options" variant="solid" radius="lg" size="lg" color="default" isVertical>
              {navItems.map((item) => (
                <Tab 
                  key={item.key} 
                  title={
                    <div className="flex items-center space-x-2">
                      <Icon icon={item.icon} className="size-7"/>
                      <span>{item.label}</span>
                    </div>
                  } 
                />
              ))}
            </Tabs>
            <div className="flex items-center gap-5 bg-white rounded-xl px-2 mx-5">
              <h1>${total.toFixed(2)}</h1>
              <Button isIconOnly variant="light">
                <Icon icon="lucide:shopping-bag" className="size-7"/>
              </Button>
            </div>
            {isLoggedIn && (
              <Dropdown>
                <DropdownTrigger>
                  <Button color="default" variant="shadow">
                    Menú Admin
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Admin Actions" variant="faded">
                  {adminMenuItems.map((item) => (
                    <DropdownItem 
                      key={item.key} 
                      href={item.href} 
                      description={item.description}
                      startContent={<Icon icon={item.icon} className="h-7 w-7 shrink-0"/>}
                    >
                      {item.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};