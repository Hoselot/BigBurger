import  { useEffect, useState } from "react";
import { Modal, ModalContent } from "@heroui/modal";
import { Input } from "@heroui/input";
import { Icon } from "@iconify/react";

import { useNavigate } from "react-router-dom";
import { useFindListFetchNoAuth } from "../utils/VariablesAndMethods";
import  NoPhoto  from "../assets/nophoto.png";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Burger = {
  id: number;
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
};

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [filtered, setFiltered] = useState<Burger[]>([]);
  const { encontrarListaObjetos } = useFindListFetchNoAuth<Burger>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBurgers = async () => {
      const data = await encontrarListaObjetos(
        "/burger/listarHamburguesas",
        "Hamburguesas cargadas correctamente",
        "Error al obtener las hamburguesas."
      );
      if (data) setBurgers(data);
    };
    if (isOpen) fetchBurgers();
  }, [isOpen]);

  useEffect(() => {
    const term = searchQuery.toLowerCase();
    const results = burgers.filter((b) =>
      b.name.toLowerCase().includes(term)
    );
    setFiltered(results);
  }, [searchQuery, burgers]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="top"
      backdrop="opaque"
      classNames={{ backdrop: "bg-black/60" }}
      className="pt-8 bg-white text-gray-800 max-w-2xl mx-auto rounded-[30px]"
      size="xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {() => (
          <div className="px-4 py-4">
            {/* Buscador */}
            <div className="relative mb-4">
              <Input
                autoFocus
                fullWidth
                placeholder="Buscar hamburguesas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={
                  <Icon icon="lucide:search" className="text-gray-400" />
                }
                variant="underlined"
                size="lg"
                classNames={{
                  inputWrapper: [
                    "bg-white",
                    "text-white",
                    
                    
                    "pr-16",
                    "h-12",
                  ],
                  input: ["text-white", "placeholder:text-gray-400"],
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black"
                >
                  <Icon icon="lucide:delete" className="w-4 h-4" />
                </button>
              )}
              
            </div>

            {/* <Divider className="bg-neutral-700" /> */}

            {/* Resultados */}
            <div className="mt-4 space-y-2 max-h-[350px] overflow-y-auto">
              {searchQuery === "" ? (
                <p className="text-center text-sm text-gray-500">
                  Escribí algo para buscar una hamburguesa.
                </p>
              ) : filtered.length === 0 ? (
                <p className="text-center text-sm text-gray-500">
                  No se encontraron resultados para "{searchQuery}"
                </p>
              ) : (
                filtered.map((burger) => (
                  <button
                    key={burger.id}
                    onClick={() => {
                      navigate(`/IndividualBurgerPage/${burger.id}`, {
                        state: { burger },
                      });
                      onClose();
                    }}
                    className="w-full rounded-[20px] bg-red-800 hover:bg-black transition-colors 300ms px-4 py-3 flex items-center  gap-3"
                  >
                    <div className="flex justify-between items-center w-full gap-3">
                    
                      <div className=" flex  rounded-[20px] overflow-hidden ">
                        <img 
                          src={burger.pictureUrl || NoPhoto}
                          alt={burger.name}
                          className="w-14 aspect-square object-cover "
                          
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-white text-sm font-semibold truncate">
                          {burger.name}
                        </p>
                        <span className="text-blue-200 text-xs line-clamp-1">
                          {burger.description}
                        </span>
                      </div>
                      <span className="ml-auto text-white font-bold text-sm text-end">
                      ${burger.price.toFixed(2)}
                    </span>
                    </div>

                    
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SearchModal;
