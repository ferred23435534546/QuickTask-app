import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Task, TaskCategory, TaskStatus, TaskUrgency } from '../interfaces/task.interface';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent {
  taskForm!: FormGroup;
  categories = Object.values(TaskCategory);
  urgencyLevels = Object.values(TaskUrgency);

  constructor(private fb: FormBuilder) {
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
    if (this.taskForm.valid) {
      const newTask: Partial<Task> = {
        ...this.taskForm.value,
        status: TaskStatus.Publicada,
        dateCreated: new Date(),
        views: 0,
        applications: 0,
        author: {
          id: 1, // Este valor vendría del servicio de autenticación
          name: 'Usuario Actual', // Este valor vendría del servicio de autenticación
          rating: 0
        }
      };

      // Aquí iría la lógica para enviar la tarea al backend
      console.log('Nueva tarea creada:', newTask);
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