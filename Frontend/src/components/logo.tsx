import {Image} from "@heroui/image";
import Logo from "../assets/Logo2.png";
import "../styles/globals.css";
export default function App() {
  return (
    <div className="flex items-center gap-1">
      {/* Logo con tamaño dinámico según la pantalla */}
      <Image
        alt="BigBurger"
        src={Logo}
        className="h-10 md:h-10 lg:h-15 w-auto" // Cambia el tamaño en diferentes pantallas
      />

      {/* Texto que se oculta en pantallas pequeñas */}
      <p className="hidden md:block text-xl font-bold Logo-font">Logo</p>
    </div>
  );
}