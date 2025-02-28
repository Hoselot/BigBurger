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

interface Papas {
  id: number;
  name: string;
  pictureUrl: string;
  description: string;
  ingredients: string[];
  price: number;

}

interface DetailModalProps {
  papas: Papas;
}

export default function DetailModal({ papas }: DetailModalProps) {
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
              <ModalHeader className="flex flex-col gap-1">{papas.name}</ModalHeader>
              <ModalBody>
                <img src={papas.pictureUrl} alt={papas.name} width="100%" />
                <h1>Descripción</h1>
                <p>{papas.description}</p>
                <h1>Ingredientes</h1>
                <ul>
                  {papas.ingredients?.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  )) || <li>No hay ingredientes disponibles</li>}
                </ul>

                <h1>Precio: ${papas.price}</h1>
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
