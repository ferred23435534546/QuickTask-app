import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Al principio del archivo
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Task } from '../interfaces/task.interface';
import { TaskService, TasksResponse } from '../services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  tasks: Task[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  fechaActual = new Date(); 
  isSearchVisible: boolean = false;
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 5;
  totalCount: number = 0;

  filterKeyword: string = '';
  filterCategory: string = '';

  constructor(private taskService: TaskService) {
    console.log('CONSTRUCTOR HOME');
    this.loadTasks();
    console.log('TAREAS RECIBIDAS:', this.tasks);
  }

  ngOnInit(): void {
    console.log('NGONINIT HOME');
    this.loadTasks();
  }

  loadTasks(page: number = 1): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.taskService.getTasks(page, this.limit, this.filterCategory, this.filterKeyword).subscribe({
      next: (response: TasksResponse) => {
        this.tasks = response.tasks;
        console.log('TAREAS RECIBIDAS:', this.tasks);
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalCount = response.totalCount;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar las tareas.';
        this.isLoading = false;
      }
    });
  }

  toggleSearch(): void {
    this.isSearchVisible = !this.isSearchVisible;
  }

  onPageChange(page: number): void {
    this.loadTasks(page);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadTasks(1);
  }

  get pages(): number[] {
    const visiblePages = 5;
    const pages: number[] = [];
    let start = Math.max(1, this.currentPage - Math.floor(visiblePages / 2));
    let end = Math.min(this.totalPages, start + visiblePages - 1);

    if (end - start + 1 < visiblePages) {
      start = Math.max(1, end - visiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
