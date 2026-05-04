"use client";

import { useLoginForm } from "@/hooks/useLoginForm";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";

interface LoginFormProps {
    onSwitch?: () => void;
}
export const LoginForm = ({ onSwitch }: LoginFormProps) => {
    const { handleLogin, loading, error } = useLoginForm();
    return (
        <form onSubmit={handleLogin} className="w-full space-y-4">
            <Input label="Email" name="email" type="email" error={error || ""} />
            <Input label="Contraseña" name="password" type="password" error={error || ""} />
            <Button type="submit" variant="primary" isLoading={loading} fullWidth>
                Iniciar sesión
            </Button>
            {onSwitch && (
                <p className="text-sm text-slate-600 mt-4 text-center">
                    ¿No tienes una cuenta?{" "}
                    <button
                        type="button"
                        onClick={onSwitch}
                        className="text-brand font-medium hover:text-brand-dark transition-colors"
                    >
                        Regístrate aquí
                    </button>
                </p>
            )}
        </form>
    );
};