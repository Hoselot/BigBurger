import { useState } from "react";
import { Input } from "@heroui/input";
import { URLBASE, getToken } from "../utils/VariablesAndMethods";
import { Toaster, toast } from "sonner";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { PiPlusBold } from "react-icons/pi";

export default function CrudElemento() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [elementoData, setElementoData] = useState({
    name: "",
    price: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setElementoData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateElemento = async () => {
    const token = getToken();
    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    try {
      const response = await fetch(`${URLBASE}/elemento/crearElemento`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: elementoData.name,
          price: parseFloat(elementoData.price),
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el elemento");
      }

      toast.success("Elemento creado exitosamente!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error(error);
      toast.error("Error al crear un nuevo elemento");
      
    }
  };

  const resetForm = () => {
    setElementoData({ name: "", price: "" });
  };

  return (
    <>
    <Toaster position="top-center" />

      <Button
        color="primary"
        endContent={<PiPlusBold className="h-5 w-5" />}
        onPress={onOpen}
      >
        Crear Elemento
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetForm();
          }
          onOpenChange(isOpen);
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Crear Elemento
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col w-full gap-4">
                  <Input
                    label="Nombre"
                    name="name"
                    type="text"
                    value={elementoData.name}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Precio"
                    name="price"
                    placeholder="0.00"
                    startContent={<span className="text-default-400 text-small">$</span>}
                    type="number"
                    value={elementoData.price}
                    onChange={handleInputChange}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={async () => {
                    await handleCreateElemento();
                    onClose();
                  }}
                >
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
