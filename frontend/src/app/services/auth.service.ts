// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Asegúrate que HttpHeaders esté importado
import { Observable, throwError } from 'rxjs'; // Importa throwError si lo usas para manejo de errores

// --- INTERFACES (ASEGÚRATE DE TENERLAS Y EXPORTARLAS) ---
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
  // Campos adicionales que tu EditProfileComponent espera de la tabla 'profiles'
  // y que tu backend devuelve en el objeto 'profile'
  habilidades?: string[] | null; 
  experiencia?: string | null;
  categoriasServicio?: string[] | null;
  disponibilidad?: string | null;
  // notificacionesActivas?: boolean | null; // Parece que este campo está en tu profileForm
                                          // pero no en tu migración de 'profiles' directamente.
                                          // Si está en 'users', UserProfileResponse lo tendría.
                                          // Si está en 'profiles', añádelo a ProfileData.
}

export interface UserProfileResponse { // Esta es la respuesta de /api/profile/me
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

export interface RegisterPayload { /* ... */ }
export interface RegisterResponseData {
  message: string; 
  userId: number;
}

// --- LA NUEVA INTERFAZ ChangePasswordPayload ---
export interface ChangePasswordPayload { 
  currentPassword: string;
  newPassword: string;
}

// --- LA NUEVA INTERFAZ ChangePasswordResponse ---
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

  constructor(private http: HttpClient) { }

  // ... tus métodos login, register, getCurrentUser, getToken, isAuthenticated, logout ...
  // (los que ya tienes y funcionan)

  login(credentials: { email: string, password: string }): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(`${this.authApiUrl}/login`, credentials);
  }

  register(userData: RegisterPayload): Observable<RegisterResponseData> {
    return this.http.post<RegisterResponseData>(`${this.authApiUrl}/register`, userData);
  }

  getCurrentUser(): UserData | null {
    const userDataString = localStorage.getItem('currentUser');
    console.log('AuthService (getCurrentUser): Contenido de "currentUser" en localStorage:', userDataString); 
    if (userDataString) {
      try {
        const parsedUser = JSON.parse(userDataString) as UserData;
        console.log('AuthService (getCurrentUser): Usuario parseado:', parsedUser);
        return parsedUser;
      } catch (error) {
        console.error('AuthService (getCurrentUser): Error al parsear "currentUser" de localStorage:', error);
        localStorage.removeItem('currentUser');
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
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    console.log('Usuario deslogueado, token y currentUser eliminados.');
  }

  // --- AÑADE ESTE MÉTODO COMPLETO ---
  getUserProfile(): Observable<UserProfileResponse> {
    const token = this.getToken();
    
    if (!token) {
      console.error('AuthService (getUserProfile): No se encontró token para la solicitud.');
      // Devolver un observable que emita un error es una buena práctica aquí
      return throwError(() => new Error('Token no disponible. Por favor, inicia sesión.'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // La URL para el perfil es /api/profile/me
    return this.http.get<UserProfileResponse>(`${this.profileApiUrl}/me`, { headers: headers });
  }
  // --- FIN DEL MÉTODO getUserProfile ---
  
  // --- AQUÍ VA EL NUEVO MÉTODO changePassword ---
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
  // --- FIN DEL MÉTODO changePassword ---

}