// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { Observable } from 'rxjs';
// Importaremos 'tap' de RxJS más tarde si queremos manejar el token aquí

// Definimos una interfaz para la respuesta esperada del login (opcional pero buena práctica)
export interface AuthResponseData {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'client' | 'worker' | 'both' | 'admin'; // Role es opcional y con tipos definidos
}
// --- NUEVA INTERFAZ para la respuesta del registro ---
export interface RegisterResponseData {
  message: string;
  userId: number;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL base de tu API de autenticación del backend
  // Docker Compose expone tu backend en el puerto 3000 de localhost
  private apiUrl = 'http://localhost:3000/api/auth';

  // Inyecta HttpClient en el constructor
  constructor(private http: HttpClient) { }

  login(credentials: { email: string, password: string }): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(`${this.apiUrl}/login`, credentials);
  }
  register(userData: RegisterPayload): Observable<RegisterResponseData> {
    return this.http.post<RegisterResponseData>(`${this.apiUrl}/register`, userData);
  }
  // Aquí podríamos añadir métodos para register, logout, getToken, isAuthenticated, etc.
}