import  { useState } from "react";
import {Input} from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  
  useDisclosure,
} from "@heroui/modal";
import {Button} from "@heroui/button"
import { PiPlusBold } from "react-icons/pi";
export default function App() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]; // Usa el operador opcional para evitar errores si files es null
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl); // Ahora esto será válido
  }
};
    return (
      <>
        <Button color="primary" endContent={<PiPlusBold className="h-5 w-5" />  }onPress={onOpen}>Crear Hamburguesa</Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Crear Hamburguesa</ModalHeader>
      <ModalBody>
        <div className="flex flex-col w-full gap-4">
          <Input label="Nombre" type="text" />
          <Input label="Descripción" type="text" />
          <div>
            <Input
              label="Imagen"
              type="file"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Vista previa"
                className="mt-4 w-full h-auto max-h-64 object-contain rounded-lg"
              />
            )}
          </div>
        </div>
      </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Crear
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
  