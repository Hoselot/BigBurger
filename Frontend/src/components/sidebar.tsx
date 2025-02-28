"use client"
import { useLocation } from "react-router-dom";
import { cn } from "../utils/utils"
import { Button } from "@heroui/button"
import { Link } from "@heroui/link"
import { Listbox, ListboxItem} from "@heroui/listbox";
import Image from "./logo";
import { CiLogout, CiFries, CiDeliveryTruck } from "react-icons/ci";
import { PiBeerBottleThin ,PiCaretLineLeftThin, PiHamburgerThin, PiNotepadThin,PiBreadThin, PiBoxArrowDownThin, PiMathOperationsThin } from "react-icons/pi";





export function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: React.Dispatch<React.SetStateAction<boolean>> }) {
  const location = useLocation(); // Obtiene la URL actual
  const iconClasses = "text-3xl  pointer-events-none flex-shrink-0";
  return (
    <div
      className={cn(
        'fixed z-10 left-0 top-0 h-screen flex flex-col border-r bg-white transition-all duration-300',
        collapsed ? 'w-[90px]' : 'w-[240px]'
      )}
    >
      <div className="flex h-14  border-b border-navy-700 px-3">
        <div className={cn('flex items-center gap-2', collapsed ? 'justify-center' : 'justify-between')}>
          {!collapsed && (
            <div>
              <Link href="/" color="foreground">
                <Image />
              </Link>
            </div>
          )}
          <Button
            isIconOnly 
            aria-label="Arrow"
            variant="ghost"
            size="sm"
            className="w-2"
            onPress={() => setCollapsed(!collapsed)}
          >
            <PiCaretLineLeftThin
              className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
            />
          </Button>
        </div>
      </div>

      <nav className="space-y-1 p-2">
        <Listbox
        
          aria-label="Listbox menu with descriptions"
          variant="flat"
          className="w-full"
        >
          {[
            {
              key: "burgers",
              href: "/BurgerPage",
              label: "Hamburguesas",
              description: "Gestión de Hamburguesas",
              icon: <PiHamburgerThin className={iconClasses} />,
            },
            {
              key: "fries",
              href: "/papaspage",
              label: "Papas Fritas",
              description: "Gestión de Papas Fritas",
              icon: <CiFries className={iconClasses} />,
            },
            {
              key: "elements",
              href: "/ElementPage",
              label: "Elementos",
              description: "Gestión de Ingredientes",
              icon: <PiBreadThin className={iconClasses} />,
            },
            {
              key: "drinks",
              href: "/DrinksPage",
              label: "Bebidas",
              description: "Gestión de Bebidas",
              icon: <PiBeerBottleThin className={iconClasses} />,
            },
            {
              key: "stock",
              href: "/StockPage",
              label: "Stock",
              description: "Control de inventario",
              icon: <PiBoxArrowDownThin className={iconClasses} />,
            },
            {
              key: "pedidos",
              href: "/#",
              label: "Pedidos",
              description: "Administración de pedidos",
              icon: <PiNotepadThin className={iconClasses} />,
            },
            {
              key: "finanzas",
              href: "/#",
              label: "Finanzas",
              description: "Control financiero",
              icon: <PiMathOperationsThin className={iconClasses} />,
            },
            {
              key: "delivery",
              href: "/#",
              label: "Delivery",
              description: "Gestión de Costos",
              icon: <CiDeliveryTruck className={iconClasses} />,
            },
          ].map(({ key, href, label, description, icon }) => (
            <ListboxItem
            key={key}
            href={href}
            startContent={icon}
            description={collapsed ? "" : description} // Oculta la descripción si está colapsado
            className={cn(
              "flex w-full transition-all duration-300",
              location.pathname === href ? "bg-gray-200" : "",
              collapsed ? "p-1 justify-center" : " p-3"
            )}
          >
            {!collapsed && label}
          </ListboxItem>
          ))}

        </Listbox>
        <Listbox >
        <ListboxItem
         
          key="logout"
          
          color="danger"
          startContent={
            <CiLogout className={cn(iconClasses )} />
          }
          className={cn(
            "text-danger flex items-center transition-all duration-300",
            
            collapsed ? "justify-center p-1" : "p-3"
          )}
        >
          {!collapsed && "Cerrar Sesión"}
        </ListboxItem>
        </Listbox>
        
      </nav>
    
      
    </div>
  );
}


