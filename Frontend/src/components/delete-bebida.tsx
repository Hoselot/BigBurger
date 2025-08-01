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
import { useDeleteFetch } from "../utils/VariablesAndMethods";
import { Toaster } from "sonner";
type Props = {
  bebidaId: string | number;
};

export default function App({ bebidaId }:Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { loading, eliminarObjeto } = useDeleteFetch();

  const eliminarBebida = async () => {
    eliminarObjeto(
      "/bebida/eliminarBebida",
      bebidaId, // ID del objeto a eliminar
      "Bebida eliminada exitosamente",
      "Hubo un problema al eliminar la bebida",
      () => window.location.reload() // Recargar la página tras eliminar
    );
  };

  return (
    <>
      <Toaster position="top-center" />

      <Button isIconOnly color="danger" variant="light" onPress={onOpen}>
        <AiOutlineDelete />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Eliminar Bebida
              </ModalHeader>
              <ModalBody>
                <p>¿Estás seguro de querer eliminar esta bebida?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  onPress={eliminarBebida}
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
