"use client";

import { useState } from "react";
import { authService } from "@/core/api/auth.service";

export const useRegisterForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {    
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());

            const passwordIsValid = () => data.password === data.confirmPassword;
            if (!passwordIsValid()) {
                setError("Passwords do not match");
                return;
            }
            setLoading(true);

            await authService.register({
                first_name: data.first_name as string,
                last_name: data.last_name as string,
                username: data.username as string,
                email: data.email as string,
                password: data.password as string
            });
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

    return { loading, error, handleRegister };
};