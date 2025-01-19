import React from 'react';  // Agregar esta línea al principio del archivo
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Button } from "@heroui/button";

import Image from "./logo";
import { useAuth } from "../utils/auth-context";

// Definir los items del menú de forma más clara.
const menuItems: string[] = [
  "Promociones",
  "Hamburguesas",
  "¿Cómo hacer un pedido?",
];

export const Navbar = () => {
  const { isLoggedIn } = useAuth(); // Se asume que useAuth está correctamente tipado
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false); // Tipo boolean para el estado del menú
  
  return (
    <HeroUINavbar maxWidth="xl" position="sticky" shouldHideOnScroll onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand >
        <Link href="/">
          <Image />
        </Link>
          
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Promociones
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href="#">
            Hamburguesas
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            ¿Cómo hacer un pedido?
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          {isLoggedIn ? (
            <Dropdown backdrop="blur">
              <DropdownTrigger>
                <Button color="primary" variant="shadow">
                  Menú Admin
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions" variant="faded">
                <DropdownItem key="new" href="/crud">
                  Crud
                </DropdownItem>
                <DropdownItem key="copy">Copy link</DropdownItem>
                <DropdownItem key="edit">Edit file</DropdownItem>
                <DropdownItem key="delete" className="text-danger" color="danger">
                  Delete file
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : null}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </HeroUINavbar>
  );
};
