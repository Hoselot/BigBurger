import { useLocation } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import Counter from "@/components/counter";
import { Select, SelectItem } from "@heroui/select";
import { useEffect, useState } from "react";
import { URLBASE } from "@/utils/VariablesAndMethods";
import { Toaster, toast } from "sonner";

export default function BurgerPage() {
  const { state } = useLocation();
  // const { id } = useParams();
type Acompanamiento = {
  id: number;
  name: string;
  price: number;
  pictureUrl: string;
};

type Bebida = {
  id: number;
  name: string;
  price: number;
  pictureUrl: string;
};

  const [bebidas, setBebidas] = useState<Bebida[]>([]);
const [papas, setPapas] = useState<Acompanamiento[]>([]);
const [selectedPapas, setSelectedPapas] = useState<Acompanamiento | null>(null);
const [selectedBebida, setSelectedBebida] = useState<Bebida | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
// Nuevo estado para la cantidad
const [cantidad, setCantidad] = useState(1);
  // Asigna el precio base de la hamburguesa
  useEffect(() => {
    if (state?.burger) {
      setTotalPrice(state.burger.price);
    }
  }, [state]);

  // Carga las bebidas y papas desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resBebidas = await fetch(`${URLBASE}/bebida/listarBebida`, {
          credentials: "include"
        });
        if (!resBebidas.ok) throw new Error("Error al obtener bebidas");
        const dataBebidas = await resBebidas.json();
        setBebidas(dataBebidas);
  
        const resPapas = await fetch(`${URLBASE}/papas/listarPapas`, {
          credentials: "include"
        });
        if (!resPapas.ok) throw new Error("Error al obtener papas");
        const dataPapas = await resPapas.json();
        setPapas(dataPapas);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
  
    fetchData();
  }, []);
  

  // Actualiza el precio total cuando se selecciona un acompañamiento o bebida
  useEffect(() => {
    let newPrice = state?.burger?.price || 0;
    if (selectedPapas) newPrice += selectedPapas.price;
    if (selectedBebida) newPrice += selectedBebida.price;
    setTotalPrice(newPrice);
  }, [selectedPapas, selectedBebida, state]);

  if (!state || !state.burger) {
    return <div className="text-center text-red-500">Error: No hay datos de la hamburguesa</div>;
  }

  const { name, pictureUrl, description } = state.burger;

  return (
    
    <DefaultLayout>
        {/* Toaster global para las alertas */}
      <Toaster position="bottom-center" className="z-50" />     

      <section className="flex flex-col items-center justify-center gap-8 px-6 py-10 md:py-16 w-full ">
        
        <div className=" flex justify-center gap-10  ">
          {/* Imagen del Producto y Contador */}
          <div>
            <img
              src={pictureUrl}
              alt={name}
              className="w-100 h-96 object-cover rounded-lg shadow-lg"
            />
            {/* El contador mantiene la cantidad de hamburguesas */}
            
           <Counter basePrice={Number(totalPrice.toFixed(2))} onChange={setCantidad} />
            <div className="flex justify-start w-full">
            <Button
  className="bg-gray-900 text-white w-full"
  onClick={() => {
    if (!name || cantidad <= 0) {
      alert("Debe seleccionar una hamburguesa válida y una cantidad mayor a 0.");
      return;
    }
  
    const nuevoItem = {
      nombreHamburguesa: name,
      nombrePapas: selectedPapas?.name || null,
      nombreBebida: selectedBebida?.name || null,
      cantidad,
      imagen: pictureUrl,
      precioTotal: totalPrice * cantidad,
    };
  type CarritoItem = {
  nombreHamburguesa: string;
  nombrePapas: string | null;
  nombreBebida: string | null;
  cantidad: number;
  imagen: string;
  precioTotal: number;
};
    const carritoStr = localStorage.getItem("carrito");
const carrito: CarritoItem[] = carritoStr ? JSON.parse(carritoStr) : [];
    // Buscamos si ya existe uno igual

const indexExistente = carrito.findIndex(item =>
  item.nombreHamburguesa === nuevoItem.nombreHamburguesa &&
  item.nombrePapas === nuevoItem.nombrePapas &&
  item.nombreBebida === nuevoItem.nombreBebida
);

if (indexExistente !== -1) {
  // Ya existe → sumamos cantidad y actualizamos precio
  carrito[indexExistente].cantidad += nuevoItem.cantidad;
  carrito[indexExistente].precioTotal += nuevoItem.precioTotal;
} else {
  // No existe → lo agregamos normalmente
  carrito.push(nuevoItem);
}
    localStorage.setItem("carrito", JSON.stringify(carrito));
    window.dispatchEvent(new Event("carritoActualizado"));
    toast.success("Producto agregado al carrito");
    
    
  }}
>
  Agregar al Carrito
</Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <h1 className="text-3xl font-bold uppercase text-gray-800">{name}</h1>
            <p className="text-xl text-gray-400">${totalPrice.toFixed(2)}</p>
            <p className="text-gray-600">{description || "Deliciosa hamburguesa con ingredientes frescos."}</p>
            
            {/* Selección de Acompañamiento */}
            <h2 className="font-semibold text-gray-800">Acompañamientos</h2>
            <Select
              classNames={{ base: "max-w-xs", trigger: "min-h-12 py-2" }}
              items={papas}
              placeholder="Seleccione su Acompañamiento"
              selectionMode="single"
              variant="bordered"
              onSelectionChange={(keys) => {
                if (keys === "all") {
                  setSelectedPapas(null);
                } else if (keys.currentKey) {
                  const selectedId = Number(keys.currentKey);
                  const selected = papas.find((p) => p.id === selectedId);
                  setSelectedPapas(selected || null);
                } else {
                  setSelectedPapas(null);
                }
              }}
            >
              {(papa) => (
                <SelectItem key={papa.id} textValue={papa.name}>
                  <div className="flex gap-2 items-center">
                    <img alt={papa.name} className="flex-shrink-0 size-20" src={papa.pictureUrl} />
                    <div className="flex flex-col">
                      <span className="text-small">{papa.name}</span>
                      <span className="text-tiny text-default-400">+ ${papa.price}</span>
                    </div>
                  </div>
                </SelectItem>
              )}
            </Select>

            {/* Selección de Bebida */}
            <h2 className="font-semibold text-gray-800">Bebidas</h2>
            <Select
              classNames={{ base: "max-w-xs", trigger: "min-h-12 py-2" }}
              items={bebidas}
              placeholder="Seleccione su Bebida"
              selectionMode="single"
              variant="bordered"
              onSelectionChange={(keys) => {
                if (keys === "all") {
                  // En selección simple esto no debería pasar, pero por si acaso:
                  setSelectedBebida(null);
                } else if (keys.currentKey) {
                  const selectedId = Number(keys.currentKey);
                  const selected = bebidas.find((b) => b.id === selectedId);
                  setSelectedBebida(selected || null);
                } else {
                  setSelectedBebida(null);
                }
              }}    
            >
              {(bebida) => (
                <SelectItem key={bebida.id} textValue={bebida.name}>
                  <div className="flex gap-2 items-center">
                    <img alt={bebida.name} className="flex-shrink-0 size-20" src={bebida.pictureUrl} />
                    <div className="flex flex-col">
                      <span className="text-small">{bebida.name}</span>
                      <span className="text-tiny text-default-400">+ ${bebida.price}</span>
                    </div>
                  </div>
                </SelectItem>
              )}
            </Select>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
