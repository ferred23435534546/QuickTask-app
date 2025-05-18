import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Al principio del archivo
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true, // Asumiendo que es standalone
  imports: [ CommonModule, RouterModule ], // <--- Aquí
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
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
