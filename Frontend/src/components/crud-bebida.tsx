import { useState } from "react";
import { Input } from "@heroui/input";
import { URLBASE, useCreateSinIdFetch } from "../utils/VariablesAndMethods";
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
import { Textarea } from "@heroui/input";

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bebidaData, setBebidaData] = useState({
    name: ""
  });
  const { loading: creating, error: createError, crearObjeto } = useCreateSinIdFetch();

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setBebidaData((prevData) => ({
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

  const handleCreateBebida = async () => {
    try {
      // Crear la bebida sin id
      const createdBebida = await crearObjeto(
        "/bebida/crearBebida", // endpoint
        {
          name: bebidaData.name
        },
        "Bebida creada exitosamente!",
        "Error al crear la Bebida",
        () => { } // Acción opcional de éxito
      );

      if (createdBebida) {
        const { id } = createdBebida; // Obtenemos el ID del objeto creado

        // Si se seleccionó una imagen, subimos la imagen
        if (selectedFile) {
          const formData = new FormData();
          formData.append("id", id.toString()); // Agregar la ID
          formData.append("file", selectedFile); // Agregar la imagen

          const imageResponse = await fetch(
            URLBASE + "/bebida/cambiarImagenBebida",
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
              body: formData,
            }
          );

          if (!imageResponse.ok) {
            throw new Error("Error al subir la imagen de la bebida");
          }

          toast.success("Bebida creada exitosamente con su imagen!");
        } else {
          toast.success("Bebida creada exitosamente!");
        }

        // Recargamos la página después de crear
        setTimeout(() => window.location.reload(), 0);
      }
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al crear la bebida.");
    }
  };

  const resetForm = () => {
    setBebidaData({
      name: ""
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
        Crear Bebida
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
                Crear Bebida
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col w-full gap-4">
                  <Input
                    label="Nombre"
                    name="name"
                    type="text"
                    value={bebidaData.name}
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
                    await handleCreateBebida();
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
