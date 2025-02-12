import { useLocation, useParams } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import {Button} from "@heroui/button";
import {Chip} from "@heroui/chip";
import Counter from "@/components/counter"
import {Accordion, AccordionItem} from "@heroui/accordion";
import {Select,  SelectItem, SelectedItems} from "@heroui/select";
export const users = [
  {
    id: 1,
    name: "Papas Grandes",
    image: "https://d2umxhib5z7frz.cloudfront.net/Argentina/PAPA-GRANDE.png?1603998756129",
    prize: "1 500",
  },
  {
    id: 2,
    name: "Papas Medianas",
    image: "https://d2umxhib5z7frz.cloudfront.net/Argentina/PAPA-GRANDE.png?1603998756129",
    prize: "1 500",
  },
  {
    id: 3,
    name: "Papas Chicas",
    image: "https://d2umxhib5z7frz.cloudfront.net/Argentina/PAPA-GRANDE.png?1603998756129",
    prize: "1 500",
  },
  {
    id: 4,
    name: "Papas Cheddar",
    image: "https://d2umxhib5z7frz.cloudfront.net/Argentina/PAPA-GRANDE.png?1603998756129",
    prize: "1 500",
  },
  {
    id: 5,
    name: "Papas Cheddar Beacon",
    image: "https://d2umxhib5z7frz.cloudfront.net/Argentina/PAPA-GRANDE.png?1603998756129",
    prize: "1 500",
  },

  
];

type User = {
  id: number;
  name: string;
  
  image: string;
  prize: string;
};

export default function BurgerPage() {
  const { state } = useLocation();
  const { id } = useParams();

  if (!state || !state.burger) {
    return <div className="text-center text-red-500">Error: No hay datos de la hamburguesa</div>;
  }

  const { name, price, pictureUrl, description } = state.burger;
  const defaultContent =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
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
           <div className="flex justify-start w-full">
        {/* Botón de Carrito */}
        <Button className="bg-gray-900 text-white w-full">Agregar al Carrito</Button>
        </div>
          </div>
          
          <div className="flex flex-col gap-3 w-full">
            <h1 className="text-3xl font-bold uppercase text-gray-800">{name}</h1>
            <p className="text-xl text-gray-400">${price.toFixed(2)}</p>
            {/* Detalles del Producto */}
            <p className="text-gray-600">{description || "Deliciosa hamburguesa con ingredientes frescos."}</p>
            <div className="flex gap-2">
            <Chip size="md" radius="md" variant="solid" className="bg-gray-900 text-white">Ingrediente</Chip>
            <Chip size="md" radius="md" variant="solid" className="bg-gray-900 text-white">Ingrediente</Chip>
            <Chip size="md" radius="md" variant="solid" className="bg-gray-900 text-white">Ingrediente</Chip>
            <Chip size="md" radius="md" variant="solid" className="bg-gray-900 text-white">Ingrediente</Chip>
            <Chip size="md" radius="md" variant="solid" className="bg-gray-900 text-white">Ingrediente</Chip>
            </div>
            <h2 className="font-semibold  text-gray-800">Personaliza tu Producto</h2>
            <Accordion variant="splitted" selectionMode="multiple">
              <AccordionItem key="1" aria-label="Accordion 1" title="Acompañamiento">
              <Select
                classNames={{
                  base: "max-w-xs",
                  trigger: "min-h-12 py-2",
                }}
                isMultiline={true}
                items={users}
                placeholder="Selecione su Acompañamiento"
                renderValue={(items: SelectedItems<User>) => {
                  return (
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <Chip key={item.key}>{item.data?.name}</Chip>
                      ))}
                    </div>
                  );
                }}
                selectionMode="multiple"
                variant="bordered"
              >
                {(user) => (
                  <SelectItem key={user.id} textValue={user.name}>
                    <div className="flex gap-2 items-center">
                      <img alt={user.name} className="flex-shrink-0 size-20"  src={user.image} />
                      <div className="flex flex-col">
                        <span className="text-small">{user.name}</span>
                        <span className="text-tiny text-default-400">+  ${user.prize}</span>
                      </div>
                    </div>
                  </SelectItem>
                )}
              </Select>
              </AccordionItem>
              <AccordionItem key="2" aria-label="Accordion 2" title="Bebidas">
                {defaultContent}
              </AccordionItem>
              <AccordionItem key="3" aria-label="Accordion 3" title="Personaliza tu Hamburguesa">
                {defaultContent}
              </AccordionItem>
            </Accordion>
          </div>
          
        </div>
        
      </section>
       
    </DefaultLayout>
  );
}