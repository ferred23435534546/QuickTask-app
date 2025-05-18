import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
interface Post {
    id: string;
    title: string;
    content: string;
    date: Date | null;
    category: 'oferta' | 'actualidad' | 'derechos';
    author: string;
}
@Component({
    selector: 'app-blog-page',
    templateUrl: './blog-page.component.html',
    styleUrls: ['./blog-page.component.css'],
    providers: [DatePipe]
})
export class BlogPageComponent implements OnInit {
    posts: Post[] = [];  // Inicializa el array de posts
    search = '';
    categoryFilter = '';
    dateFilter: Date | undefined;
    categories = []; // Inicializa el array de categorías
    constructor(private datePipe: DatePipe) { }
    ngOnInit(): void {
        // Aquí puedes cargar los datos de las publicaciones desde una API o una fuente de datos local
    }
    filteredPosts(): Post[] {
      return [];
    }
}