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
    token: string;
    tokenType: string;
}

