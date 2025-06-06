import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Task, TaskCategory, TaskStatus, TaskUrgency } from '../interfaces/task.interface';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent {
  taskForm!: FormGroup;
  categories = [
    { label: 'Limpieza', value: TaskCategory.Limpieza },
    { label: 'Jardinería', value: TaskCategory.Jardineria },
    { label: 'Entrega', value: TaskCategory.Entrega },
    { label: 'Mudanza', value: TaskCategory.Mudanza },
    { label: 'Traducción', value: TaskCategory.Traduccion },
    { label: 'Otros', value: TaskCategory.Otros }
  ];
  urgencyLevels = [
    { label: 'Baja', value: TaskUrgency.Baja },
    { label: 'Media', value: TaskUrgency.Media },
    { label: 'Alta', value: TaskUrgency.Alta },
    { label: 'Inmediata', value: TaskUrgency.Inmediata }
  ];
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Lista de capitales de provincia de España
  cities: string[] = [
    'Álava', 'Albacete', 'Alicante', 'Almería', 'Ávila', 'Badajoz', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz',
    'Castellón', 'Ciudad Real', 'Córdoba', 'La Coruña', 'Cuenca', 'Gerona', 'Granada', 'Guadalajara', 'Guipúzcoa',
    'Huelva', 'Huesca', 'Islas Baleares', 'Jaén', 'León', 'Lérida', 'Lugo', 'Madrid', 'Málaga', 'Murcia',
    'Navarra', 'Orense', 'Asturias', 'Palencia', 'Las Palmas', 'Pontevedra', 'La Rioja', 'Salamanca', 'Segovia',
    'Sevilla', 'Soria', 'Tarragona', 'Santa Cruz de Tenerife', 'Teruel', 'Toledo', 'Valencia', 'Valladolid',
    'Vizcaya', 'Zamora', 'Zaragoza'
  ];

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.initForm();
  }

  private initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      category: ['', Validators.required],
      location: ['', Validators.required],
      budget: this.fb.group({
        amount: ['', [Validators.required, Validators.min(0)]],
        currency: ['EUR', Validators.required]
      }),
      dateNeeded: ['', Validators.required],
      requirements: [''],
      urgency: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log('Enviando tarea...');
    this.successMessage = null;
    this.errorMessage = null;
    if (this.taskForm.valid) {
      // Adaptar el objeto para que coincida con el backend
      const formValue = this.taskForm.value;
      const newTask = {
        title: formValue.title,
        description: formValue.description,
        category: formValue.category,
        location: formValue.location,
        budget: formValue.budget.amount, // Solo el número
        urgency: formValue.urgency,
        requirements: formValue.requirements,
        dateNeeded: formValue.dateNeeded,
        status: 'open' as 'open',
        userId: 1 // TODO: Reemplazar por el usuario real autenticado
      };
      this.taskService.createTask(newTask).subscribe({
        next: (task) => {
          this.successMessage = '¡Tarea creada con éxito!';
          this.taskForm.reset();
        },
        error: (err) => {
          this.errorMessage = 'Error al crear la tarea.';
        }
      });
    } else {
      this.markFormGroupTouched(this.taskForm);
    }
  }

  // Función auxiliar para marcar todos los campos como tocados
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
} 