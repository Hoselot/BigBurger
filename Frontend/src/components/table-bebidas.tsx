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
import ModalBebida from "./crud-bebida";
import DeleteModal from "./delete-bebida";
import EditModal from "./edit-bebida";

import { CiSearch } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";

interface Bebida {
  id: number;
  name: string;
  price: number;
  costo: number;
  ganancia: number;
  privada: boolean;
  pictureUrl: string;
}

export const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "Imagen", uid: "pictureUrl" },
  { name: "Nombre", uid: "name", sortable: true },
  { name: "Costo", uid: "costo", sortable: true },
  { name: "Ganancia", uid: "ganancia", sortable: true },
  { name: "Precio", uid: "price", sortable: true },
  { name: "Privacidad", uid: "privada", sortable: true },
  { name: "Acciones", uid: "actions" },
];

export default function App() {
  const [bebidas, setBebidas] = useState<Bebida[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(["name", "price", "costo", "ganancia", "privada", "actions"])
  );

  const isColumnVisible = (uid: string) => {
    return visibleColumns === "all" || (visibleColumns instanceof Set && visibleColumns.has(uid));
  };

  useEffect(() => {
    const fetchBebidas = async () => {
      try {
        const token = getToken();
        if (!token) {
          alert("No estás autenticado. Por favor, inicia sesión.");
          return;
        }
        const response = await fetch(URLBASE + "/bebida/listarBebidaAuth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener las bebidas");
        }

        const data: Bebida[] = await response.json();
        setBebidas(data);
      } catch (error) {
        setError("No se pudieron cargar las bebidas");
      } finally {
        setLoading(false);
      }
    };

    fetchBebidas();
  }, []);

  const filteredBebidas = bebidas.filter((bebida) =>
    bebida.name.toLowerCase().includes(filterValue.toLowerCase())
  );

  const paginatedBebidas = filteredBebidas.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (loading) return <p>Cargando bebidas...</p>;
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
              {columns.map((col) => (
                <DropdownItem key={col.uid}>{col.name}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <ModalBebida />
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
          {paginatedBebidas.map((bebida) => (
            <TableRow key={bebida.id}>
              {columns
                .filter((col) => isColumnVisible(col.uid))
                .map((col) => (
                  <TableCell key={col.uid}>
                    {col.uid === "pictureUrl" ? (
                      <img
                        src={bebida.pictureUrl}
                        alt={bebida.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : col.uid === "privada" ? (
                      bebida.privada ? "Sí" : "No"
                    ) : col.uid === "actions" ? (
                      <div className="flex">
                        <Tooltip content="Editar">
                          <EditModal bebidaId={bebida.id} />
                        </Tooltip>
                        <Tooltip color="danger" content="Eliminar">
                          <DeleteModal bebidaId={bebida.id} />
                        </Tooltip>
                      </div>
                    ) : (
                      bebida[col.uid as keyof Bebida]
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
        total={Math.ceil(filteredBebidas.length / rowsPerPage)}
        onChange={setPage}
      />
    </div>
  );
}
