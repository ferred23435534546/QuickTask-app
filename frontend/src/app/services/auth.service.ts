// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router'; // <--- IMPORTANTE: Importar Router

// --- INTERFACES (tal como las tenías o con ejemplos donde estaban vacías) ---
export interface UserData {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface ProfileData {
  profile_id: number;
  user_id: number;
  description?: string | null;
  location_zone?: string | null;
  phone_number?: string | null;
  profile_picture_url?: string | null;
  avg_rating?: number | null;
  rating_count?: number | null;
  last_seen?: Date | null;
  habilidades?: string[] | null;
  experiencia?: string | null;
  categoriasServicio?: string[] | null;
  disponibilidad?: string | null;
}

export interface UserProfileResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  profile: ProfileData | null;
}

export interface AuthResponseData {
  message: string;
  token: string;
  user: UserData;
}

// Interfaz RegisterPayload con campos de ejemplo basados en tu register.component.ts
// Asegúrate que coincida con lo que tu backend espera.
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}
export interface RegisterResponseData {
  message: string;
  userId: number;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}
// --- FIN DE LAS DEFINICIONES DE INTERFAZ ---


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrlBase = 'http://localhost:3000/api'; // URL base general
  private authApiUrl = `${this.apiUrlBase}/auth`; // Específica para /auth
  private profileApiUrl = `${this.apiUrlBase}/profile`; // Específica para /profile

  constructor(
    private http: HttpClient,
    private router: Router // <--- INYECTAR Router
  ) { }

  login(credentials: { email: string, password: string }): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(`${this.authApiUrl}/login`, credentials);
  }

  register(userData: RegisterPayload): Observable<RegisterResponseData> {
    return this.http.post<RegisterResponseData>(`${this.authApiUrl}/register`, userData);
  }

  getCurrentUser(): UserData | null {
    const userDataString = localStorage.getItem('currentUser');
    // Re-incluyo tus console.log originales para este método
    console.log('AuthService (getCurrentUser): Contenido de "currentUser" en localStorage:', userDataString);
    if (userDataString) {
      try {
        const parsedUser = JSON.parse(userDataString) as UserData;
        console.log('AuthService (getCurrentUser): Usuario parseado:', parsedUser);
        return parsedUser;
      } catch (error) {
        console.error('AuthService (getCurrentUser): Error al parsear "currentUser" de localStorage:', error);
        localStorage.removeItem('currentUser'); // Limpiar si está corrupto
        return null;
      }
    }
    console.log('AuthService (getCurrentUser): No se encontró "currentUser" en localStorage.');
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    // Esta lógica ya la tenías y es correcta para verificar si hay un token
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    console.log('Usuario deslogueado, token y currentUser eliminados.');
    this.router.navigate(['/login']); // <--- AÑADIDO: Redirigir a login al cerrar sesión
  }

  // Método añadido para centralizar la redirección (opcional pero útil)
  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

  getUserProfile(): Observable<UserProfileResponse> {
    const token = this.getToken();
    if (!token) {
      console.error('AuthService (getUserProfile): No se encontró token para la solicitud.');
      return throwError(() => new Error('Token no disponible. Por favor, inicia sesión.'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<UserProfileResponse>(`${this.profileApiUrl}/me`, { headers: headers });
  }

  changePassword(payload: ChangePasswordPayload): Observable<ChangePasswordResponse> {
    const token = this.getToken();
    if (!token) {
      console.error('AuthService (changePassword): No se encontró token.');
      return throwError(() => new Error('Token no disponible. Por favor, inicia sesión.'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ChangePasswordResponse>(`${this.authApiUrl}/change-password`, payload, { headers: headers });
  }
}