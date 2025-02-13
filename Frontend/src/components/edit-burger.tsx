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

  useEffect(() => {
    if (isOpen) {
      fetchBurger();
    }
  }, [isOpen]);

  const fetchBurger = async () => {
    setLoading(true);
    setError(null);
    
    const token = getToken()

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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
                    {burger.name}
                    <Button isIconOnly color="default" variant="light">
                      <PiPencilSimpleLine />
                    </Button>
                  </ModalHeader>
                  <ModalBody>
                    <div className="flex">
                      <div className="flex">
                        <img className="w-80" src={burger.pictureUrl} alt={burger.name} />
                        <Button isIconOnly color="default" variant="light">
                          <PiPencilSimpleLine />
                        </Button>
                      </div>
                      <div className="ml-12">
                        <div className="flex">
                          <h1>Descripción</h1>
                          <Button isIconOnly color="default" variant="light">
                            <PiPencilSimpleLine />
                          </Button>
                        </div>
                        <p>{burger.description}</p>
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
                        <DropdownMenu aria-label="Static Actions">
                          <DropdownItem key="new">Agregar</DropdownItem>
                          <DropdownItem key="copy">Copiar</DropdownItem>
                          <DropdownItem key="edit">Editar</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <Table aria-label="Example static collection table">
                      <TableHeader>
                        <TableColumn>Elemento</TableColumn>
                        <TableColumn>Cantidad</TableColumn>
                        <TableColumn>Precio</TableColumn>
                      </TableHeader>
                      <TableBody>
                        <TableRow key="1">
                          <TableCell>Ejemplo</TableCell>
                          <TableCell>
                            <Input type="number" defaultValue="1" min="0" />
                          </TableCell>
                          <TableCell>999</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <h1>Costo: ${burger.costo}</h1>
                    <div className="flex">
                      <h1>Ganancia: ${burger.ganancia}</h1>
                      <Button isIconOnly color="default" variant="light">
                        <PiPencilSimpleLine />
                      </Button>
                    </div>
                    <h1>Precio: ${burger.price}</h1>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" variant="light" onPress={onClose}>
                      Cancelar
                    </Button>
                    <Button color="success" onPress={onClose}>
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
