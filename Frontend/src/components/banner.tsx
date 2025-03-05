import { title, subtitle } from "@/components/primitives";
import { motion } from "framer-motion";

import CircularCarousel from "./carrusel"

const carouselImages = [
  {
    src: "https://static.vecteezy.com/system/resources/previews/029/334/329/original/burger-transparent-background-png.png",
    alt: "Burger 1",
  },
  {
    src: "https://static.vecteezy.com/system/resources/previews/029/334/329/original/burger-transparent-background-png.png",
    alt: "Burger 2",
  },
  {
    src: "https://static.vecteezy.com/system/resources/previews/029/334/329/original/burger-transparent-background-png.png",
    alt: "Burger 3",
  },
  {
    src: "https://static.vecteezy.com/system/resources/previews/029/334/329/original/burger-transparent-background-png.png",
    alt: "Burger 4",
  },
  {
    src: "https://static.vecteezy.com/system/resources/previews/029/334/329/original/burger-transparent-background-png.png",
    alt: "Burger 5",
  },
]

const listVariants = {
  hidden: { opacity: 0, y: 75 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
};

export default function App() {
  return (
    <section className="flex flex-col items-center justify-center w-full p-4 overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-6 max-w-7xl mx-auto">
        {/* Izquierda: Título y subtítulo */}
        <div className="flex flex-col justify-center lg:w-2/5 w-full items-center mb-8 lg:mb-0">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            className="inline-block text-center justify-center text-white"
          >
            <motion.ul>
              {["La", " hamburguesa ", "perfecta", "sí", "existe"].map((text, i) => (
                <motion.li key={i} custom={i} variants={listVariants} className="inline-block">
                  <span className={i === 3 ? title({ color: "yellow" }) : title()}>{text}&nbsp;</span>
                </motion.li>
              ))}
            </motion.ul>
            <br />
            <motion.ul>
              {["Cada", "mordida,", "una", "explosión", "de", "sabor"].map((text, i) => (
                <motion.li key={i} custom={i} variants={listVariants} className="inline-block">
                  <span className={i === 3 ? title({ color: "yellow" }) : subtitle()}>{text}&nbsp;</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>

        {/* Derecha: Carrusel */}
        <div className="relative lg:w-3/5 w-full aspect-[4/3] lg:aspect-auto lg:h-[600px] flex items-center justify-center overflow-hidden">
          {/* This wrapper ensures the carousel is properly contained */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <CircularCarousel images={carouselImages} autoplaySpeed={3000} />
          </div>
        </div>
      </div>
    </section>
  );
}