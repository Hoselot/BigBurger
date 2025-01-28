"use client"
import Image from "./logo";

import { cn } from "../utils/utils"
import { CiLogout } from "react-icons/ci";
import { PiCaretLineLeftThin, PiHamburgerThin, PiNotepadThin,PiBreadThin, PiBoxArrowDownThin, PiMathOperationsThin } from "react-icons/pi";

import { Button } from "@heroui/button"
import { Link } from "@heroui/link"

interface NavItem {
  title: string
  icon: React.ElementType
  badge?: string
  href: string
}

const mainNav: NavItem[] = [
  { title: "Hamburguesas", icon: PiHamburgerThin, href: "BurgerPage" },
  { title: "Elementos", icon: PiBreadThin, href: "ElementPage" },
  { title: "Stock", icon: PiBoxArrowDownThin, href: "#" },
  { title: "Pedidos", icon: PiNotepadThin, badge: "20+", href: "#" },
  { title: "Finanzas", icon: PiMathOperationsThin, href: "#" },
  
]

export function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <div
      className={cn(
        'fixed z-10 left-0 top-0 h-screen flex flex-col border-r bg-white transition-all duration-300',
        collapsed ? 'w-[90px]' : 'w-[240px]'
      )}
    >
      <div className="flex h-14 items-center border-b border-navy-700 px-3">
        <div className={cn('flex items-center gap-2', collapsed ? 'justify-center' : 'justify-between')}>
          {!collapsed && (
            <div>
              <Link href="/">
                <Image />
              </Link>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-2"
            onClick={() => setCollapsed(!collapsed)}
          >
            <PiCaretLineLeftThin
              className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
            />
          </Button>
        </div>
      </div>

      <nav className="space-y-1">
        {mainNav.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-navy-100 transition-colors hover:bg-navy-800',
              !collapsed ? 'justify-start' : 'justify-center'
            )}
          >
            <item.icon className="h-7 w-7 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <span className="rounded-full bg-navy-700 px-2 text-xs">{item.badge}</span>
                )}
              </>
            )}
          </a>
        ))}
      </nav>

      <div className="border-t border-navy-700 p-3">
        <div
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-navy-100',
            !collapsed ? 'justify-start' : 'justify-center'
          )}
        >
          
          <Button
  className={`flex items-center ${collapsed ? "justify-center" : "flex-1"}`}
  color="danger"
  startContent={<CiLogout className="h-6 w-6 shrink-0"/>}
  variant="ghost"
  size="sm"
            
>
  {!collapsed && <span>Cerrar Sesión</span>}
</Button>
        </div>
      </div>
    </div>
  );
}


