import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Al principio del archivo
import { RouterModule } from '@angular/router';
import { Task } from '../interfaces/task.interface';

@Component({
  selector: 'app-home',
  standalone: true, // Asumiendo que es standalone
  imports: [ CommonModule, RouterModule ], // <--- Aquí
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  tasks: Task[] = [
    {
      id: '1',
      title: 'Tarea 1',
      description: 'Texto descriptivo para la primera tarea. Puede ser un poco más largo para probar el ajuste de texto.',
      category: 'Limpieza',
      location: 'Centro',
      createdAt: new Date(),
      status: 'open',
      userId: 'user1'
    },
    {
      id: '2',
      title: 'Tarea 2',
      description: 'Otro texto descriptivo para la segunda tarea, tal vez relacionado con jardinería.',
      category: 'Jardinería',
      location: 'Afueras',
      createdAt: new Date(),
      status: 'open',
      userId: 'user2'
    },
    {
      id: '3',
      title: 'Tarea 3',
      description: 'Descripción para la tercera tarea que podría ser más corta.',
      category: 'Entrega',
      location: 'Casco Antiguo',
      createdAt: new Date(),
      status: 'open',
      userId: 'user3'
    },
    {
      id: '4',
      title: 'Tarea 4 - Necesito ayuda para mover cajas',
      description: 'Busco a alguien fuerte para ayudar a mover cajas este sábado por la mañana durante aproximadamente 2 horas.',
      category: 'Ayuda con Mudanza',
      location: 'Distrito Norte',
      budget: 50,
      createdAt: new Date(),
      status: 'open',
      userId: 'user4'
    },
    {
      id: '5',
      title: 'Tarea 5 - Traducción urgente',
      description: 'Necesito una traducción de inglés a español de un documento corto, se necesita urgentemente para mañana.',
      category: 'Traducción',
      location: 'Remoto',
      budget: 30,
      createdAt: new Date(),
      status: 'open',
      userId: 'user5'
    }
  ];

  fechaActual = new Date(); 
  isSearchVisible: boolean = false;
  currentPage: number = 1;
  totalPages: number = 10;

  toggleSearch(): void {
    this.isSearchVisible = !this.isSearchVisible;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    // Aquí iría la lógica para cargar las tareas de la página seleccionada
    // Por ejemplo: this.loadTasks(page);
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
