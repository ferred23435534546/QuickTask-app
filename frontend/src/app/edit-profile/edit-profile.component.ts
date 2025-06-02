import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
    EditService,
    UserProfileResponse,
    UpdateProfilePayload,
    ChangePasswordPayload,
    ChangePasswordResponse,
    ProfileData
} from '../services/edit.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-edit-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
    profileForm!: FormGroup;
    passwordForm!: FormGroup;

    isLoading: boolean = true;
    profileErrorMessage: string | null = null;
    passwordChangeErrorMessage: string | null = null;
    passwordChangeSuccessMessage: string | null = null;
    profileUpdateSuccessMessage: string | null = null;
    profileUpdateErrorMessage: string | null = null;
    currentUserRole: string | null = null;

    // **NUEVA PROPIEDAD PARA ALMACENAR LOS VALORES DEL USUARIO**
    userProfile: UserProfileResponse | null = null;

    constructor(
        private fb: FormBuilder,
        private editService: EditService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.profileForm = this.fb.group({
            nombre: ['', Validators.required],
            email: [{ value: '', disabled: true }],
            telefono: [''],
            ubi: [''],
            role: ['client', Validators.required]
        });

        this.passwordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validator: this.passwordMatchValidator });

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
        this.editService.getUserProfile().subscribe({
            next: (response: UserProfileResponse) => {
                console.log('Perfil recibido:', response);
                this.currentUserRole = response.role;
                this.userProfile = response; // **GUARDAMOS LA RESPUESTA COMPLETA**
                this.profileForm.patchValue({
                    nombre: response.name,
                    email: response.email,
                    telefono: response.profile?.phone_number || response.phone || '',
                    ubi: response.profile?.location_zone || response.location || '',
                    role: response.role || 'client'
                });
                this.isLoading = false;
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error al cargar el perfil:', err);
                this.profileErrorMessage = err.error?.message || err.message || 'No se pudo cargar la información del perfil.';
                this.isLoading = false;
            }
        });
    }

    onProfileSubmit(): void {
        this.profileUpdateErrorMessage = null;
        this.profileUpdateSuccessMessage = null;

        if (this.profileForm.valid) {
            const formData = this.profileForm.getRawValue();

            const payload: UpdateProfilePayload = {
                name: formData.nombre,
                phone: formData.telefono || null,
                location: formData.ubi || null,
                role: formData.role,
                profile: {
                    phone_number: formData.telefono || null,
                    location_zone: formData.ubi || null,
                }
            };

            console.log('Datos del perfil a guardar:', payload);

            this.editService.updateUserProfile(payload).subscribe({
                next: (response: UserProfileResponse) => {
                    console.log('Perfil actualizado con éxito!', response);
                    this.profileUpdateSuccessMessage = response.message || '¡Perfil actualizado con éxito!';

                    // **ACTUALIZAMOS userProfile CON LOS DATOS DEL FORMULARIO**
                    if (this.userProfile) {
                        this.userProfile.phone = formData.telefono || null;
                        this.userProfile.location = formData.ubi || null;
                        this.userProfile.role = formData.role;
                        if (this.userProfile.profile) {
                            this.userProfile.profile.phone_number = formData.telefono || null;
                            this.userProfile.profile.location_zone = formData.ubi || null;
                        }
                    }

                    // ACTUALIZAR currentUser en localStorage si existe
                    const currentUserStr = localStorage.getItem('currentUser');
                    if (currentUserStr) {
                        try {
                            const currentUser = JSON.parse(currentUserStr);
                            currentUser.role = formData.role;
                            localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        } catch (e) {
                            // Si hay error, no hacemos nada
                        }
                    }
                },
                error: (errorResponse: HttpErrorResponse) => {
                    console.error('Error al actualizar el perfil:', errorResponse);
                    this.profileUpdateErrorMessage = errorResponse.error?.message || errorResponse.message || 'Error al guardar. Inténtalo más tarde.';
                }
            });
        } else {
            this.profileUpdateErrorMessage = 'Por favor, revisa que todos los campos estén correctos.';
            this.profileForm.markAllAsTouched();
        }
    }

    onPasswordSubmit(): void {
        this.passwordChangeErrorMessage = null;
        this.passwordChangeSuccessMessage = null;

        if (this.passwordForm.valid) {
            const payload: ChangePasswordPayload = {
                currentPassword: this.passwordForm.value.currentPassword,
                newPassword: this.passwordForm.value.newPassword
            };
            this.editService.changePassword(payload).subscribe({
                next: (response: ChangePasswordResponse) => {
                    this.passwordChangeSuccessMessage = response.message || '¡Contraseña actualizada exitosamente!';
                    this.passwordForm.reset();
                },
                error: (errorResponse: HttpErrorResponse) => {
                    this.passwordChangeErrorMessage = errorResponse.error?.message || errorResponse.message || 'Error al cambiar la contraseña.';
                }
            });
        } else {
            this.passwordChangeErrorMessage = 'Formulario inválido.';
            this.passwordForm.markAllAsTouched();
        }
    }

    handleLogout(): void {
        this.editService.logout();
        this.router.navigate(['/login']);
    }

    onFileSelected(event: Event): void {
        const element = event.currentTarget as HTMLInputElement;
        let fileList: FileList | null = element.files;
        if (fileList && fileList.length > 0) {
            const file = fileList[0];
            console.log('File selected:', file.name);
        }
    }
}