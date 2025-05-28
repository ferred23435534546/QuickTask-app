// src/app/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Router ya lo tenías
import { FormsModule } from '@angular/forms';
import { Task } from '../interfaces/task.interface';
import { TaskService, TasksResponse } from '../services/task.service';
import { AuthService } from '../services/auth.service'; // Importa tu AuthService existente

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // ... (tus propiedades existentes: tasks, isLoading, etc.)
  isSearchVisible: boolean = false; // Ejemplo, ya la tienes

  constructor(
    private taskService: TaskService,
    private authService: AuthService, // Inyectado
    private router: Router            // Inyectado
  ) {
    // ... tu constructor actual
  }

  ngOnInit(): void {
    // ... tu ngOnInit actual
    this.loadTasks(); // loadTasks no necesita protección aquí si la página es visible por defecto
  }

  // Método privado para encapsular la lógica de chequeo y redirección
  private executeIfAuthenticated(action: () => void): void {
    if (this.authService.isAuthenticated()) {
      action();
    } else {
      this.authService.redirectToLogin(); // Usamos el método del servicio
    }
  }

  // Método para manejar navegación protegida
  navigateIfAuthenticated(path: any[] | string): void {
    this.executeIfAuthenticated(() => {
      if (typeof path === 'string') {
        this.router.navigate([path]);
      } else {
        this.router.navigate(path);
      }
    });
  }

  // --- Métodos de acción actualizados o nuevos ---
  toggleSearch(): void {
    // Si solo mostrar/ocultar no depende de estar logueado, pero la búsqueda sí:
    // this.isSearchVisible = !this.isSearchVisible;
    // Si el simple hecho de querer mostrar el input requiere login:
    this.executeIfAuthenticated(() => {
      this.isSearchVisible = !this.isSearchVisible;
    });
  }

  onSearch(): void {
    this.executeIfAuthenticated(() => {
      this.currentPage = 1;
      this.loadTasks(1);
    });
  }

  onPageChange(page: number): void {
    // Asumimos que si la página es visible, la paginación de las tareas visibles está bien,
    // pero si la carga de tareas en sí debe ser protegida (por si se accede a la página
    // y luego se desloguea en otra pestaña, por ejemplo), entonces sí proteger.
    // Por ahora, protegeremos la acción de cambiar de página.
    this.executeIfAuthenticated(() => {
       this.loadTasks(page);
    });
  }

  // Para <a (click)="navigateToHome()">Inicio</a>
  navigateToHome(): void {
    // Podrías querer que 'Inicio' siempre funcione o también protegerlo
    // this.router.navigate(['/']); // Sin protección
    this.navigateIfAuthenticated('/'); // Con protección
  }

  // Para <a (click)="navigateToEditProfile()">Perfil</a>
  navigateToEditProfile(): void {
    this.navigateIfAuthenticated('/edit-profile');
  }

  // Para <button (click)="navigateToCreateTask()">Comenzar</button>
  navigateToCreateTask(): void {
    this.navigateIfAuthenticated('/create-task');
  }

  // Para <button (click)="navigateToBlog()">Acceder</button> (al blog)
  navigateToBlog(): void {
    this.navigateIfAuthenticated('/blog');
  }

  // Para <button (click)="navigateToTaskDetail(task.id)">Ver</button>
  navigateToTaskDetail(taskId: string | number | undefined): void {
    if (taskId === undefined) {
        console.error('ID de tarea indefinido para la navegación');
        return;
    }
    this.navigateIfAuthenticated(['/task', taskId]);
  }

  // Para <button (click)="openTelegramLink()">Telegram</button>
  openTelegramLink(): void {
    this.executeIfAuthenticated(() => {
      window.open('https://t.me/QuickTaskHelperBot', '_blank');
    });
  }

  // ... (El resto de tus métodos como loadTasks, get pages, etc., se mantienen como están)
  // Asegúrate de que las propiedades como currentPage, totalPages, filterKeyword, etc., estén declaradas en la clase.
  // (He añadido algunas de ejemplo arriba, pero complétalas según tu código)
  tasks: Task[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 5;
  totalCount: number = 0;
  filterKeyword: string = '';
  filterCategory: string = '';
  // fechaActual = new Date(); // ya la tienes

  loadTasks(page: number = 1): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.taskService.getTasks(page, this.limit, this.filterCategory, this.filterKeyword).subscribe({
      next: (response: TasksResponse) => {
        this.tasks = response.tasks;
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

  get pages(): number[] {
    const visiblePages = 5;
    const pagesArray: number[] = []; // Renombrado para evitar conflicto con la propiedad de clase
    let start = Math.max(1, this.currentPage - Math.floor(visiblePages / 2));
    let end = Math.min(this.totalPages, start + visiblePages - 1);
    if (this.totalPages >= visiblePages && (end - start + 1 < visiblePages)) {
      start = Math.max(1, end - visiblePages + 1);
    }
    for (let i = start; i <= end; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }
}