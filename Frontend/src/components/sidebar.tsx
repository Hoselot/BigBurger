"use client";
import { useLocation, useNavigate } from "react-router-dom";
import Image from "./logo";
import {
  CiLogout,
  CiFries,
  CiDeliveryTruck,
} from "react-icons/ci";
import {
  PiBeerBottleThin,
  PiHamburgerThin,
  PiNotepadThin,
  PiBreadThin,
  PiBoxArrowDownThin,
  PiMathOperationsThin,
  PiCaretLeftThin,
} from "react-icons/pi";

const navItems = [
  { key: "burgers", href: "/BurgerPage", label: "Hamburguesas", description: "Gestión de Hamburguesas", icon: <PiHamburgerThin /> },
  { key: "fries", href: "/papaspage", label: "Papas", description: "Gestión de Papas Fritas", icon: <CiFries /> },
  { key: "elements", href: "/ElementPage", label: "Ingredientes", description: "Gestión de Ingredientes", icon: <PiBreadThin /> },
  { key: "drinks", href: "/DrinksPage", label: "Bebidas", description: "Gestión de Bebidas", icon: <PiBeerBottleThin /> },
  { key: "stock", href: "/StockPage", label: "Stock", description: "Control de inventario", icon: <PiBoxArrowDownThin /> },
  { key: "pedidos", href: "/#", label: "Pedidos", description: "Administración de pedidos", icon: <PiNotepadThin /> },
  { key: "finanzas", href: "/#", label: "Finanzas", description: "Control financiero", icon: <PiMathOperationsThin /> },
  { key: "delivery", href: "/#", label: "Delivery", description: "Gestión de costos", icon: <CiDeliveryTruck /> },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="fixed z-10 bg-white border-t md:border-r md:border-t-0 w-full bottom-0 md:top-0 md:left-0 md:h-screen md:w-[240px] flex md:flex-col justify-around md:justify-start">
      {/* Logo + botón de volver */}
      <div className="hidden md:flex h-14 items-center justify-between border-b px-4">
        <div>
          <a href="/">
            <Image />
          </a>
        </div>
        <button
          onClick={() => navigate("/")}
          className="text-black hover:text-gray-700 transition"
          aria-label="Volver al inicio"
        >
          <PiCaretLeftThin className="text-2xl" />
        </button>
      </div>

      <ul className="flex w-full md:flex-col">
        {navItems.map(({ key, href, label, description, icon }) => {
          const isActive = location.pathname === href;
          return (
            <li key={key} className="flex-1 md:flex-none">
              <a
                href={href}
                className={`flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-1 p-2 md:p-4 text-center md:text-left transition ${
                  isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
                }`}
              >
                <span className="text-2xl text-black">{icon}</span>
                <div className="hidden md:flex flex-col text-black">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-xs text-gray-500">{description}</span>
                </div>
              </a>
            </li>
          );
        })}

        {/* Logout */}
        <li className="flex-1 md:flex-none">
          <a
            href="#"
            className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 p-2 md:p-4 text-danger hover:bg-red-50 transition"
          >
            <CiLogout className="text-2xl" />
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-medium">Cerrar Sesión</span>
              <span className="text-xs text-gray-500">Salir del sistema</span>
            </div>
          </a>
        </li>
      </ul>
    </aside>
  );
}
