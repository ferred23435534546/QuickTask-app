import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor, etc.
import { RouterModule } from '@angular/router'; // Para routerLink, router-outlet, etc.
import { FormsModule } from '@angular/forms';   // Para ngModel, etc.
import { Task } from '../interfaces/task.interface';
import { TaskService, TasksResponse } from '../services/task.service';

@Component({
  selector: 'app-home',
  standalone: true, // <--- 1. Marcado como standalone
  imports: [
    CommonModule,   // <--- 2. Importa CommonModule para las directivas comunes
    RouterModule,   // <--- 3. Importa RouterModule si usas directivas de enrutamiento en la plantilla
    FormsModule     // <--- 4. Importa FormsModule si usas ngModel o formularios de plantilla
  ],
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
    // No es usual llamar a loadTasks() en el constructor si también se llama en ngOnInit.
    // Considera si es necesario en ambos sitios o si ngOnInit es suficiente.
    // Por ahora, lo mantengo como lo tenías.
    this.loadTasks();
    console.log('TAREAS RECIBIDAS CONSTRUCTOR:', this.tasks); // Añadido CONSTRUCTOR para diferenciar logs
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
        console.log('TAREAS RECIBIDAS LOADTASKS:', this.tasks); // Añadido LOADTASKS para diferenciar logs
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalCount = response.totalCount;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar las tareas.';
        console.error('Error en loadTasks:', err); // Es bueno loguear el error real
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
    this.currentPage = 1; // Reinicia a la primera página en una nueva búsqueda
    this.loadTasks(1);
  }

  get pages(): number[] {
    const visiblePages = 5;
    const pages: number[] = [];
    let start = Math.max(1, this.currentPage - Math.floor(visiblePages / 2));
    let end = Math.min(this.totalPages, start + visiblePages - 1);

    // Ajusta el inicio si el final es menor que el número de páginas visibles y hay suficientes páginas totales
    if (this.totalPages >= visiblePages && (end - start + 1 < visiblePages)) {
      start = Math.max(1, end - visiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
