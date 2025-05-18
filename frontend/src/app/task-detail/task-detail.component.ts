import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Task } from '../interfaces/task.interface';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const taskId = this.route.snapshot.params['id'];
    // Simulamos obtener la tarea del array de tareas
    this.task = {
      id: taskId,
      title: `Tarea ${taskId}`,
      description: 'Esta es una descripción detallada de la tarea que incluye todos los detalles necesarios para que los usuarios puedan entender exactamente lo que se necesita hacer.',
      category: 'Limpieza',
      location: 'Centro',
      budget: 50,
      createdAt: new Date(),
      status: 'open',
      userId: 'user1'
    };
  }
} 