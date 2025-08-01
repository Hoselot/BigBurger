
import { useEffect, useState } from "react";
import { Card, CardBody,CardFooter  } from "@heroui/card";

import {  Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import {  useFindListFetchNoAuth} from "../utils/VariablesAndMethods";
import  NoPhoto  from "../assets/nophoto.png";

export default function App() {
    const navigate = useNavigate();
  const {  encontrarListaObjetos } = useFindListFetchNoAuth<{
    id: number;
    name: string;
    price: number;
    pictureUrl: string;
    description : string;
  }>();
  
  const [burgers, setBurgers] = useState<
    { id: number; name: string; price: number; pictureUrl: string, description : string }[]
  >([]);
  
  useEffect(() => {
    const fetchBurgers = async () => {
      const result = await encontrarListaObjetos(
        "/burger/listarHamburguesas",
        "Hamburguesas cargadas correctamente",
        "Error al obtener las hamburguesas."
      );
      if (result) {
        setBurgers(result);
      }
    };
  
    fetchBurgers();
  }, []);
  const rating = 3;
  return (
    <div className="grid gap-6 p-4 sm:p-6 md:p-10 lg:px-20 xl:px-40 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {burgers.map((burger) => (
      <Card key={burger.id} className="w-full max-w-xs transition-all duration-500 ease-in-out hover:scale-105 border-2 border-white hover:border-black rounded-[35px] overflow-hidden group">
        <CardBody className="flex flex-col gap-3 p-2">
          {/* Profile Image */}
          <div className="rounded-[30px] overflow-hidden">
            <img 
              src={burger.pictureUrl || NoPhoto}
              alt={burger.name}
              className="w-full aspect-square object-cover"
              width="100%"
            />
          </div>
          
          <div className="flex flex-col gap-2 text-left p-0 ">
            {/* Name without Verification Badge */}
            <CardFooter className="justify-between">
            <h2 className="text-xl font-semibold text-gray-800">{burger.name}</h2>
            <p className="text-xl">${burger.price.toFixed(2)}</p>
            </CardFooter>
            
            {/* Hidden content that appears on hover */}
            <div className="absolute top-0 left-0 w-full h-full bg-white/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-4 transition-all duration-300 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 z-10 rounded-[30px]">
               <h2 className="text-2xl font-semibold text-gray-800">{burger.name}</h2>
              {/* Description */}
              <p
                className="text-gray-500 text-sm relative line-clamp-3 break-words leading-relaxed text-left w-full after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-full after:h-6 after:bg-transparent"
                dir="ltr"
                >
                {burger.description}
                </p>
               {/* Stats and Follow Button */}
              
<div className="flex items-center justify-center gap-4">
  <div className="flex items-center gap-1 text-grey-400">
    {[...Array(5)].map((_, i) => (
      <Icon
        key={i}
        icon={i < rating ? "lucide:star" : "lucide:star-off"}
        width={18}
      />
      
    ))}
    <span className="text-gray-700 font-medium">312</span>
                
  </div>
</div>
              <Button 
                color="default" 
                variant="solid" 
                radius="full"
                className="bg-gray-100 text-gray-800 w-full hover:bg-gray-900 hover:text-white"
                endContent={<Icon icon="lucide:plus" className="w-4 h-4" />}
                onPress={() => navigate(`/IndividualBurgerPage/${burger.id}`, { state: { burger } })}
              >
                Ver Más
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
      ))}
    </div>
  );
}