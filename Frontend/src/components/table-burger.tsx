import React, { useEffect, useState } from "react";
import { URLBASE , getToken} from "../utils/VariablesAndMethods";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Selection,
} from "@heroui/table";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import ModalBurguer from "./crud-burger";
import DeleteModal from "./delete-burger";
import DetailModal from "./details-burger";
import EditModal from "./edit-burger";
import { VerticalDotsIcon, SearchIcon, ChevronDownIcon } from "./table-icons";

interface Burger {
  id: number;
  name: string;
  description: string;
  price: number;
  costo: number;
  ganancia: number;
  pictureUrl: string;
}

export default function App() {
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(["name", "description", "price", "costo", "ganancia", "actions"])
  );



  useEffect(() => {
    const fetchBurgers = async () => {
      try {
        const token = getToken();
        if (!token) {
          alert("No estás autenticado. Por favor, inicia sesión.");
          return;
        }
        const response = await fetch(URLBASE + "/burger/listarHamburguesasAuth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener las hamburguesas");
        }

        const data: Burger[] = await response.json();
        setBurgers(data);
      } catch (error) {
        setError("No se pudieron cargar las hamburguesas");
      } finally {
        setLoading(false);
      }
    };

    fetchBurgers();
  }, []);

  const filteredBurgers = burgers.filter((burger) =>
    burger.name.toLowerCase().includes(filterValue.toLowerCase())
  );

  const paginatedBurgers = filteredBurgers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (loading) return <p>Cargando hamburguesas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Buscar por Nombre..."
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
        />
        <div className="flex gap-3">
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button endContent={<ChevronDownIcon />} variant="flat">
                Columnas
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={setVisibleColumns}
            >
              {["name", "description", "price", "costo", "ganancia", "actions"].map((column) => (
                <DropdownItem key={column}>{column}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <ModalBurguer />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Imagen</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Descripción</TableColumn>
          <TableColumn>Precio</TableColumn>
          <TableColumn>Costo</TableColumn>
          <TableColumn>Ganancia</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
  {paginatedBurgers.map((burger) => (
    <TableRow key={burger.id}>
      <TableCell>{burger.id}</TableCell>
      <TableCell>
        <img src={burger.pictureUrl} alt={burger.name} width="50" />
      </TableCell>
      <TableCell>{burger.name}</TableCell>
      <TableCell>{burger.description}</TableCell>
      <TableCell>${burger.price.toFixed(2)}</TableCell>
      <TableCell>${burger.costo.toFixed(2)}</TableCell>
      <TableCell>${burger.ganancia.toFixed(2)}</TableCell>
      <TableCell>
        <Tooltip content="Detalles" color="success">
          <div>
            <DetailModal />
          </div>
        </Tooltip>
        <Tooltip content="Editar">
          <div>
            <EditModal />
          </div>
        </Tooltip>
        <Tooltip color="danger" content="Eliminar">
          <div>
            <DeleteModal burgerId={burger.id} />
          </div>
        </Tooltip>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

      </Table>
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={Math.ceil(filteredBurgers.length / rowsPerPage)}
        onChange={setPage}
      />
    </div>
  );
}