import { title, subtitle } from "@/components/primitives";
import { motion } from "framer-motion";

import CircularCarousel from "./carrusel"
import { TbSquareRoundedArrowDownFilled } from "react-icons/tb";
const carouselImages = [
  {
    src: "https://s3-eu-central-1.amazonaws.com/www.burgerking.com.ar.v2/wp-media-folder-bk-argentina/home/ubuntu/preview/menu-app/frontend/apps/marketing-website-wordpress-app/web/app/uploads/sites/5/Stacker-Cuadruple-2.png",
    alt: "Burger 1",
  },
  {
    src: "https://s3-eu-central-1.amazonaws.com/www.burgerking.com.ar.v2/wp-media-folder-bk-argentina/home/ubuntu/preview/menu-app/frontend/apps/marketing-website-wordpress-app/web/app/uploads/sites/5/BBQ-Bacon-XL-doble.png",
    alt: "Burger 2",
  },
  {
    src: "https://s3-eu-central-1.amazonaws.com/www.burgerking.com.ar.v2/wp-media-folder-bk-argentina/home/ubuntu/preview/menu-app/frontend/apps/marketing-website-wordpress-app/web/app/uploads/sites/5/Stacker-Triple-3.png",
    alt: "Burger 3",
  },
  {
    src: "https://s3-eu-central-1.amazonaws.com/www.burgerking.com.ar.v2/wp-media-folder-bk-argentina/home/ubuntu/preview/menu-app/frontend/apps/marketing-website-wordpress-app/web/app/uploads/sites/5/napolitano-MEGA-2.png",
    alt: "Burger 4",
  },
  {
    src: "https://s3-eu-central-1.amazonaws.com/www.burgerking.com.ar.v2/wp-media-folder-bk-argentina/home/ubuntu/preview/menu-app/frontend/apps/marketing-website-wordpress-app/web/app/uploads/sites/5/Whopper-Extreme.png",
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
    <section className="flex flex-col items-center justify-center w-full  overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-6 max-w-7xl mx-auto pb-0 pt-10">
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
                  <span className={ subtitle()}>{text}&nbsp;</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>

        {/* Derecha: Carrusel */}
        <div className="relative lg:w-3/5 w-full aspect-[4/3] sm:aspect-[1/1] h-full  lg:max-h-[400px] flex items-center justify-center overflow-hidden">
          {/* This wrapper ensures the carousel is properly contained */}
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}  className="absolute inset-0 w-full h-full flex items-center justify-center">
            
            

            <CircularCarousel images={carouselImages} autoplaySpeed={3000} />
           
          </motion.div>
        </div>
        
      </div>
      <motion.div  initial={{ y: 0 }}
      animate={{ y: [0, 20, 0] }} // Se mueve de 0 a 10px y regresa
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} // Repite infinito
       className="text-red-500 pb-5">
      <TbSquareRoundedArrowDownFilled className="w-20 h-20 "/>
      </motion.div> 
    </section>
  );
}