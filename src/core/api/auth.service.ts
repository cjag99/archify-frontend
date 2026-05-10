import { LoginCredentials, RegisterCredentials, AuthResponse } from "../types/auth";

export const authService = {
    login : async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await fetch("http://localhost:8000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        });
        const data = await response.json();
        if (!response.ok) {
           if (data.detail && Array.isArray(data.detail)) {
                throw new Error(data.detail[0].msg || "Error al iniciar sesión");
            }
        }
        return data as AuthResponse;
    },

    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const response = await fetch("http://localhost:8000/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || data.message || "Error al registrar");
        }
        return data as AuthResponse;
    }
}