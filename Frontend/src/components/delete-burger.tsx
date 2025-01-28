
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  
  useDisclosure,
} from "@heroui/modal";
import {Button} from "@heroui/button"
import { AiOutlineDelete } from "react-icons/ai";
export default function App() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    return (
        <>
          <Button isIconOnly color="danger" variant="light" onPress={onOpen}><AiOutlineDelete/></Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Eliminar Hamburguesa</ModalHeader>
                    <ModalBody>
                    <p>¿Estas seguro de querer eliminar esta hamburguesa?</p>
                    </ModalBody>
                  <ModalFooter>
                    <Button color="primary" variant="light" onPress={onClose}>
                      Cancelar
                    </Button>
                    <Button color="danger" onPress={onClose}>
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
    