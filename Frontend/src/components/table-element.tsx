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
import ModalElemento from "./crud-element";
import DeleteModal from "./delete-element";
import EditModal from "./edit-burger";
import { VerticalDotsIcon, SearchIcon, ChevronDownIcon } from "./table-icons";

interface Elemento {
  id: number;
  name: string;
  price: number;
  pictureUrl: string;
}

export default function App() {
  const [elementos, setElementos] = useState<Elemento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(["name","price","actions"])
  );



  useEffect(() => {
    const fetchElementos = async () => {
      try {
        const token = getToken();
        if (!token) {
          alert("No estás autenticado. Por favor, inicia sesión.");
          return;
        }
        const response = await fetch(URLBASE + "/elemento/listarElementos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los elementos");
        }

        const data: Elemento[] = await response.json();
        setElementos(data);
      } catch (error) {
        setError("No se pudieron cargar los elementos");
      } finally {
        setLoading(false);
      }
    };

    fetchElementos();
  }, []);

  const filteredElementos = elementos.filter((elemento) =>
  elemento.name.toLowerCase().includes(filterValue.toLowerCase())
  );

  const paginatedElementos = filteredElementos.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (loading) return <p>Cargando elementos...</p>;
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
              {["name", "price", "actions"].map((column) => (
                <DropdownItem key={column}>{column}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <ModalElemento />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Precio</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
  {paginatedElementos.map((elemento) => (
    <TableRow key={elemento.id}>
      <TableCell>{elemento.id}</TableCell>
      <TableCell>{elemento.name}</TableCell>
      <TableCell>${elemento.price.toFixed(2)}</TableCell>
      <TableCell>
        <Tooltip content="Editar">
          <div>
            <EditModal />
          </div>
        </Tooltip>
        <Tooltip color="danger" content="Eliminar">
          <div>
            <DeleteModal elementoId={elemento.id} />
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
        total={Math.ceil(filteredElementos.length / rowsPerPage)}
        onChange={setPage}
      />
    </div>
  );
}