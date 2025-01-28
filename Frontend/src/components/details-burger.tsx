
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    
    useDisclosure,
  } from "@heroui/modal";
  import {Button} from "@heroui/button"
  import { PiEye } from "react-icons/pi";
  export default function App() {
      const {isOpen, onOpen, onOpenChange} = useDisclosure();
      return (
          <>
            <Button isIconOnly color="success" variant="light" onPress={onOpen}><PiEye /></Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">Nombre de la Hamburguesa</ModalHeader>
                      <ModalBody>
                        <img src="https://th.bing.com/th/id/OIP.xpHtN8nOMEDD69KJLoiHDAHaHa?rs=1&pid=ImgDetMain" alt="" />
                        <h1>Descripcion</h1>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur ex unde, inventore animi nam quo eius ratione accusamus neque sapiente, optio ad recusandae quod officiis sequi error deleniti ipsum vero!</p>
                        <h1>Ingredientes</h1>
                        <ul>
                            <li>qweqwe</li>
                            <li>qweqwe</li>
                            <li>qweqwe</li>
                            <li>qweqweqw</li>
                        </ul>
                        <h1>Precio: $99990</h1>
                      </ModalBody>
                    <ModalFooter>
                      <Button color="primary" variant="light" onPress={onClose}>
                        Cerrar
                      </Button>
                      
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </>
        );
      }
      