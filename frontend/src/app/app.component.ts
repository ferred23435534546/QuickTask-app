// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <<< --- AÑADE ESTA IMPORTACIÓN

@Component({
  selector: 'app-root',
  standalone: true, // <<< --- ASEGÚRATE DE QUE ESTA LÍNEA ESTÉ Y SEA TRUE
  imports: [
    RouterModule    // <<< --- AÑADE RouterModule AQUÍ (para router-outlet)
    // CommonModule si usas *ngIf, *ngFor, etc. directamente en app.component.html
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // o styleUrl
})
export class AppComponent {
  title = 'quicktask-frontend';
}