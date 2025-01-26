import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";

export default function App() {
  const [burgers, setBurgers] = useState<
    { id: number; name: string; price: number; pictureUrl: string }[]
  >([]);

  useEffect(() => {
    const fetchBurgers = async () => {
      try {
        const response = await fetch("http://localhost:8080/burger/listarHamburguesas");
        if (!response.ok) {
          throw new Error("Error al obtener las hamburguesas.");
        }
        const data = await response.json();
        setBurgers(data);
      } catch (error) {
        console.error(error);
        alert("No se pudieron cargar las hamburguesas.");
      }
    };

    fetchBurgers();
  }, []);

  return (
    <div className="gap-10 grid grid-cols-2 sm:grid-cols-5">
      {burgers.map((burger) => (
        <Card
          key={burger.id}
          className="box-border bg-[rgb(255,255,255)] border-2 border-white shadow-[12px_17px_51px_rgba(0,0,0,0.22)] backdrop-blur-[6px] rounded-[17px] text-center cursor-pointer transition-all duration-500 flex items-center justify-center select-none font-bold text-black hover:border-black hover:scale-105 active:scale-95 active:rotate-[1.7deg]"
          isPressable
          onPress={() => console.log(`Hamburguesa seleccionada: ${burger.name}`)}
        >
          <CardBody className="overflow-hidden p-0">
            <Image
              alt={burger.name}
              className="w-full object-cover h-[100px] sm:h-[250px] rounded-none"
              src={burger.pictureUrl || "https://via.placeholder.com/150"}
              width="100%"
            />
          </CardBody>
          <CardFooter className="text-small justify-between">
            <b>{burger.name}</b>
            <p className="text-default-500">${burger.price.toFixed(2)}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
