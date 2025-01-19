import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Definir los tipos para el contexto
interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string, rememberMe: boolean) => void;
  logout: () => void;
}

// Contexto de autenticación con un valor predeterminado
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto de autenticación
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    setIsLoggedIn(!!token); // Establece el estado de autenticación
  }, []); // Se ejecuta solo cuando se monta el componente, para revisar el token

  const login = (token: string, rememberMe: boolean) => {
    if (rememberMe) {
      localStorage.setItem("token", token);
    } else {
      sessionStorage.setItem("token", token);
    }
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.reload(); // Forzar la recarga de la página al cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder al contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
