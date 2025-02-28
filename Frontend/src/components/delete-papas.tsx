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
import {useDeleteFetch} from "../utils/VariablesAndMethods";
import { Toaster } from "sonner";

export default function App({ papasId }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { loading, error, eliminarObjeto } = useDeleteFetch();

  const eliminarPapas = async () => {
       eliminarObjeto(
      "/papas/eliminarPapas",
      papasId, // ID del objeto a eliminar
      "Papas eliminadas exitosamente",
      "Hubo un problema al eliminar las Papas",
      () => window.location.reload() // Recargar la página tras eliminar
    );
  };

  return (
    <>
      <Toaster position="top-center" />
     
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
                Eliminar Papas
              </ModalHeader>
              <ModalBody>
                <p>¿Estás seguro de querer eliminar estas papas?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  onPress={eliminarPapas}
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
