import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // For reactive forms
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule

// Interface for profile data (optional but good practice)
interface UserProfile {
  nombre: string;
  email: string; // Assuming email is present and perhaps read-only on this form
  telefono?: string;
  fotoUrl?: string;
  // Worker-specific fields - adapt as needed based on your user roles
  habilidades?: string[];
  experiencia?: string;
  categoriasServicio?: string[];
  zonaTrabajo?: string;
  disponibilidad?: string; // Could be a more complex object or string
  // General settings
  notificacionesActivas: boolean;
}

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ], // Add ReactiveFormsModule
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  profileForm!: FormGroup;
  // Example categories - you would fetch these from a service or define them as needed
  availableCategories: string[] = ['Limpieza', 'Fontanería', 'Electricidad', 'Clases de Matemáticas', 'Clases de Idiomas', 'Cuidado de Niños', 'Cuidado de Mayores'];
  // Example skills - could be dynamically fetched or pre-defined
  availableSkills: string[] = ['Wordpress', 'SEO', 'Diseño Gráfico', 'Redacción Creativa'];


  // Placeholder for current user data - you would fetch this from a service
  currentUser: UserProfile = {
    nombre: 'Usuario Ejemplo',
    email: 'usuario@ejemplo.com',
    telefono: '123456789',
    notificacionesActivas: true,
    // Example worker data
    habilidades: ['SEO'],
    experiencia: '5 años de experiencia en marketing digital.',
    categoriasServicio: ['Clases de Idiomas'],
    zonaTrabajo: 'Almería Capital',
    disponibilidad: 'L-V Tardes'
  };

  // Placeholder for password change form
  passwordForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      nombre: [this.currentUser.nombre, Validators.required],
      telefono: [this.currentUser.telefono],
      fotoUrl: [this.currentUser.fotoUrl],
      // Worker-specific fields
      habilidades: [this.currentUser.habilidades || []],
      experiencia: [this.currentUser.experiencia || ''],
      categoriasServicio: [this.currentUser.categoriasServicio || []],
      zonaTrabajo: [this.currentUser.zonaTrabajo || ''],
      disponibilidad: [this.currentUser.disponibilidad || ''],
      // General settings
      notificacionesActivas: [this.currentUser.notificacionesActivas]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onProfileSubmit(): void {
    if (this.profileForm.valid) {
      console.log('Profile data to save:', this.profileForm.value);
      // Here you would call your service to save the profile data
      // e.g., this.userService.updateProfile(this.profileForm.value).subscribe(...);
      alert('Perfil actualizado con éxito!');
    }
  }

  onPasswordSubmit(): void {
    if (this.passwordForm.valid) {
      console.log('Password change data:', this.passwordForm.value);
      // Here you would call your service to change the password
      // e.g., this.authService.changePassword(this.passwordForm.value).subscribe(...);
      alert('Contraseña cambiada con éxito!');
      this.passwordForm.reset();
    }
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      console.log('File selected:', file.name);
      // Handle file upload logic here
      // For example, convert to base64 or send to a server and get URL back
      // And then this.profileForm.patchValue({ fotoUrl: 'url_del_servidor_o_base64' });
    }
  }
}