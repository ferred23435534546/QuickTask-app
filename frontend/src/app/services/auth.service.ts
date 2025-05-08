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
    // El <AuthResponseData> le dice a HttpClient qué tipo de respuesta esperamos.
    // Esto nos dará un tipado más fuerte en el componente que se suscriba.

    // Más adelante, podríamos querer hacer algo con la respuesta aquí,
    // como guardar el token, usando el operador `tap` de RxJS:
    // return this.http.post<AuthResponseData>(`${this.apiUrl}/login`, credentials)
    //   .pipe(
    //     tap(response => {
    //       // Por ejemplo, guardar el token en localStorage
    //       localStorage.setItem('authToken', response.token);
    //       console.log('Token guardado!', response.token);
    //     })
    //   );
  }

  // Aquí podríamos añadir métodos para register, logout, getToken, isAuthenticated, etc.
}