import { title, subtitle } from "@/components/primitives";
import { motion } from "framer-motion";
import CircularCarousel from "./carrusel";
import { TbSquareRoundedArrowDownFilled } from "react-icons/tb";

const carouselImages = [
  {src: "https://s3-eu-central-1.amazonaws.com/www.burgerking.com.ar.v2/wp-media-folder-bk-argentina/home/ubuntu/preview/menu-app/frontend/apps/marketing-website-wordpress-app/web/app/uploads/sites/5/Stacker-Cuadruple-2.png", alt: "Burger 1",},
  {src: "https://s3-eu-central-1.amazonaws.com/www.burgerking.com.ar.v2/wp-media-folder-bk-argentina/home/ubuntu/preview/menu-app/frontend/apps/marketing-website-wordpress-app/web/app/uploads/sites/5/BBQ-Bacon-XL-doble.png",alt: "Burger 2",},
  {src: "https://s3-eu-central-1.amazonaws.com/www.burgerking.com.ar.v2/wp-media-folder-bk-argentina/home/ubuntu/preview/menu-app/frontend/apps/marketing-website-wordpress-app/web/app/uploads/sites/5/Stacker-Triple-3.png",alt: "Burger 3",},
  {src: "https://s3-eu-central-1.amazonaws.com/www.burgerking.com.ar.v2/wp-media-folder-bk-argentina/home/ubuntu/preview/menu-app/frontend/apps/marketing-website-wordpress-app/web/app/uploads/sites/5/napolitano-MEGA-2.png",alt: "Burger 4",},
  {src: "https://s3-eu-central-1.amazonaws.com/www.burgerking.com.ar.v2/wp-media-folder-bk-argentina/home/ubuntu/preview/menu-app/frontend/apps/marketing-website-wordpress-app/web/app/uploads/sites/5/Whopper-Extreme.png",alt: "Burger 5",},
];

export default function App() {
  return (
    <section className="flex flex-col items-center justify-center w-full overflow-hidden pb-12">
      <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-6 max-w-7xl mx-auto pt-10">
        
        {/* Texto izquierdo */}
        <div className="flex flex-col justify-center lg:w-2/5 w-full items-center mb-8 lg:mb-0 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className={title()}>La </span>
              <span className={title({ color: "yellow" })}>hamburguesa perfecta</span>
              <span className={title()}> sí existe</span>
            </h1>
            <p className={`${subtitle()} mt-4`}>
              Cada mordida, una explosión de sabor
            </p>
          </motion.div>
        </div>

        {/* Carrusel derecho */}
        <div className="relative w-full lg:w-3/5 aspect-[4/3] sm:aspect-[1/1] max-h-[400px] flex items-center justify-center overflow-hidden pb-12">
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            <CircularCarousel
              images={carouselImages.map((img) => ({
                ...img,
                loading: "lazy", // Mejora el rendimiento
              }))}
              autoplaySpeed={3000}
            />
          </motion.div>
        </div>
      </div>

      {/* Flecha animada */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        className="text-red-500 pb-5"
      >
        <TbSquareRoundedArrowDownFilled className="w-16 h-16 sm:w-20 sm:h-20" />
      </motion.div>
    </section>
  );
}
