import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Task } from '../interfaces/task.interface';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  task: any = null;
  isLoading = true;
  errorMessage: string | null = null;
  isClosed = false;

  constructor(private route: ActivatedRoute, private taskService: TaskService) {}

  ngOnInit() {
    const taskId = this.route.snapshot.params['id'];
    this.isLoading = true;
    this.taskService.getTaskById(taskId).subscribe({
      next: (task) => {
        this.task = task;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar la tarea.';
        this.isLoading = false;
      }
    });
  }

  goBack() {
    window.history.back();
  }

  onSelectTask() {
    this.isClosed = true;
  }
} 