"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { authService } from "../api/auth.service";
import { User, AuthResponse } from "../types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: any) => Promise<void>; // Agregado
  logout: () => void; // Agregado
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Función logout definida antes para poder usarla en el useEffect
  const logout = () => {
    Cookies.remove("auth_token");
    Cookies.remove("user_data");
    setUser(null);
    router.replace("/");
  };

  useEffect(() => {
    const loadStorageData = () => {
      const token = Cookies.get("auth_token");
      const savedUser = Cookies.get("user_data");

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Error parseando user_data de cookies", error);
          logout();
        }
      }
      setLoading(false); // Movido fuera del bloque if para que siempre deje de cargar
    };

    loadStorageData();
  }, []);

  const login = async (credentials: any) => {
    try {
      const data: AuthResponse = await authService.login(credentials);

      // Guardamos el token y el usuario en cookies
      Cookies.set("auth_token", data.token, { expires: 7, sameSite: 'lax' });
      Cookies.set("user_data", JSON.stringify(data.user), { expires: 7, sameSite: 'lax' });

      setUser(data.user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error en AuthContext - Login:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        loading, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};