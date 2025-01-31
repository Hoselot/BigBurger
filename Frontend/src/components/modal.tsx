import { useState, useEffect } from "react";
import { URLBASE } from "../utils/VariablesAndMethods"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
  } from "@heroui/modal";
  import {Button} from "@heroui/button"
  import {Link} from "@heroui/link"
  import {Input} from "@heroui/input";
  import {Checkbox} from "@heroui/checkbox";
  import { CiUser,CiLock } from "react-icons/ci";
 
  export default function App() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        setIsLoggedIn(!!token);
      }, []);
    
      const handleLogin = async () => {
        try {
          const response = await fetch(URLBASE+"/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });
      
          if (response.ok) {
            const data = await response.json();
            
            // Extrae el token desde la clave 'jwt'
            const token = data.jwt;
            
            if (rememberMe) {
              localStorage.setItem("token", token);
            } else {
              sessionStorage.setItem("token", token);
            }
      
            setIsLoggedIn(true);
            // Forzar la recarga de la página
          window.location.reload();
            onOpenChange;
          } else {
            alert("Error en las credenciales");
          }
        } catch (error) {
          console.error("Error en la autenticación:", error);
        }
      };
      
    
      const handleLogout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setIsLoggedIn(false);
        // Forzar la recarga de la página
      window.location.reload();
      };
      return (
        <>
          {isLoggedIn ? (
            <Button color="danger" onPress={handleLogout}>
              Cerrar Sesión
            </Button>
          ) : (
            <>
            
              <Button color="primary" variant="light" onPress={onOpen}>
                Administrador
              </Button>
              <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">Administrador</ModalHeader>
                      <ModalBody>
                        <Input
                          endContent={
                            <CiUser className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                          }
                          label="Username"
                          placeholder="Ingresa tu nombre de usuario"
                          variant="bordered"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input
                          endContent={
                            <CiLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                          }
                          label="Contraseña"
                          placeholder="Ingresa tu Contraseña"
                          type="password"
                          variant="bordered"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="flex py-2 px-1 justify-between">
                          <Checkbox
                            classNames={{
                              label: "text-small",
                            }}
                            checked={rememberMe}
                            onChange={() => setRememberMe(prevState => !prevState)}// Alternar el valor de rememberMe
                          >
                            Recordarme
                          </Checkbox>
                          <Link color="primary" href="#" size="sm">
                            ¿Olvidaste tu contraseña?
                          </Link>
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="danger" variant="flat" onPress={onClose}>
                          Cerrar
                        </Button>
                        <Button color="primary" onPress={handleLogin}>
                          Iniciar
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </>
          )}
        </>
      );
  }
  