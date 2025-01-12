import React from "react";
import Logo from "../Logo/Logo"
import BotonLogin from "../Modal/Modal"
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";




const menuItems = [
  "Promociones",
  "Hamburguesas",
  "Otros"
];


const CustomNavbar = () => {
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
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="lg:flex">
          <BotonLogin/>
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
    </Navbar>
  );
};

export default CustomNavbar;