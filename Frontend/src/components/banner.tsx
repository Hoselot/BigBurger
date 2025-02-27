import { title, subtitle } from "@/components/primitives";
import {  motion } from "motion/react"


export default function App() {
  
  return (
    <section className="items-center justify-center w-full">
  <div className="flex sm:flex-row flex-col items-center justify-between w-full h-auto ">
    {/* Izquierda: Título y subtítulo */}
    <div className="flex flex-col justify-center sm:w-1/2 w-full items-center mb-4 sm:mb-0">
      <div className="inline-block max-w-lg text-center justify-center text-white">
        <span className={title()}>La hamburguesa perfecta &nbsp;</span>
        <span className={title({ color: "yellow" })}>sí&nbsp;</span>
        <span className={title()}>existe &nbsp;</span>
        <br />
        <div className={subtitle({ class: "mt-4" })}>
        Cada mordida, una explosión de sabor
        </div>
      </div>
    </div>

    {/* Derecha: Imagen */}
    <div className="relative sm:w-1/2 w-full h-full flex items-center justify-start rounded-2xl ">
  
  {/* Imagen que aparece desde la derecha */}
  <motion.img
    src="https://static.vecteezy.com/system/resources/previews/029/334/329/original/burger-transparent-background-png.png"
    alt="Burger"
    className="relative w-auto h-3/4 object-cover rounded-lg z-10"
    initial={{ x: "100%", opacity: 0 }} // Empieza fuera de la pantalla a la derecha
    animate={{ x: 0, opacity: 1 }} // Se mueve a su posición final
    transition={{ duration: 1, ease: "easeOut" }}
  />

  {/* Fondo animado en círculo con efecto de zoom */}
  <motion.div
    className="absolute right-0 w-8/12 h-full flex justify-center items-center bg-red-700"
    style={{
      // backgroundColor: "#ee5522",
      clipPath: "circle(40%)",
    }}
    initial={{ scale: 0 }} // Empieza pequeño
    animate={{ scale: 1 }} // Crece hasta su tamaño final
    transition={{ duration: 1.2, ease: "easeOut" }}
  />
</div>

    
  </div>
</section>

    
   
    
  );
}