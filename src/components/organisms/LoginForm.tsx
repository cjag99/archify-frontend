"use client";

import { useLoginForm } from "@/hooks/useLoginForm";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";

export const LoginForm = () => {
    const { handleLogin, loading, error } = useLoginForm();
    return (
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
            <Input label="Email" name="email" type="email" error={error || ""} />
            <Input label="Contraseña" name="password" type="password" error={error || ""} />
            <Button type="submit" variant="primary" isLoading={loading} fullWidth>
                Iniciar sesión
            </Button>
        </form>
    );
};