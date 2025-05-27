import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { PiPencilSimpleLine } from "react-icons/pi";
import { URLBASE, getToken } from "../utils/VariablesAndMethods";

interface Bebida {
  id: number;
  name: string;
  price: number;
  ganancia: number;
  costo: number;
  privada: boolean;
  pictureUrl: string;
}

export default function EditBebida({ bebidaId }: { bebidaId: number }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [bebida, setBebida] = useState<Bebida>({
    id: bebidaId,
    name: "",
    price: 0,
    ganancia: 0,
    costo: 0,
    privada: false,
    pictureUrl: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);

  // Se obtiene la bebida al abrir el modal
  const fetchBebida = async () => {
    setLoading(true);
    setError(null);
    const token = getToken();
    try {
      const response = await fetch(
        `${URLBASE}/bebida/listarUnaBebidaADMIN?id=${bebidaId}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include"
        }
      );
      if (!response.ok) {
        throw new Error("Error al obtener la bebida.");
      }
      const data = await response.json();
      setBebida(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBebida();
    }
  }, [isOpen]);

  // Recalcular precio automáticamente cuando cambian costo o ganancia
  useEffect(() => {
    setBebida((prev) => ({
      ...prev,
      price: prev.costo + prev.ganancia,
    }));
  }, [bebida.costo, bebida.ganancia]);

  // Maneja el cambio del archivo para actualizar la imagen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setNewFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Actualiza los campos del modelo de bebida
  const handleChange = (field: string, value: any) => {
    setBebida((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Se arma el FormData y se envía el PUT al endpoint /bebida/actualizarBebida/{idBebida}
  const handleSave = async (onClose: () => void) => {
    if (!bebida) return;
    if (!bebida.name || bebida.name.trim() === "") {
      setError("El nombre no puede estar vacío");
      return;
    }
    const token = getToken();
    const formData = new FormData();
    const bebidaModelBody = {
      name: bebida.name,
      price: bebida.price, // Se mantiene pero es calculado automáticamente
      ganancia: bebida.ganancia,
      costo: bebida.costo,
      privada: bebida.privada,
      pictureUrl: bebida.pictureUrl,
    };
    formData.append(
      "bebidaModelBody",
      new Blob([JSON.stringify(bebidaModelBody)], { type: "application/json" })
    );
    if (newFile) {
      formData.append("file", newFile);
    }

    try {
      const response = await fetch(
        `${URLBASE}/bebida/actualizarBebida/${bebida.id}`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
          credentials: "include"
        }
      );
      if (!response.ok) {
        throw new Error("Error al actualizar la bebida.");
      }
      const updatedBebida = await response.json();
      setBebida(updatedBebida);
      onClose();
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Button isIconOnly color="default" variant="light" onPress={onOpen}>
        <PiPencilSimpleLine />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              {loading ? (
                <ModalBody>
                  <p>Cargando...</p>
                </ModalBody>
              ) : error ? (
                <ModalBody>
                  <p>Error: {error}</p>
                </ModalBody>
              ) : (
                <>
                  <ModalHeader className="flex gap-1">
                    Editar Bebida
                  </ModalHeader>
                  <ModalBody>
                    <div className="flex">
                      <div className="flex flex-col relative">
                        <img
                          className="w-80 h-60 rounded-xl"
                          src={newImageUrl || bebida.pictureUrl}
                          alt={bebida.name}
                        />
                        <Button
                          className="absolute top-0 right-0 m-2 cursor-pointer"
                          color="warning"
                          variant="solid"
                          size="sm"
                          isIconOnly
                        >
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0"
                          />
                          <PiPencilSimpleLine className="size-5 text-white" />
                        </Button>
                      </div>
                      <div className="ml-5 gap-5 flex flex-col">
                        <Input
                          label="Nombre"
                          name="name"
                          type="text"
                          value={bebida.name}
                          onChange={(e) =>
                            handleChange("name", e.target.value)
                          }
                        />
                        <Input
                          label="Ganancia"
                          name="ganancia"
                          type="number"
                          value={bebida.ganancia}
                          onChange={(e) =>
                            handleChange("ganancia", parseFloat(e.target.value))
                          }
                        />
                        <Input
                          label="Costo"
                          name="costo"
                          type="number"
                          value={bebida.costo}
                          onChange={(e) =>
                            handleChange("costo", parseFloat(e.target.value))
                          }
                        />
                        <div className="flex items-center">
                          <label className="mr-2">Privada:</label>
                          <input
                            type="checkbox"
                            checked={bebida.privada}
                            onChange={(e) =>
                              handleChange("privada", e.target.checked)
                            }
                          />
                        </div>
                        <h3 className="text-lg font-semibold">
                          Precio: ${bebida.price.toFixed(2)}
                        </h3>
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" variant="light" onPress={onClose}>
                      Cancelar
                    </Button>
                    <Button color="success" onPress={() => handleSave(onClose)}>
                      Guardar
                    </Button>
                  </ModalFooter>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
