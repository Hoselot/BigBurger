import React from "react";
import Logo from "../Logo/Logo"

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  
} from "@nextui-org/react";
import {Dropdown, DropdownMenu, DropdownTrigger, DropdownItem, Button} from "@nextui-org/react";

import { useAuth } from "../../utils/AuthContext";


const menuItems = [
  "Promociones",
  "Hamburguesas",
  "Otros"
];


const CustomNavbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <Navbar shouldHideOnScroll onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
        <Logo />
        <p className="font-bold text-inherit">LOGO</p>
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
            Otros
          </Link>
        </NavbarItem>
        <NavbarItem>
          {isLoggedIn ? (
            <Dropdown backdrop="blur">
            <DropdownTrigger>
              <Button color="primary" variant="shadow">Menú Admin</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions" variant="faded">
              <DropdownItem key="new" href="/Crud">Crud</DropdownItem>
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
      <NavbarContent justify="end">
        
        
        
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
    </Navbar>
  );
};

export default CustomNavbar;