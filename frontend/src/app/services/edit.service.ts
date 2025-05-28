import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

// Interfaz basada en tu modelo Profile.ts
export interface ProfileData {
  profile_id?: number;
  user_id?: number;
  description?: string | null;
  location_zone?: string | null;
  phone_number?: string | null;
  profile_picture_url?: string | null;
  avg_rating?: number | null;
  rating_count?: number | null;
  last_seen?: Date | null;
}

// Interfaz para la respuesta del perfil (más completa)
export interface UserProfileResponse {
  id: number;
  email: string;
  name: string;
  role: string; // <-- Incluimos role
  phone?: string | null; // <-- Incluimos phone (de users)
  location?: string | null; // <-- Incluimos location (de users)
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  profile: ProfileData | null;
  message?: string;
  user?: UserProfileResponse; // Para posibles respuestas anidadas
}

// Interfaz para la carga útil de actualización (más completa)
export interface UpdateProfilePayload {
  name?: string;
  phone?: string; // <-- Campo para users.phone
  location?: string; // <-- Campo para users.location
  role?: string; // <-- Campo para users.role
  profile?: Partial<ProfileData>;
}

// Interfaces de Contraseña (sin cambios)
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class EditService {
  private apiUrlBase = 'http://localhost:3000/api';
  private profileApiUrl = `${this.apiUrlBase}/profile`;
  private authApiUrl = `${this.apiUrlBase}/auth`;

  constructor(private http: HttpClient, private router: Router) { }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private getHeaders(): HttpHeaders {
      const token = this.getToken();
      if (!token) {
          this.logout();
          throw new Error('No token found.');
      }
      return new HttpHeaders({
          'Authorization': `Bearer ${token}`
      });
  }

  updateUserProfile(payload: UpdateProfilePayload): Observable<UserProfileResponse> {
    try {
        const headers = this.getHeaders();
        return this.http.put<UserProfileResponse>(`${this.profileApiUrl}/me`, payload, { headers })
            .pipe(
                catchError(this.handleError.bind(this)) // <-- Usar bind(this)
            );
    } catch (error) {
        return throwError(() => error);
    }
  }

  getUserProfile(): Observable<UserProfileResponse> {
    try {
        const headers = this.getHeaders();
        return this.http.get<UserProfileResponse>(`${this.profileApiUrl}/me`, { headers })
            .pipe(
                catchError(this.handleError.bind(this)) // <-- Usar bind(this)
            );
    } catch (error) {
        return throwError(() => error);
    }
  }

  changePassword(payload: ChangePasswordPayload): Observable<ChangePasswordResponse> {
    try {
        const headers = this.getHeaders();
        return this.http.post<ChangePasswordResponse>(`${this.authApiUrl}/change-password`, payload, { headers })
            .pipe(
                catchError(this.handleError.bind(this)) // <-- Usar bind(this)
            );
    } catch (error) {
        return throwError(() => error);
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  private handleError(error: any) {
    console.error('Ocurrió un error en el servicio:', error);
    if (error.status === 401) {
        console.log('Error 401, deslogueando...');
        this.logout(); // <-- Asegurarse que 'this' es correcto
    }
    return throwError(() => error);
  }
}