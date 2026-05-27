"use client";
import { useAuth } from "@/core/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace("/");
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

   return isAuthenticated ? <>{children}</> : null;

};