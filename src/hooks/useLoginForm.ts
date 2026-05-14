"use client";

import { useState } from "react";
import { useAuth } from "@/core/context/AuthContext";

export const useLoginForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { login } = useAuth();
    

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {    
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            await login({
                email: data.email as string,
                password: data.password as string
            });
            alert("Login successful");

        } catch (err: Error | unknown) {
           if (err instanceof Error) {
                setError(err.message);
           } else {
                setError("Unknown error");
           }
        } finally {
            setLoading(false);
        }

    };

    return { handleLogin, loading, error };
}
