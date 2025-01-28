
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    
    useDisclosure,
  } from "@heroui/modal";

  
  import {Button} from "@heroui/button"

  import {  PiPencilSimpleLine  } from "react-icons/pi";
  export default function App() {
      const {isOpen, onOpen, onOpenChange} = useDisclosure();
      return (
          <>
            <Button isIconOnly color="default" variant="light" onPress={onOpen}><PiPencilSimpleLine/></Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex gap-1">Elemento <Button isIconOnly color="default" variant="light"><PiPencilSimpleLine/></Button></ModalHeader>
                    <ModalBody>
                      <div className="flex">
                        <h1>Precio: $99990</h1>
                        <Button isIconOnly color="default" variant="light"><PiPencilSimpleLine/></Button>

                      </div>
                        
                        
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
                )}
              </ModalContent>
            </Modal>
          </>
        );
      }
      