import { useEffect, useState } from "react";
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
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";

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
      setBurger({ ...burger, costo: totalCost });
    }
  }, [burgerElements]);

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
      setBurger({ ...burger, [field]: value });
    }
  };

  // Manejador para cambios en el archivo (foto)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewFile(e.target.files[0]);
    }
  };

  // Manejador para actualizar la cantidad y el precio unitario de un elemento
  const handleBurgerElementChange = (id: number, field: "cantidad", value: number) => {
    // Si el valor es menor a 1 o no es un número, lo forzamos a 1
    if (isNaN(value) || value < 1) {
      value = 1;
    }
    setBurgerElements((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          const updated = { ...el, cantidad: value };
          // Aseguramos que priceUnit tenga un valor numérico
          updated.price = updated.cantidad * (updated.priceUnit ?? 0);
          return updated;
        }
        return el;
      })
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
      formData.append("file", newFile);
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
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
                    <Input
                      label="Nombre"
                      name="name"
                      type="text"
                      value={burger.name}
                      onChange={(e) => handleBurgerChange("name", e.target.value)}
                    />
                  </ModalHeader>
                  <ModalBody>
                    <div className="flex">
                      <div className="flex flex-col">
                        <img className="w-80" src={burger.pictureUrl} alt={burger.name} />
                        <input type="file" onChange={handleFileChange} />
                        <Button isIconOnly color="default" variant="light">

                        </Button>
                      </div>
                      <div className="ml-12">
                        <Textarea
                          name="description"
                          className="w-full"
                          label="Descripción"
                          placeholder="Describe tu nueva Hamburguesa"
                          value={burger.description}
                          onChange={(e) => handleBurgerChange("description", e.target.value)}
                        />
                        <Input
                          label="Ganancia"
                          name="ganancia"
                          type="number"
                          value={burger.ganancia}
                          onChange={(e) =>
                            handleBurgerChange("ganancia", parseFloat(e.target.value))
                          }
                        />
                      </div>
                    </div>
                    <div className="flex">
                      <h1>Ingredientes</h1>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly variant="bordered">
                            <PiPlusBold />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Lista de elementos"
                          className="max-h-60 overflow-y-auto"
                          style={{ maxHeight: "240px", overflowY: "auto" }}
                        >
                          {loading ? (
                            <DropdownItem key="loading" disabled>
                              Cargando...
                            </DropdownItem>
                          ) : error ? (
                            <DropdownItem key="error" disabled>
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
                            <DropdownItem key="empty" disabled>
                              No hay elementos disponibles.
                            </DropdownItem>
                          )}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <Table aria-label="Elementos de la hamburguesa">
                      <TableHeader>
                        <TableColumn>Elemento</TableColumn>
                        <TableColumn>Cantidad</TableColumn>
                        <TableColumn>Precio Total</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {burgerElements.map((elemento) => (
                          <TableRow key={elemento.id}>
                            <TableCell>{elemento.name}</TableCell>
                            <TableCell>
                              <Input
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
                              />
                            </TableCell>
                            <TableCell>${elemento.price.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <h1>Costo: ${totalCost.toFixed(2)}</h1>
                    <div className="flex">
                      <h1>Ganancia: ${burger.ganancia}</h1>
                    </div>
                    <h1>Precio: ${burger.price}</h1>
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
