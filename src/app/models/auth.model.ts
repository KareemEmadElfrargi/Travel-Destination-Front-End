export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    role?: 'ADMIN' | 'USER';
}

export interface RegisterResponse {
    token: string;
}

export interface AuthResponse { // Combined for internal use if needed, or stick to API
    token: string;
}
