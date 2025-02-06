import { useEffect, useState } from "react";
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
import EditModal from "./edit-element";
import {SearchIcon, ChevronDownIcon } from "./table-icons";

interface Elemento {
  id: number;
  name: string;
  price: number;
  pictureUrl: string;
}

export const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Nombre", uid: "name", sortable: true },
  { name: "Precio", uid: "price", sortable: true },
  { name: "Acciones", uid: "actions" },
];

export default function App() {
  const [elementos, setElementos] = useState<Elemento[]>([]);
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
              {columns.map((col) => (
  <DropdownItem key={col.uid}>{col.name}</DropdownItem>
))}
            </DropdownMenu>
          </Dropdown>
          <ModalElemento />
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
                {paginatedElementos.map((elemento) => (
                            <TableRow key={elemento.id}>
                              {columns
                                .filter((col) => isColumnVisible(col.uid))
                                .map((col) => (
                                  <TableCell key={col.uid}>
                                    { col.uid === "actions" ? (
                                      <div className="flex">
                                        
                                        <Tooltip content="Editar">
                                          <EditModal />
                                        </Tooltip>
                                        <Tooltip color="danger" content="Eliminar">
                                        <DeleteModal elementoId={elemento.id} />
                                        </Tooltip>
                                      </div>
                                    ) : (
                                      elemento[col.uid as keyof Elemento]
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
        total={Math.ceil(filteredElementos.length / rowsPerPage)}
        onChange={setPage}
      />
    </div>
  );
}