import { useEffect, useState, useMemo  } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Input } from "@heroui/input";
import { URLBASE, getToken } from "../utils/VariablesAndMethods";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { PiPlusBold, PiPencilSimpleLine } from "react-icons/pi";
import { PiPlus, PiMinus } from "react-icons/pi";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
interface Elemento {
  id: number;
  name: string;
  price: number;
}

interface BurgerElemento {
  elementoModel: Elemento;
}

interface ProcessedElemento {
  id: number;
  name: string;
  priceUnit: number;
  price: number;
  cantidad: number;
}

interface Burger {
  id: number;
  name: string;
  pictureUrl: string;
  description: string;
  ingredients: string[];
  price: number;
  costo: number;
  ganancia: number;
}

interface EditModalProps {
  burgerId: number;
}

export default function EditModal({ burgerId }: EditModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [burger, setBurger] = useState<Burger | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [elementos, setElementos] = useState<Elemento[]>([]);
  const [burgerElements, setBurgerElements] = useState<ProcessedElemento[]>([]);
  const [initialBurgerElements, setInitialBurgerElements] = useState<ProcessedElemento[]>([]);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;
  const formatCurrency = (value) => 
    new Intl.NumberFormat('us-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2, 
      useGrouping: true 
    }).format(value);
  const pages = Math.ceil(burgerElements.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return burgerElements.slice(start, end);
  }, [page, burgerElements]);


  const totalCost = burgerElements.reduce((acc, el) => acc + (el.price ?? 0), 0);
  // Al abrir el modal se cargan todos los datos
  useEffect(() => {
    if (isOpen) {
      fetchBurger();
      fetchElementos();
      fetchBurgerElements();
    }
  }, [isOpen]);

  useEffect(() => {
    if (burgerId) {
      fetchBurgerElements();
    }
  }, [burgerId]);

  useEffect(() => {
    if (burger) {
      const totalCost = burgerElements.reduce((acc, el) => acc + el.price, 0);
      setBurger((prevBurger) => {
        if (!prevBurger) return null;
  
        const updatedCosto = totalCost;
        const updatedPrice = updatedCosto + (prevBurger.ganancia ?? 0);
  
        return { ...prevBurger, costo: updatedCosto, price: updatedPrice };
      });
    }
  }, [burgerElements, burger?.ganancia]); // Se ejecuta cuando cambian los elementos o la ganancia
  

  const fetchBurgerElements = async () => {
    const token = getToken();
    try {
      const response = await fetch(`${URLBASE}/burger/listarElementosBurger?idBurger=${burgerId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los elementos de la hamburguesa.");
      }

      const data: BurgerElemento[] = await response.json();

      // Procesar los elementos para eliminar duplicados y contar cantidades
      const elementosMap = new Map<number, ProcessedElemento>();

      data.forEach(({ elementoModel }) => {
        if (elementosMap.has(elementoModel.id)) {
          const existing = elementosMap.get(elementoModel.id)!;
          existing.cantidad += 1;
          existing.price = existing.cantidad * (elementoModel.price ?? 0);
        } else {
          elementosMap.set(elementoModel.id, {
            id: elementoModel.id,
            name: elementoModel.name,
            priceUnit: elementoModel.price ?? 0,
            price: elementoModel.price ?? 0,
            cantidad: 1,
          });
        }
      });


      const processed = Array.from(elementosMap.values());
      setBurgerElements(processed);
      // Clonamos el array para tener una referencia de los elementos iniciales
      setInitialBurgerElements(JSON.parse(JSON.stringify(processed)));
    } catch (err: any) {
      console.error(err);
    }
  };

  const fetchElementos = async () => {
    setLoading(true);
    setError(null);
    const token = getToken();
    try {
      const response = await fetch(`${URLBASE}/elemento/listarElementos`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener los elementos");
      }
      const data = await response.json();
      setElementos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBurger = async () => {
    setLoading(true);
    setError(null);
    const token = getToken();
    try {
      const response = await fetch(`${URLBASE}/burger/listarHamburguesaAuth?id=${burgerId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los datos de la hamburguesa.");
      }

      const data = await response.json();
      setBurger(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejador para actualizar campos de la hamburguesa (nombre, descripción, ganancia)
  const handleBurgerChange = (field: string, value: any) => {
    if (burger) {
      setBurger((prevBurger) => {
        if (!prevBurger) return null;
  
        const updatedBurger = { ...prevBurger, [field]: value };
  
        if (field === "ganancia") {
          updatedBurger.price = prevBurger.costo + Number(value);
        }
  
        return updatedBurger;
      });
    }
  };
  //  Manejador para cambios en el archivo (foto)
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     setNewFile(e.target.files[0]);
  //   }
  // };
// Manejador para cambios en el archivo (foto)
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];
    setNewFile(file);

    // Crear una URL para la vista previa de la imagen
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
};
  // Manejador para actualizar la cantidad y el precio unitario de un elemento
  const handleBurgerElementChange = (id: number, field: "cantidad", value: number) => {
    setBurgerElements((prev) =>
      prev
        .map((el) => {
          if (el.id === id) {
            const updated = { ...el, cantidad: value };
            updated.price = updated.cantidad * (updated.priceUnit ?? 0);
            return updated;
          }
          return el;
        })
        .filter((el) => el.cantidad > 0) // 🔥 Filtra los elementos con cantidad 0
    );
  };
  

  // Calcula las diferencias entre los elementos iniciales y los modificados
  const computeElementosDifferences = () => {
    let elementosAgregados: { id: number; cantidad: number }[] = [];
    let elementosEliminados: { id: number; cantidad: number }[] = [];

    const initialMap = new Map<number, number>();
    initialBurgerElements.forEach((el) => {
      initialMap.set(el.id, el.cantidad);
    });

    const updatedMap = new Map<number, number>();
    burgerElements.forEach((el) => {
      updatedMap.set(el.id, el.cantidad);
    });

    updatedMap.forEach((updatedQty, id) => {
      const initialQty = initialMap.get(id) || 0;
      if (updatedQty > initialQty) {
        elementosAgregados.push({ id, cantidad: updatedQty - initialQty });
      } else if (updatedQty < initialQty) {
        elementosEliminados.push({ id, cantidad: initialQty - updatedQty });
      }
    });

    initialMap.forEach((initialQty, id) => {
      if (!updatedMap.has(id)) {
        elementosEliminados.push({ id, cantidad: initialQty });
      }
    });

    return { elementosAgregados, elementosEliminados };
  };

  // Se ejecuta al presionar "Guardar". Se arma el FormData y se envía el PUT al backend.
  const handleSave = async (onClose: () => void) => {
    if (!burger) return;
    const token = getToken();
    const formData = new FormData();
    
    // Construimos el objeto burgerModelBody con los campos editados
    const burgerModelBody = {
      name: burger.name,
      description: burger.description,
      ganancia: burger.ganancia,
    };

    // Envolvemos el JSON en un Blob para que se envíe como application/json
    formData.append(
      "burgerModelBody",
      new Blob([JSON.stringify(burgerModelBody)], { type: "application/json" })
    );

    // Si se seleccionó un nuevo archivo, lo agregamos
    if (newFile) {
      formData.append("file", newFile); // Agregar el archivo seleccionado
    }

    // Calculamos las diferencias en los elementos
    const { elementosAgregados, elementosEliminados } = computeElementosDifferences();
    formData.append(
      "elementosAgregados",
      new Blob([JSON.stringify(elementosAgregados)], { type: "application/json" })
    );
    formData.append(
      "elementosEliminados",
      new Blob([JSON.stringify(elementosEliminados)], { type: "application/json" })
    );

    try {
      const response = await fetch(`${URLBASE}/burger/actualizarHamburguesa/${burgerId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          // No se especifica Content-Type al usar FormData
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Error al actualizar la hamburguesa.");
      }
      const data = await response.json();
      // Se actualiza el estado con la respuesta (opcional)
      setBurger(data);
      onClose(); // Se cierra el modal al finalizar la operación
      window.location.reload()
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <>
      <Button isIconOnly color="default" variant="light" onPress={onOpen}>
        <PiPencilSimpleLine />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl" >
        <ModalContent>
          {(onClose) => (
            <>
              {loading ? (
                <ModalBody>
                  <p>Cargando...</p>
                </ModalBody>
              ) : error ? (
                <ModalBody>
                  <p>{error}</p>
                </ModalBody>
              ) : burger ? (
                <>
                  <ModalHeader className="flex gap-1">
                    <h1>Editá tu Hamburguesa</h1>
                  </ModalHeader>
                  <ModalBody>
                    <div className="flex">
                    <div className="flex flex-col relative">
                      {/* Imagen con el botón encima */}
                      <img
                        className="w-80 h-60 rounded-xl"
                        src={newImageUrl || burger.pictureUrl}
                        alt={burger.name}
                      />
                      
                      {/* Botón de elegir imagen con el icono */}
                      <Button
                        className="absolute top-0 right-0 m-2 cursor-pointer"
                        color="warning"
                        variant="solid"
                        size="sm"
                        isIconOnly
                        
                      >
                        {/* Input invisible, pero cubre el área del botón */}
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 " // Asegúrate de que cubra todo el botón
                        />
                        <PiPencilSimpleLine className="size-5 text-white" />
                      </Button>
                    </div>
                      
                      <div className="ml-5 gap-5 flex flex-col">
                        <Input
                          label="Nombre"
                          name="name"
                          type="text"
                          value={burger.name}
                          onChange={(e) => handleBurgerChange("name", e.target.value)}
                        />
                        <Textarea
                          name="description"
                          className="w-full"
                          label="Descripción"
                          placeholder="Describe tu nueva Hamburguesa"
                          value={burger.description}
                          onChange={(e) => handleBurgerChange("description", e.target.value)}
                        />
                        
                        <div className="flex  items-center mb-0">
                          <Dropdown>
                            <DropdownTrigger>
                              <Button variant="bordered">
                              <PiPlusBold /> Añadir Elemento
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                              aria-label="Lista de elementos"
                              className="max-h-60 overflow-y-auto"
                              style={{ maxHeight: "240px", overflowY: "auto" }}
                            >
                              {loading ? (
                                <DropdownItem key="loading" isDisabled>
                                  Cargando...
                                </DropdownItem>
                              ) : error ? (
                                <DropdownItem key="error" isDisabled>
                                  Error: {error}
                                </DropdownItem>
                              ) : elementos.length > 0 ? (
                                elementos.map((elemento) => (
                                  <DropdownItem
                                    key={elemento.id}
                                    onPress={() => {
                                      // Si el elemento ya existe, incrementamos la cantidad
                                      const found = burgerElements.find((el) => el.id === elemento.id);
                                      if (found) {
                                        handleBurgerElementChange(elemento.id, "cantidad", found.cantidad + 1);
                                      } else {
                                        setBurgerElements((prev) => [
                                          ...prev,
                                          {
                                            id: elemento.id,
                                            name: elemento.name,
                                            priceUnit: elemento.price,
                                            price: elemento.price,
                                            cantidad: 1,
                                          },
                                        ]);
                                      }
                                    }}
                                  >
                                    {elemento.name}
                                  </DropdownItem>
                                ))
                              ) : (
                                <DropdownItem key="empty" isDisabled>
                                  No hay elementos disponibles.
                                </DropdownItem>
                              )}
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                    
                      
                      
                    
                    <Table aria-label="Elementos de la hamburguesa " 
                      bottomContent={
                        <div className="flex w-full justify-center">
                          <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="default"
                            page={page}
                            total={pages}
                            onChange={setPage}
                          />
                        </div>
                      }>
                      <TableHeader>
                        <TableColumn>Elemento</TableColumn>
                        <TableColumn>Cantidad</TableColumn>
                        <TableColumn>Precio Total</TableColumn>
                      </TableHeader>
                      <TableBody>
                      {items.map((elemento) => (
                          <TableRow key={elemento.id}>
                            <TableCell>{elemento.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                              <Button
                                radius="lg"
                                size="sm"
                                isIconOnly
                                onPress={() => handleBurgerElementChange(elemento.id, "cantidad", elemento.cantidad - 1)} // Permite llegar a 0
                              >
                                <PiMinus className="size-4" />
                              </Button>

                                <span className="mx-2">{elemento.cantidad}</span> {/* Aquí mostramos la cantidad actual */}
                                <Button
                                  radius="lg"
                                  size="sm"
                                  isIconOnly
                                  onPress={() => handleBurgerElementChange(elemento.id, "cantidad", Math.min(10, elemento.cantidad + 1))}
                                >
                                  <PiPlus className="size-4" />
                                </Button>
                              </div>
                              {/* <Input
                                type="number"
                                min={1}
                                value={elemento.cantidad}
                                onChange={(e) =>
                                  handleBurgerElementChange(
                                    elemento.id,
                                    "cantidad",
                                    parseInt(e.target.value)
                                  )
                                }
                              /> */}
                            </TableCell>
                            <TableCell>${elemento.price.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex">
                    
                        {/* <h1>Ganancia: ${burger?.ganancia.toFixed(2)}</h1> */}
                        <Input
                          label="Ganancia"
                          name="ganancia"
                          type="text" // Cambiado a 'text' para formatear con '$'
                          value={`$ ${burger.ganancia.toLocaleString("en-US")}`} // Formatea con símbolo y separadores
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/[^0-9]/g, ""); // Elimina caracteres no numéricos
                            let numericValue = parseFloat(rawValue) || 1; // Asigna 1 si no es un valor válido

                            // Asegúrate de que el valor esté entre 1 y 20,000
                            numericValue = Math.max(1, Math.min(20000, numericValue));

                            handleBurgerChange("ganancia", numericValue); // Actualiza el estado con el nuevo valor
                          }}
                        />
                      </div>
                      <h1>Costo: ${formatCurrency(burger?.costo)}</h1>

                    </div>
                            <div className="flex justify-center">

                    <p>Precio: ${formatCurrency(burger?.price)}</p>
                            </div>
                    
    
    
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" variant="light" onPress={onClose}>
                      Cancelar
                    </Button>
                    <Button color="success" onPress={() => handleSave(onClose)}>
                      Guardar
                    </Button>
                  </ModalFooter>
                </>
              ) : (
                <ModalBody>
                  <p>No se encontraron datos de la hamburguesa.</p>
                </ModalBody>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
