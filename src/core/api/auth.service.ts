// API service module for auth operations
﻿import { LoginCredentials, RegisterCredentials, AuthResponse } from "../types/auth";
import { apiClient } from "./apiClient";
export const authService = {
    login: (credentials: LoginCredentials): Promise<AuthResponse> => {
        return apiClient.post<AuthResponse>("/auth/login", credentials);
    },
    register: (credentials: RegisterCredentials): Promise<AuthResponse> => {
        return apiClient.post<AuthResponse>("/auth/register", credentials);
    },
    logout: (): Promise<void> => {
        return apiClient.post("/auth/logout", {});
    },
}

   

