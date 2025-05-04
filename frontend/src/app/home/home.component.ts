import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Al principio del archivo

@Component({
  selector: 'app-home',
  standalone: true, // Asumiendo que es standalone
  imports: [ CommonModule ], // <--- Aquí
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  fechaActual = new Date(); 
  isSearchVisible: boolean = false;
  toggleSearch(): void {
    this.isSearchVisible = !this.isSearchVisible;
  }
}
