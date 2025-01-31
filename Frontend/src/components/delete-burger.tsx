import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { AiOutlineDelete } from "react-icons/ai";
import { useState } from "react";
import { URLBASE , getToken} from "../utils/VariablesAndMethods";

export default function App({ burgerId }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const eliminarHamburguesa = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${URLBASE}/burger/eliminarHamburguesa?id=${burgerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Si usas token JWT para autorización
        },
      });
      if (response.ok) {
        // Aquí puedes manejar lo que sucede cuando la eliminación es exitosa
        console.log("Hamburguesa eliminada");
      } else {
        // Manejo de error
        console.error("Hubo un problema al eliminar la hamburguesa");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    } finally {
      setLoading(false);
      onOpenChange(false); // Cierra el modal
    }
  };

  return (
    <>
      <Button
        isIconOnly
        color="danger"
        variant="light"
        onPress={onOpen}
      >
        <AiOutlineDelete />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Eliminar Hamburguesa
              </ModalHeader>
              <ModalBody>
                <p>¿Estás seguro de querer eliminar esta hamburguesa?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  onPress={eliminarHamburguesa}
                  isLoading={loading} // Muestra un spinner mientras se elimina
                >
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
