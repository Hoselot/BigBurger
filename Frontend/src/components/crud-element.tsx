import { useState } from "react";
import { Input } from "@heroui/input";
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

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [burgerData, setBurgerData] = useState({
    name: "",
    description: "",
  });

  // Obtiene el token JWT de localStorage o sessionStorage
  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setBurgerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  
  const handleCreateBurger = async () => {
    const token = getToken();
    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    try {
      // Crear la hamburguesa (sin imagen)
      const response = await fetch("http://localhost:8080/burger/crearHamburguesa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(burgerData),
      });

      if (!response.ok) {
        throw new Error("Error al crear la hamburguesa");
      }

      const createdBurger = await response.json(); // Recibimos el objeto creado desde el backend

      // Subir la imagen de la hamburguesa creada
      if (selectedFile) {
        const formData = new FormData();
        formData.append("id", createdBurger.id); // Backend espera un ID de tipo Long
        formData.append("file", selectedFile);

        const imageResponse = await fetch(
          "http://localhost:8080/burger/cambiarImagenHamburguesa",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!imageResponse.ok) {
          throw new Error("Error al subir la imagen de la hamburguesa");
        }

        alert("Hamburguesa creada exitosamente con su imagen!");
      } else {
        alert("Hamburguesa creada sin imagen.");
      }
    } catch (error) {
      console.error(error);
      alert("Hubo un error al crear la hamburguesa.");
    }
  };

  // Reinicia los estados del formulario
  const resetForm = () => {
    setBurgerData({
      name: "",
      description: "",
    });
    
    setSelectedFile(null);
  };

  return (
    <>
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
            resetForm(); // Limpia los campos cuando el modal se cierra
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
                    value={burgerData.name}
                    onChange={handleInputChange}
                  />
                  <Input
                  label="Price"
                  
                  placeholder="0.00"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                  type="number"
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
                    await handleCreateBurger();
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
