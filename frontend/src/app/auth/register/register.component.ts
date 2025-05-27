// src/app/auth/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterPayload, RegisterResponseData } from '../../services/auth.service'; // Asegúrate que RegisterPayload y RegisterResponseData estén importados

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  registerErrorMessage: string | null = null;
  registrationSuccessMessage: string | null = null; // Para mensaje de éxito

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['client', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.registerErrorMessage = null; 
    this.registrationSuccessMessage = null;

    if (this.registerForm.valid) {
      // Extraemos los valores del formulario, excluyendo confirmPassword
      // y preparando el objeto según la interfaz RegisterPayload
      const payload: RegisterPayload = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        role: this.registerForm.value.role
      };

      console.log('Enviando datos de registro al backend:', payload);
      console.log('FRONTEND (RegisterComponent): Enviando este payload para registrar:', payload);

      this.authService.register(payload).subscribe({
        next: (response: RegisterResponseData) => {
          console.log('Registro exitoso!', response);
          this.registrationSuccessMessage = `${response.message} Ahora puedes iniciar sesión.`;

          // Esperar un momento para que el usuario vea el mensaje de éxito y luego redirigir
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);

        },
        error: (errorResponse) => {
          console.error('Error en el registro:', errorResponse);
          if (errorResponse.error && errorResponse.error.message) {
            this.registerErrorMessage = errorResponse.error.message; // Mensaje de error del backend
          } else if (errorResponse.status === 409) { // Conflicto - Email ya en uso (tu backend podría devolver 409)
            this.registerErrorMessage = 'Este correo electrónico ya está en uso. Por favor, intenta con otro.';
          }
          else {
            this.registerErrorMessage = 'Error al intentar registrar. Por favor, inténtalo más tarde.';
          }
        }
      });

    } else {
      console.log('Formulario de registro no válido.');
      this.registerForm.markAllAsTouched(); // Marca todos los campos para mostrar errores de validación
      this.registerErrorMessage = 'Por favor, completa todos los campos correctamente y asegúrate de que las contraseñas coincidan.';
    }
  }
}