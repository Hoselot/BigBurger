import { useLocation, useParams } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import {Button} from "@heroui/button";
import Map from "@/components/LocationPicker"
import Counter from "@/components/counter"
export default function BurgerPage() {
  const { state } = useLocation();
  const { id } = useParams();

  if (!state || !state.burger) {
    return <div className="text-center text-red-500">Error: No hay datos de la hamburguesa</div>;
  }

  const { name, price, pictureUrl, description } = state.burger;

  return (
    <DefaultLayout>
      <section className="flex flex-col  items-center justify-center gap-8 px-6 py-10 md:py-16 w-full">        
        <div className="w-full flex justify-center gap-10"> 
          {/* Imagen del Producto */}     
          <div>
            <img
              src={pictureUrl}
              alt={name}
              className="w-100 h-96 object-cover rounded-lg shadow-lg"
            />
           <Counter basePrice={price.toFixed(2)} />
          </div>
          
          <div className="flex flex-col gap-3 w-full">
            <h1 className="text-3xl font-bold uppercase text-gray-800">{name}</h1>
            <p className="text-xl text-gray-400">${price.toFixed(2)}</p>
            {/* Detalles del Producto */}
            <p className="text-gray-600">{description || "Deliciosa hamburguesa con ingredientes frescos."}</p>
            {/* Botón de Compra */}
            
          </div>
          
        </div>
        <div className="flex justify-start border-1 w-full">
        
        <Button className="" color="primary">Button</Button>
        </div>
      </section>
        {/* <Map/> */}
    </DefaultLayout>
  );
}