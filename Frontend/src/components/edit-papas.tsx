import { useEffect, useState, useMemo } from "react";
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

interface PapasElemento {
  elementoModel: Elemento;
}

interface ProcessedElemento {
  id: number;
  name: string;
  priceUnit: number;
  price: number;
  cantidad: number;
}

interface Papas {
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
  papasId: number;
}

export default function EditModal({ papasId }: EditModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [papas, setPapas] = useState<Papas | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [elementos, setElementos] = useState<Elemento[]>([]);
  const [papasElements, setPapasElements] = useState<ProcessedElemento[]>([]);
  const [initialPapasElements, setInitialPapasElements] = useState<ProcessedElemento[]>([]);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;
  const formatCurrency = (value) =>
    new Intl.NumberFormat('us-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(value);
  const pages = Math.ceil(papasElements.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return papasElements.slice(start, end);
  }, [page, papasElements]);

  const totalCost = papasElements.reduce((acc, el) => acc + (el.price ?? 0), 0);

  useEffect(() => {
    if (isOpen) {
      fetchPapas();
      fetchElementos();
      fetchPapasElements();
    }
  }, [isOpen]);

  useEffect(() => {
    if (papasId) {
      fetchPapasElements();
    }
  }, [papasId]);

  useEffect(() => {
    if (papas) {
      const totalCost = papasElements.reduce((acc, el) => acc + el.price, 0);
      setPapas((prevPapas) => {
        if (!prevPapas) return null;

        const updatedCosto = totalCost;
        const updatedPrice = updatedCosto + (prevPapas.ganancia ?? 0);

        return { ...prevPapas, costo: updatedCosto, price: updatedPrice };
      });
    }
  }, [papasElements, papas?.ganancia]);

  const fetchPapasElements = async () => {
    const token = getToken();
    try {
      const response = await fetch(`${URLBASE}/papas/listarElementosPapas?idPapas=${papasId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Error al obtener los elementos de las papas.");
      }

      const data: PapasElemento[] = await response.json();

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
      setPapasElements(processed);
      setInitialPapasElements(JSON.parse(JSON.stringify(processed)));
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
        credentials: "include"
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

  const fetchPapas = async () => {
    setLoading(true);
    setError(null);
    const token = getToken();
    try {
      const response = await fetch(`${URLBASE}/papas/listarUnaPapasADMIN?id=${papasId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Error al obtener los datos de las papas.");
      }

      const data = await response.json();
      setPapas(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePapasChange = (field: string, value: any) => {
    if (papas) {
      setPapas((prevPapas) => {
        if (!prevPapas) return null;

        const updatedPapas = { ...prevPapas, [field]: value };

        if (field === "ganancia") {
          updatedPapas.price = prevPapas.costo + Number(value);
        }

        return updatedPapas;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setNewFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePapasElementChange = (id: number, field: "cantidad", value: number) => {
    setPapasElements((prev) =>
      prev
        .map((el) => {
          if (el.id === id) {
            const updated = { ...el, cantidad: value };
            updated.price = updated.cantidad * (updated.priceUnit ?? 0);
            return updated;
          }
          return el;
        })
        .filter((el) => el.cantidad > 0)
    );
  };

  const computeElementosDifferences = () => {
    let elementosAgregados: { id: number; cantidad: number }[] = [];
    let elementosEliminados: { id: number; cantidad: number }[] = [];

    const initialMap = new Map<number, number>();
    initialPapasElements.forEach((el) => {
      initialMap.set(el.id, el.cantidad);
    });

    const updatedMap = new Map<number, number>();
    papasElements.forEach((el) => {
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

  const handleSave = async (onClose: () => void) => {
    if (!papas) return;
    const token = getToken();
    const formData = new FormData();

    const papasModelBody = {
      name: papas.name,
      description: papas.description,
      ganancia: papas.ganancia,
    };

    formData.append(
      "papasModelBody",
      new Blob([JSON.stringify(papasModelBody)], { type: "application/json" })
    );

    if (newFile) {
      formData.append("file", newFile);
    }

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
      const response = await fetch(`${URLBASE}/papas/actualizarPapas/${papasId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Error al actualizar las papas.");
      }
      const data = await response.json();
      setPapas(data);
      onClose();
      window.location.reload();
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
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
              ) : papas ? (
                <>
                  <ModalHeader className="flex gap-1">
                    <h1>Editá tus Papas</h1>
                  </ModalHeader>
                  <ModalBody>
                    <div className="flex">
                      <div className="flex flex-col relative">
                        <img
                          className="w-80 h-60 rounded-xl"
                          src={newImageUrl || papas.pictureUrl}
                          alt={papas.name}
                        />
                        <Button
                          className="absolute top-0 right-0 m-2 cursor-pointer"
                          color="warning"
                          variant="solid"
                          size="sm"
                          isIconOnly
                        >
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0"
                          />
                          <PiPencilSimpleLine className="size-5 text-white" />
                        </Button>
                      </div>
                      <div className="ml-5 gap-5 flex flex-col">
                        <Input
                          label="Nombre"
                          name="name"
                          type="text"
                          value={papas.name}
                          onChange={(e) => handlePapasChange("name", e.target.value)}
                        />
                        <Textarea
                          name="description"
                          className="w-full"
                          label="Descripción"
                          placeholder="Describe tus nuevas Papas"
                          value={papas.description}
                          onChange={(e) => handlePapasChange("description", e.target.value)}
                        />
                        <div className="flex items-center mb-0">
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
                                      const found = papasElements.find((el) => el.id === elemento.id);
                                      if (found) {
                                        handlePapasElementChange(elemento.id, "cantidad", found.cantidad + 1);
                                      } else {
                                        setPapasElements((prev) => [
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
                    <Table
                      aria-label="Elementos de las papas"
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
                      }
                    >
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
                                  onPress={() => handlePapasElementChange(elemento.id, "cantidad", elemento.cantidad - 1)}
                                >
                                  <PiMinus className="size-4" />
                                </Button>
                                <span className="mx-2">{elemento.cantidad}</span>
                                <Button
                                  radius="lg"
                                  size="sm"
                                  isIconOnly
                                  onPress={() => handlePapasElementChange(elemento.id, "cantidad", Math.min(10, elemento.cantidad + 1))}
                                >
                                  <PiPlus className="size-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>${elemento.price.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="flex items-center justify-between">
                      <div className="flex">
                        <Input
                          label="Ganancia"
                          name="ganancia"
                          type="text"
                          value={`$ ${papas.ganancia.toLocaleString("en-US")}`}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/[^0-9]/g, "");
                            let numericValue = parseFloat(rawValue) || 0;
                            numericValue = Math.max(0, Math.min(20000, numericValue));
                            handlePapasChange("ganancia", numericValue);
                          }}
                        />
                      </div>
                      <h1>Costo: ${formatCurrency(papas?.costo)}</h1>
                    </div>
                    <div className="flex justify-center">
                      <p>Precio: ${formatCurrency(papas?.price)}</p>
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
                  <p>No se encontraron datos de las papas.</p>
                </ModalBody>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}