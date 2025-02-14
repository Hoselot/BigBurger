import React, { useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    
  } from "@heroui/table";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
interface Elemento {
  id: number;
  nombre: string;
  precio: number;
}

const TablaDinamica: React.FC = () => {
  const [datos, setDatos] = useState<Elemento[]>([]);
  const [seleccionados, setSeleccionados] = useState<Elemento[]>([]);

  // Simula obtener datos de una API
  const obtenerDatos = () => {
    setDatos([
      { id: 1, nombre: "Elemento A", precio: 100 },
      { id: 2, nombre: "Elemento B", precio: 200 },
      { id: 3, nombre: "Elemento C", precio: 300 },
    ]);
  };

  // Agrega un elemento si no está ya agregado
  const agregarElemento = (item: Elemento) => {
    if (!seleccionados.some((el) => el.id === item.id)) {
      setSeleccionados([...seleccionados, item]);
    }
  };

  return (
    <div>
      <Button onClick={obtenerDatos} variant="solid" color="primary">Obtener Datos</Button>

      <div className="mt-4">
        {datos.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <span>{item.nombre} - ${item.precio}</span>
            <Button onClick={() => agregarElemento(item)} size="sm">Seleccionar</Button>
          </div>
        ))}
      </div>

      <Table aria-label="Tabla dinámica">
        <TableHeader>
          <TableColumn>Elemento</TableColumn>
          <TableColumn>Cantidad</TableColumn>
          <TableColumn>Precio</TableColumn>
        </TableHeader>
        <TableBody>
          {seleccionados.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.nombre}</TableCell>
              <TableCell>
                <Input type="number" defaultValue="1" min="0" />
              </TableCell>
              <TableCell>${item.precio}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TablaDinamica;
