import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { useNavigate } from "react-router-dom";
import { URLBASE, useFindListFetchNoAuth} from "../utils/VariablesAndMethods";

export default function App() {
  const navigate = useNavigate();
  const { loading, error, encontrarListaObjetos } = useFindListFetchNoAuth<{
    id: number;
    name: string;
    price: number;
    pictureUrl: string;
  }>();
  
  const [burgers, setBurgers] = useState<
    { id: number; name: string; price: number; pictureUrl: string }[]
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
  

  return (
    <div className="gap-10 grid grid-cols-2 sm:grid-cols-5 px-40">
      {burgers.map((burger) => (
        <Card
          key={burger.id}
          className="box-border bg-white border-2 border-white shadow-[12px_17px_51px_rgba(0,0,0,0.22)] backdrop-blur-[6px] rounded-[17px] text-center cursor-pointer transition-all duration-500 flex items-center justify-center select-none font-bold text-black hover:border-black hover:scale-105 active:scale-95 active:rotate-[1.7deg]"
          isPressable
          // onPress={() => console.log(`Hamburguesa seleccionada: ${burger.name}`)}
          onPress={() => navigate(`/IndividualBurgerPage/${burger.id}`, { state: { burger } })}
        >
          <CardBody className="overflow-hidden p-0 bg-white ">
            <Image
              alt={burger.name}
              className="w-full object-cover h-[100px] sm:h-[250px] rounded-none bg-white"
              src={burger.pictureUrl}
              width="100%"
            />
          </CardBody>
          <CardFooter className="text-small justify-between">
            <b>{burger.name}</b>
            <p className="text-default-500 ">${burger.price.toFixed(2)}</p>
          </CardFooter>
          
        </Card>
      ))}
    </div>
  );
}
