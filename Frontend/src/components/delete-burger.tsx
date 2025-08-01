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
type Props = {
  burgerId: string | number;
};
export default function App({ burgerId }:Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { loading, eliminarObjeto } = useDeleteFetch();

  const eliminarHamburguesa = async () => {
       eliminarObjeto(
      "/burger/eliminarHamburguesa",
      burgerId, // ID del objeto a eliminar
      "Hamburguesa eliminada exitosamente",
      "Hubo un problema al eliminar la hamburguesa",
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
