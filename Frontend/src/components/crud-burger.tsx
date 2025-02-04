import { useState } from "react";
import { Input } from "@heroui/input";
import { URLBASE } from "../utils/VariablesAndMethods";
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

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setSelectedFile(file);
    }
  };

  const handleCreateBurger = async () => {
    const token = getToken();
    if (!token) {
      toast.error("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    try {
      // Crear la hamburguesa (sin imagen)
      const response = await fetch(URLBASE + "/burger/crearHamburguesa", {
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
          URLBASE + "/burger/cambiarImagenHamburguesa",
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

        toast.success("Hamburguesa creada exitosamente con su imagen!");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.success("Hamburguesa creada exitosamente!");
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al crear la hamburguesa.");
    }
  };

  // Reinicia los estados del formulario
  const resetForm = () => {
    setBurgerData({
      name: "",
      description: "",
    });
    setImagePreview(null);
    setSelectedFile(null);
  };

  return (
    <>
      {/* Toaster global para las alertas */}
      <Toaster position="top-center" />

      <Button
        color="primary"
        endContent={<PiPlusBold className="h-5 w-5" />}
        onPress={onOpen}
      >
        Crear Hamburguesa
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
                Crear Hamburguesa
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
                    label="Descripción"
                    name="description"
                    type="text"
                    value={burgerData.description}
                    onChange={handleInputChange}
                  />
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
