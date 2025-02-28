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
import ModalPapas from "./crud-papas";
import DeleteModal from "./delete-papas";
import DetailModal from "./details-papas";
import EditModal from "./edit-papas";

import { IoIosArrowDown } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
interface papas {
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
  const [papas, setPapas] = useState<Papas[]>([]);
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
    const fetchPapas = async () => {
      try {
        const token = getToken();
        if (!token) {
          alert("No estás autenticado. Por favor, inicia sesión.");
          return;
        }
        const response = await fetch(
          URLBASE + "/papas/listarPapasAuth",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener las Papas");
        }

        const data: Papas[] = await response.json();
        setPapas(data);
      } catch (error) {
        setError("No se pudieron cargar las Papas");
      } finally {
        setLoading(false);
      }
    };

    fetchPapas();
  }, []);

  const filteredBurgers = papas.filter((papas) =>
    papas.name.toLowerCase().includes(filterValue.toLowerCase())
  );

  const paginatedBurgers = filteredBurgers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (loading) return <p>Cargando Papas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Buscar por Nombre..."
          startContent={<CiSearch />}
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
        />
        <div className="flex gap-3">
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button endContent={<IoIosArrowDown />} variant="flat">
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
          <ModalPapas />
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
          {paginatedBurgers.map((papas) => (
            <TableRow key={papas.id}>
              {columns
                .filter((col) => isColumnVisible(col.uid))
                .map((col) => (
                  <TableCell key={col.uid}>
                    {col.uid === "image" ? (
                      <img src={papas.pictureUrl} alt={papas.name} width="50" />
                    ) : col.uid === "actions" ? (
                      <div className="flex">
                        <Tooltip content="Detalles" color="success">
                          <DetailModal papas={papas}/>
                        </Tooltip>
                        <Tooltip content="Editar">
                          <EditModal papasId={papas.id}/>
                        </Tooltip>
                        <Tooltip color="danger" content="Eliminar">
                          <DeleteModal papasId={papas.id} />
                        </Tooltip>
                      </div>
                    ) : (
                      papas[col.uid as keyof Papas]
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
