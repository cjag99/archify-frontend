"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { authService } from "../api/auth.service";
import { User, AuthResponse, LoginCredentials, RegisterCredentials } from "../types/auth";
import { getPostLoginPath } from "@/lib/routes";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials, redirectTo?: string | null) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_DATA_COOKIE = "user_data";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Error calling logout endpoint:", error);
    } finally {
      Cookies.remove(USER_DATA_COOKIE);
      setUser(null);
      router.replace("/");
      router.refresh();
    }
  }, [router]);

  useEffect(() => {
    const savedUser = Cookies.get(USER_DATA_COOKIE);

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parseando user_data de cookies", error);
        Cookies.remove(USER_DATA_COOKIE);
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  const establishSession = (profile: User, redirectTo?: string | null) => {
    Cookies.set(USER_DATA_COOKIE, JSON.stringify(profile), {
      expires: 7,
      sameSite: "lax",
      path: "/",
    });
    setUser(profile);
    router.replace(getPostLoginPath(profile, redirectTo));
    router.refresh();
  };

  const login = async (
    credentials: LoginCredentials,
    redirectTo?: string | null
  ) => {
    const data: AuthResponse = await authService.login(credentials);
    establishSession(data.profile, redirectTo);
  };

  const register = async (credentials: RegisterCredentials) => {
    const data = await authService.register(credentials);
    establishSession(data.profile);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, register, logout }}
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
