import {Image} from "@heroui/image";
import Logo from "../assets/Logo2.png";
import "../styles/globals.css";
export default function App() {
  return (
    <div className="flex items-center justify-center gap-1">
        <Image
        alt="BigBurger"
        src={Logo}
        width={150}
        />
         <p className="Logo-font">Big Burger</p>
    </div>
   
    
  );
}