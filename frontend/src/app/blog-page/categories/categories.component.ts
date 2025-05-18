import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  constructor(private router: Router) {}

  navigateToCategory(category: string) {
    this.router.navigate(['/blog/categories', category]);
  }
}
