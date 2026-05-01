"use client";

import { useRegisterForm } from "@/hooks/useRegisterForm";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";

export const RegisterForm = () => {
    const { handleRegister, loading, error } = useRegisterForm();
    return (
        <form onSubmit={handleRegister} className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
            <Input label="Nombre" name="first_name" type="text" error={error || ""} />
            <Input label="Apellido" name="last_name" type="text" error={error || ""} />
            <Input label="Nombre de usuario" name="username" type="text" error={error || ""} />
            <Input label="Email" name="email" type="email" error={error || ""} />
            <Input label="Contraseña" name="password" type="password" error={error || ""} />
            <Input label="Confirmar Contraseña" name="confirmPassword" type="password" error={error || ""} />
            <Button type="submit" variant="primary" isLoading={loading} fullWidth>
                Registrarse
            </Button>
        </form>
    );
}