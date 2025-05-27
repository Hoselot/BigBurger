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

export default function EditElemento({ elementoId }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [elemento, setElemento] = useState({ id: elementoId, name: "", price: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setError(err.message);
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
  const handleSave = async (onClose) => {
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
      const response = await fetch(
        `${URLBASE}/elemento/actualizarElemento?idElemento=${elemento.id}`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(elemento),
          credentials: "include"
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar el elemento");
      }
      const updatedElemento = await response.json();
      setElemento(updatedElemento);
      onClose();
      window.location.reload();
    } catch (err) {
      setError(err.message);
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
                        value={elemento.price}
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
