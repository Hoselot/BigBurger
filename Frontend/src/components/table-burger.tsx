import { useEffect, useState } from "react";
import { URLBASE, getToken } from "../utils/VariablesAndMethods";
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
import { SearchIcon, ChevronDownIcon } from "./table-icons";

interface Burger {
  id: number;
  name: string;
  description: string;
  price: number;
  costo: number;
  ganancia: number;
  pictureUrl: string;
}

export const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Imagen", uid: "image" },
  { name: "Nombre", uid: "name", sortable: true },
  { name: "Descripción", uid: "description", sortable: true },
  { name: "Precio", uid: "price", sortable: true },
  { name: "Costo", uid: "costo", sortable: true },
  { name: "Ganancia", uid: "ganancia", sortable: true },
  { name: "Acciones", uid: "actions" },
];

export default function App() {
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    // new Set(columns.map((col) => col.uid))
    new Set(["name", "price", "actions"])
  );
  const isColumnVisible = (uid: string) => {
    return visibleColumns === "all" || (visibleColumns instanceof Set && visibleColumns.has(uid));
  };

  useEffect(() => {
    const fetchBurgers = async () => {
      try {
        const token = getToken();
        if (!token) {
          alert("No estás autenticado. Por favor, inicia sesión.");
          return;
        }
        const response = await fetch(
          URLBASE + "/burger/listarHamburguesasAuth",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
              {columns.map((column) => (
                <DropdownItem key={column.uid}>{column.name}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <ModalBurguer />
        </div>
      </div>
      <Table>
        <TableHeader>
          {columns
            .filter((col) => isColumnVisible(col.uid))
            .map((col) => (
              <TableColumn key={col.uid}>{col.name}</TableColumn>
            ))}
        </TableHeader>
        <TableBody>
          {paginatedBurgers.map((burger) => (
            <TableRow key={burger.id}>
              {columns
                .filter((col) => isColumnVisible(col.uid))
                .map((col) => (
                  <TableCell key={col.uid}>
                    {col.uid === "image" ? (
                      <img src={burger.pictureUrl} alt={burger.name} width="50" />
                    ) : col.uid === "actions" ? (
                      <div className="flex">
                        <Tooltip content="Detalles" color="success">
                          <DetailModal burger={burger}/>
                        </Tooltip>
                        <Tooltip content="Editar">
                          <EditModal />
                        </Tooltip>
                        <Tooltip color="danger" content="Eliminar">
                          <DeleteModal burgerId={burger.id} />
                        </Tooltip>
                      </div>
                    ) : (
                      burger[col.uid as keyof Burger]
                    )}
                  </TableCell>
                ))}
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
