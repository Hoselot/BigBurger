import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { PiPencilSimpleLine } from "react-icons/pi";
import { URLBASE, getToken } from "../utils/VariablesAndMethods";
type Props ={
elementoId: string | number;
}
export default function EditElemento({ elementoId }:Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [elemento, setElemento] = useState({ id: elementoId, name: "", price: 0 });
  const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

// Se carga el elemento al abrir el modal
const fetchElemento = async () => {
  setLoading(true);
  setError(null);
  const token = getToken();
  try {
    const response = await fetch(`${URLBASE}/elemento/traerUnElemento?id=${elementoId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error("Error al obtener el elemento");
    }
    const data = await response.json();
    setElemento(data);
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Ocurrió un error desconocido");
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  if (isOpen) {
    fetchElemento();
  }
}, [isOpen]);
  // Función para guardar los cambios
 // Tipar onClose correctamente
const handleSave = async (onClose: () => void) => {
  if (!elemento) return;

  if (!elemento.name || elemento.name.trim() === "") {
    setError("El nombre no puede estar vacío");
    return;
  }
  if (elemento.price < 0) {
    setError("El precio no puede ser negativo");
    return;
  }

    
 const token = getToken();
  try {
    const response = await fetch(`${URLBASE}/elemento/editarElemento`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(elemento),
    });

    if (!response.ok) {
      throw new Error("Error al guardar los cambios");
    }

    onClose();
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Ocurrió un error desconocido");
    }
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
                  <p>Error: {error}</p>
                </ModalBody>
              ) : (
                <>
                  <ModalHeader className="flex gap-1">
                    Editar Elemento <PiPencilSimpleLine />
                  </ModalHeader>
                  <ModalBody>
                    <div className="flex flex-col gap-4">
                      <Input
                        label="Nombre"
                        name="name"
                        type="text"
                        value={elemento.name}
                        onChange={(e) =>
                          setElemento({ ...elemento, name: e.target.value })
                        }
                      />
                      
                      <Input
                        label="Precio"
                        name="price"
                        type="number"
                        value={String(elemento.price)}
                        onChange={(e) =>
                          setElemento({
                            ...elemento,
                            price: parseFloat(e.target.value),
                          })
                        }
                      />
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
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
