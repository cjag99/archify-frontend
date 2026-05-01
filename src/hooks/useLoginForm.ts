"use client";

import { useState } from "react";
import { authService } from "@/core/api/auth.service";

export const useLoginForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {    
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            await authService.login({
                email: data.email as string,
                password: data.password as string
            });
            alert("Login exitoso");

        } catch (err: Error | unknown) {
           if (err instanceof Error) {
                setError(err.message);
           } else {
                setError("Error desconocido");
           }
        } finally {
            setLoading(false);
        }

    };

    return { handleLogin, loading, error };
}
