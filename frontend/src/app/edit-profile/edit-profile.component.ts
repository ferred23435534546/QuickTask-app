//src/app/edit-profile/edit-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// --- 1. IMPORTA AuthService, UserData y las NUEVAS interfaces ---
import { 
    AuthService, 
    UserData, 
    UserProfileResponse, 
    ProfileData, 
    ChangePasswordPayload, 
    ChangePasswordResponse  
} from '../services/auth.service';
// Interface for profile data (la que tenías)
interface UserProfileFormData {
  nombre: string | null;
  email: string | null;
  telefono?: string | null;
  fotoUrl?: string | null;
  descripcion?: string | null;     // <<< Campo de la tabla profiles
  location_zone?: string | null;   // <<< Campo de la tabla profiles
  // ... (habilidades, experiencia, etc., que ya tenías y coinciden con ProfileData)
  habilidades?: string[] | null;
  experiencia?: string | null;
  categoriasServicio?: string[] | null;
  zonaTrabajo?: string | null; // Este podría ser location_zone
  disponibilidad?: string | null;
  notificacionesActivas?: boolean | null;
}

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})

export class EditProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup; // Mantienes tu passwordForm

  availableCategories: string[] = ['Limpieza', 'Fontanería', 'Electricidad', 'Clases de Matemáticas', 'Clases de Idiomas', 'Cuidado de Niños', 'Cuidado de Mayores'];
  availableSkills: string[] = ['Wordpress', 'SEO', 'Diseño Gráfico', 'Redacción Creativa'];

  isLoading: boolean = true; // Para mostrar un indicador de carga (opcional)
  profileErrorMessage: string | null = null; // Para errores al cargar el perfil
  
    passwordChangeErrorMessage: string | null = null;
  passwordChangeSuccessMessage: string | null = null;
  // --- 3. INYECTA AuthService en el constructor ---
  constructor(
    private fb: FormBuilder,
    private authService: AuthService // <--- AÑADE ESTO
  ) { }

  ngOnInit(): void {
    // Inicializa profileForm (esta parte se ve bien)
    this.profileForm = this.fb.group({
      nombre: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      telefono: [''],
      fotoUrl: [''],
      descripcion: [''],
      location_zone: [''],
      habilidades: [[]],
      experiencia: [''],
      categoriasServicio: [[]],
      disponibilidad: [''],
      notificacionesActivas: [true]
    });

    // Inicializa passwordForm CON SUS CONTROLES DEFINIDOS
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required], // <<<--- DEFINE ESTE CONTROL
      newPassword: ['', [Validators.required, Validators.minLength(6)]], // <<<--- DEFINE ESTE CONTROL
      confirmPassword: ['', Validators.required] // <<<--- DEFINE ESTE CONTROL
    }, { validator: this.passwordMatchValidator }); // El validador de grupo está bien aquí

    // Llama a loadUserProfile para rellenar profileForm
    this.loadUserProfile();
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.profileErrorMessage = null;
    this.authService.getUserProfile().subscribe({
      next: (profileResponse: UserProfileResponse) => {
        console.log('EditProfileComponent: Perfil completo recibido:', profileResponse);
        // Rellenamos el formulario con los datos del usuario y su perfil
        this.profileForm.patchValue({
          nombre: profileResponse.name,
          email: profileResponse.email,
          // Datos de la tabla 'profiles' (si existen)
          telefono: profileResponse.profile?.phone_number || '',
          fotoUrl: profileResponse.profile?.profile_picture_url || '',
          descripcion: profileResponse.profile?.description || '',
          location_zone: profileResponse.profile?.location_zone || '',
          habilidades: profileResponse.profile?.habilidades || [],
          experiencia: profileResponse.profile?.experiencia || '',
          categoriasServicio: profileResponse.profile?.categoriasServicio || [],
          disponibilidad: profileResponse.profile?.disponibilidad || '',
          // notificacionesActivas: profileResponse.profile?.notificacionesActivas ?? true // O como manejes este campo
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('EditProfileComponent: Error al cargar el perfil del usuario:', err);
        this.profileErrorMessage = 'No se pudo cargar la información del perfil. Inténtalo de nuevo más tarde.';
        if (err.status === 401 || err.status === 403) {
          this.profileErrorMessage = 'No estás autorizado para ver este perfil.';
          // Aquí podrías redirigir al login si el token expiró, etc.
          // this.authService.logout();
          // this.router.navigate(['/login']);
        }
        this.isLoading = false;
      }
    });
  }

  // Tu método onProfileSubmit (por ahora solo loguea)
  onProfileSubmit(): void {
    if (this.profileForm.valid) {
      console.log('Profile data to save:', this.profileForm.getRawValue()); // Usar getRawValue() para incluir campos deshabilitados
      alert('Funcionalidad de guardar perfil aún no implementada.');
    }
  }


  
  // --- MÉTODO onPasswordSubmit CORRECTO (solo debe haber UNO con este nombre) ---
  onPasswordSubmit(): void {
    this.passwordChangeErrorMessage = null;
    this.passwordChangeSuccessMessage = null;

    if (this.passwordForm.valid) {
      const payload: ChangePasswordPayload = {
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword
      };

      console.log('EditProfileComponent: Enviando datos para cambiar contraseña:', payload);

      this.authService.changePassword(payload).subscribe({
        next: (response: ChangePasswordResponse) => {
          console.log('EditProfileComponent: Contraseña cambiada con éxito!', response);
          this.passwordChangeSuccessMessage = response.message || '¡Contraseña actualizada exitosamente!';
          this.passwordForm.reset(); 
        },
        error: (errorResponse) => {
          console.error('EditProfileComponent: Error al cambiar la contraseña:', errorResponse);
          if (errorResponse.error && errorResponse.error.message) {
            this.passwordChangeErrorMessage = errorResponse.error.message;
          } else if (errorResponse.status === 401) { 
            this.passwordChangeErrorMessage = 'La contraseña actual que has introducido es incorrecta.';
          } else {
            this.passwordChangeErrorMessage = 'Error al intentar cambiar la contraseña. Por favor, inténtalo más tarde.';
          }
        }
      });
    } else {
      console.log('EditProfileComponent: Formulario de cambio de contraseña no válido.');
      this.passwordForm.markAllAsTouched();
      this.passwordChangeErrorMessage = 'Por favor, completa todos los campos correctamente y asegúrate de que las nuevas contraseñas coincidan.';
    }
  }
  // --- FIN DEL ÚNICO MÉTODO onPasswordSubmit ---
  

  // Tu método onFileSelected (sin cambios por ahora)
  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      console.log('File selected:', file.name);
    }
  }
  
}