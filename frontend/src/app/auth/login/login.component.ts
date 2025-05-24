import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // <<< --- 1. IMPORTAR Router
import { AuthService, AuthResponseData } from '../../services/auth.service'; // <<< --- 2. IMPORTAR AuthService y AuthResponseData
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true, // <<< --- ASEGÚRATE DE QUE ESTA LÍNEA ESTÉ
  imports: [
    CommonModule,        // <<< --- Y ESTE ARRAY 'imports' CON ESTOS MÓDULOS
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss' // o styleUrls
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginErrorMessage: string | null = null; // <<< --- 3. PROPIEDAD PARA MENSAJES DE ERROR

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // <<<--- 4. INYECTAR AuthService
    private router: Router            // <<<--- 5. INYECTAR Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.loginErrorMessage = null; // Limpiar errores previos al intentar de nuevo

    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      // Llamamos al servicio de autenticación
      this.authService.login(credentials).subscribe({
        next: (response: AuthResponseData) => {
          // Login exitoso
          console.log('Login exitoso!', response);

          if (response.token) {
            localStorage.setItem('authToken', response.token);
            console.log('LoginComponent: authToken guardado en localStorage.');
          } else {
            console.error('LoginComponent: No se recibió token en la respuesta.');
          }

          if (response.user) { // VERIFICA SI response.user EXISTE
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            // --- ESTOS LOGS SON ÚTILES PARA LA PRUEBA ---
            console.log('LoginComponent: currentUser guardado en localStorage:', localStorage.getItem('currentUser'));
            console.log('LoginComponent: Objeto user que se intentó guardar:', response.user);
            // ------------------------------------------
          } else {
            console.error('LoginComponent: No se recibió el objeto user en la respuesta del backend.');
            localStorage.removeItem('currentUser'); // Limpiar por si acaso
          }
          
          // Guardar el token (por ejemplo, en localStorage)
          localStorage.setItem('authToken', response.token);

          // Opcional: guardar datos del usuario si los necesitas globalmente de inmediato
         localStorage.setItem('currentUser', JSON.stringify(response.user));
          // (Más adelante podríamos usar un servicio de estado para esto)

          // Redirigir a la página principal
          this.router.navigate(['/']); // Navega a la ruta raíz (tu página principal)

        },
        error: (errorResponse) => {
          // Error en el login
          console.error('Error en el login:', errorResponse);
          if (errorResponse.status === 401) {
            this.loginErrorMessage = 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
          } else if (errorResponse.error && errorResponse.error.message) {
            this.loginErrorMessage = errorResponse.error.message;
          } else {
            this.loginErrorMessage = 'Error al intentar iniciar sesión. Por favor, inténtalo más tarde.';
          }
        }
      });
    } else {
      console.log('Formulario no válido. Por favor, revisa los campos.');
      // Si quieres forzar que se muestren los errores de los campos (si no lo hacen ya):
      this.loginForm.markAllAsTouched();
      this.loginErrorMessage = 'Por favor, completa todos los campos correctamente.';
    }
  }
}
