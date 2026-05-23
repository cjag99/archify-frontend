import { UUID } from "crypto";

export interface RegisterCredentials {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token?: string;
    profile: User;
}

export interface User {
    id: UUID;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    is_authorized: boolean;
    role: "user" | "admin";
    avatar: UUID | null;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
}
