import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { PiEye } from "react-icons/pi";

interface Burger {
  id: number;
  name: string;
  pictureUrl: string;
  description: string;
  ingredients: string[];
  price: number;
 
}

interface DetailModalProps {
  burger: Burger;
}

export default function DetailModal({ burger }: DetailModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button isIconOnly color="success" variant="light" onPress={onOpen}>
        <PiEye />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{burger.name}</ModalHeader>
              <ModalBody>
                <img src={burger.pictureUrl} alt={burger.name} width="100%" />
                <h1>Descripción</h1>
                <p>{burger.description}</p>
                <h1>Ingredientes</h1>
                <ul>
  {burger.ingredients?.map((ingredient, index) => (
    <li key={index}>{ingredient}</li>
  )) || <li>No hay ingredientes disponibles</li>}
</ul>

                <h1>Precio: ${burger.price}</h1>
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
