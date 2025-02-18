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
import {useDeleteFetch} from "../utils/VariablesAndMethods";

export default function App({ elementoId }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { loading, error, eliminarObjeto } = useDeleteFetch();

  const eliminarElemento = async () => {
    eliminarObjeto(
   "/elemento/eliminarElemento",
   elementoId, // ID del objeto a eliminar
   "Elemento eliminado exitosamente",
   "Hubo un problema al eliminar el elemento",
   () => window.location.reload() // Recargar la página tras eliminar
 );
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
                <p>¿Estás seguro de querer eliminar este elemento?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  onPress={eliminarElemento}
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
