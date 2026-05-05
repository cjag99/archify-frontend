"use client";
import { useAuth } from "@/core/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace("/"); // Redirige a la página de inicio si no está autenticado
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return <div>Cargando...</div>; // O un spinner de carga
    }

   return isAuthenticated ? <>{children}</> : null; // Renderiza los hijos solo si está autenticado

};