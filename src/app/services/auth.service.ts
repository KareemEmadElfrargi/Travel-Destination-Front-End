import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../models/auth.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<DecodedUser | null>;
    public currentUser: Observable<DecodedUser | null>;
    private readonly AUTH_KEY = 'user_auth_token';

    constructor(private http: HttpClient, private router: Router) {
        const token = localStorage.getItem(this.AUTH_KEY);
        this.currentUserSubject = new BehaviorSubject<DecodedUser | null>(token ? this.decodeToken(token) : null);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): DecodedUser | null {
        return this.currentUserSubject.value;
    }

    register(user: RegisterRequest): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(`${environment.apiUrl}/auth/register`, user);
    }

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<any>(`${environment.apiUrl}/auth/login`, credentials)
            .pipe(map(response => {
                console.log('🔹 Login Response from Backend:', response); // DEBUG LOG

                // Extract token correctly based on API Response structure
                const token = response.data?.token || response.token || response.accessToken || response.jwt;

                // store user details and jwt token in local storage to keep user logged in between page refreshes
                if (token) {
                    // Ensure we store it as 'token' for our app logic
                    response.token = token;

                    localStorage.setItem(this.AUTH_KEY, response.token);
                    const decoded = this.decodeToken(response.token);
                    console.log('🔹 Decoded User:', decoded); // DEBUG LOG
                    this.currentUserSubject.next(decoded);
                }
                return response;
            }));
    }

    logout() {
        localStorage.removeItem(this.AUTH_KEY);
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getToken(): string | null {
        return localStorage.getItem(this.AUTH_KEY);
    }

    getUserRole(): string | null {
        const user = this.currentUserValue;
        return user ? user.role : null;
    }

    private decodeToken(token: string): DecodedUser | null {
        try {
            console.log('Decoding token:', token);
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload));
            console.log('Decoded payload:', decoded);

            let rawRole: any = decoded.roles || decoded.role || decoded.authorities || decoded.scope || 'USER';
            let authority: string = 'USER';

            // Handle different formats
            if (Array.isArray(rawRole)) {
                if (rawRole.length > 0) {
                    if (typeof rawRole[0] === 'string') {
                        authority = rawRole[0]; // ["ROLE_ADMIN"] -> "ROLE_ADMIN"
                    } else if (rawRole[0].authority) {
                        authority = rawRole[0].authority; // [{authority: "ROLE_ADMIN"}] -> "ROLE_ADMIN"
                    }
                }
            } else if (typeof rawRole === 'string') {
                authority = rawRole; // "ROLE_ADMIN" -> "ROLE_ADMIN" or "read write" -> "read write" (scope)
            }

            console.log('Raw authority extracted:', authority);

            // Normalize Role: Remove ROLE_ prefix if present, convert to uppercase just in case
            if (authority) {
                authority = authority.toString().toUpperCase();
                if (authority.startsWith('ROLE_')) {
                    authority = authority.replace('ROLE_', '');
                }
            }

         

            console.log('Final normalized role:', authority);

            return {
                username: decoded.sub,
                role: authority
            };
        } catch (e) {
            console.error('Error decoding token:', e);
            return null;
        }
    }
}

interface DecodedUser {
    username: string;
    role: string;
}
