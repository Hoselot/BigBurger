import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import React from "react";


export const URLBASE = "https://bigburger.loophole.site";

interface createResult {
  loading: boolean;
  error: string | null;
  crearObjeto: (
    endpoint: string,
    data: any,
    mensajeExito: string,
    mensajeError: string,
    onSuccess?: () => void
  ) => Promise<{ id: number; data: any } | void>; // Aquí devolvemos un objeto con id y data
}

interface findOneResult {
  loading: boolean;
  error: string | null;
  encontrarObjeto: (
    endpoint: string,
    id: string | number,
    mensajeExito: string,
    mensajeError: string,
    onSuccess?: () => void
  ) => Promise<{ id: number; data: any } | void>; // Aquí devolvemos un objeto con id y data;
}

interface FindListResults<T> {
  loading: boolean;
  error: string | null;
  encontrarListaObjetos: (
    endpoint: string,
    mensajeExito: string,
    mensajeError: string,
    onSuccess?: () => void
  ) => Promise<T[] | void>; // Ahora devuelve una lista del tipo T
}


interface DeleteResult {
  loading: boolean;
  error: string | null;
  eliminarObjeto: (
    endpoint: string,
    id: string | number,
    mensajeExito: string,
    mensajeError: string,
    onSuccess?: () => void
  ) => Promise<void>;
}

export const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const getTokenOrRedirect = (): string => {
  const token = getToken();
  if (!token) {
    alert("No estás autenticado. Por favor, inicia sesión.");
    throw new Error("Usuario no autenticado"); // Detiene la ejecución
  }
  return token;
};

export function useFindListFetchNoAuth<T>(): FindListResults<T> {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const encontrarListaObjetos = async (
    endpoint: string,
    mensajeExito: string,
    mensajeError: string,
    onSuccess?: () => void
  ): Promise<T[] | void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URLBASE}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      if (response.ok) {
        const result: T[] = await response.json(); // Convertir a tipo genérico
        console.log(mensajeExito);
        toast.success(mensajeExito);
        onSuccess?.();
        return result; // Devolver la lista de objetos
      } else {
        console.error(mensajeError);
        toast.error(mensajeError);
        setError(mensajeError);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      toast.error("Error al realizar la solicitud");
      setError("Error al realizar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, encontrarListaObjetos };
}

export function useFindListFetch<T>(): FindListResults<T> {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const encontrarListaObjetos = async (
    endpoint: string,
    mensajeExito: string,
    mensajeError: string,
    onSuccess?: () => void
  ): Promise<T[] | void> => {
    setLoading(true);
    setError(null);
    try {
      const token = getTokenOrRedirect();
      const response = await fetch(`${URLBASE}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Si usas token JWT
        },
        credentials: "include"
      });

      if (response.ok) {
        const result: T[] = await response.json(); // Convertir a tipo genérico
        console.log(mensajeExito);
        toast.success(mensajeExito);
        onSuccess?.();
        return result; // Devolver la lista de objetos
      } else {
        console.error(mensajeError);
        toast.error(mensajeError);
        setError(mensajeError);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      toast.error("Error al realizar la solicitud");
      setError("Error al realizar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, encontrarListaObjetos };
}


export function useCreateSinIdFetch(): createResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const crearObjeto = async (
    endpoint: string,
    data: any,
    mensajeExito: string,
    mensajeError: string,
    onSuccess?: () => void
  ) => {
    setLoading(true);
    setError(null);
    try {
      const token = getTokenOrRedirect();
      const response = await fetch(`${URLBASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Si usas token JWT
        },
        body: JSON.stringify(data), // Convertimos el objeto en JSON
        credentials: "include"
      });

      if (response.ok) {
        const result = await response.json();
        console.log(mensajeExito);
        toast.success(mensajeExito);
        onSuccess?.();
        return result
      } else {
        console.error(mensajeError);
        toast.error(mensajeError);
        setError(mensajeError);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      toast.error("Error al realizar la solicitud");
      setError("Error al realizar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, crearObjeto };
}

export function useDeleteFetch(): DeleteResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const eliminarObjeto = async (
    endpoint: string,
    id: string | number,
    mensajeExito: string,
    mensajeError: string,
    onSuccess?: () => void
  ) => {
    setLoading(true);
    setError(null);
    try {
      const token = getTokenOrRedirect();
      const response = await fetch(`${URLBASE}${endpoint}?id=${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`, // Si usas token JWT
        },
        credentials: "include"
      });

      if (response.ok) {
        console.log(mensajeExito);
        toast.success(mensajeExito);
        onSuccess?.();
      } else {
        console.error(mensajeError);
        toast.error(mensajeError);
        setError(mensajeError);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      toast.error("Error al realizar la solicitud");
      setError("Error al realizar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, eliminarObjeto };
}

const VariablesAndMethods: React.FC = () => {
  return (
    <div>
      <h1>Variable URLBASE</h1>
      <p>{URLBASE}</p>
    </div>
  );
};

export default VariablesAndMethods;
