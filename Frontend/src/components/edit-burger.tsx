import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@heroui/table";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    
    useDisclosure,
  } from "@heroui/modal";

  import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/dropdown";
  import { PiPlusBold } from "react-icons/pi";
  import {Button} from "@heroui/button"

  import {  PiPencilSimpleLine  } from "react-icons/pi";
  export default function App() {
      const {isOpen, onOpen, onOpenChange} = useDisclosure();
      return (
          <>
            <Button isIconOnly color="default" variant="light" onPress={onOpen}><PiPencilSimpleLine/></Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" backdrop="blur">
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex gap-1">Hamburguesa <Button isIconOnly color="default" variant="light"><PiPencilSimpleLine/></Button></ModalHeader>
                    <ModalBody>
                      <div className="flex ">
                      <img className="w-80" src="https://th.bing.com/th/id/OIP.xpHtN8nOMEDD69KJLoiHDAHaHa?rs=1&pid=ImgDetMain" alt="" />
                      <Button isIconOnly color="default" variant="light"><PiPencilSimpleLine/></Button>
                      </div>
                      <div className="flex">
                        <h1>Descripcion</h1> <Button isIconOnly color="default" variant="light"><PiPencilSimpleLine/></Button>
                        
                      </div>
                       <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur ex unde, inventore animi nam quo eius ratione accusamus neque sapiente, optio ad recusandae quod officiis sequi error deleniti ipsum vero!</p>
                        <div className="flex">

                        <h1>Ingredientes</h1>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button  isIconOnly variant="bordered">< PiPlusBold/></Button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="Static Actions">
                            <DropdownItem key="new">asdada</DropdownItem>
                            <DropdownItem key="copy">asdada</DropdownItem>
                            <DropdownItem key="edit">asdsadasda</DropdownItem>
                            
                          </DropdownMenu>
                        </Dropdown>
                        </div>
                        <Table aria-label="Example static collection table">
                          <TableHeader>
                            <TableColumn>Elementos</TableColumn>
                            <TableColumn>Cantidad</TableColumn>
                            <TableColumn>Precio</TableColumn>
                            
                          </TableHeader>
                          <TableBody>
                            <TableRow key="1">
                              <TableCell>Tony Reichert</TableCell>
                              <TableCell>CEO</TableCell>
                              <TableCell>Active</TableCell>
                            </TableRow>
                            <TableRow key="2">
                              <TableCell>Zoey Lang</TableCell>
                              <TableCell>Technical Lead</TableCell>
                              <TableCell>Paused</TableCell>
                            </TableRow>
                            <TableRow key="3">
                              <TableCell>Jane Fisher</TableCell>
                              <TableCell>Senior Developer</TableCell>
                              <TableCell>Active</TableCell>
                            </TableRow>
                            <TableRow key="4">
                              <TableCell>William Howard</TableCell>
                              <TableCell>Community Manager</TableCell>
                              <TableCell>Vacation</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        
                        <h1>Costo: $99990</h1>
                        <div className="flex">
                        <h1>Ganancia: $99990</h1>
                        <Button isIconOnly color="default" variant="light"><PiPencilSimpleLine/></Button>
                        </div>
                        <h1>Precio: $99990</h1>
                      </ModalBody>
                    <ModalFooter>
                      <Button color="primary" variant="light" onPress={onClose}>
                        Cancelar
                      </Button>
                      <Button color="success" onPress={onClose}>
                        Guardar
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </>
        );
      }
      