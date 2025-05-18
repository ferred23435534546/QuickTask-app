import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface BlogPost {
  title: string;
  content: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  author?: string;
  date?: Date;
  readTime?: string;
}

@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.scss']
})
export class BlogPageComponent implements OnInit {
  postForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      content: ['', [Validators.required]],
      tags: [''],
      image: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.postForm.valid) {
      const formData = this.postForm.value;
      
      // Convertir las etiquetas de string a array
      const tags = formData.tags.split(',').map((tag: string) => tag.trim());
      
      const newPost: BlogPost = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: tags,
        author: 'Usuario Actual', // Esto debería venir del servicio de autenticación
        date: new Date(),
        readTime: this.calculateReadTime(formData.content)
      };

      // Aquí iría la lógica para guardar la imagen y obtener su URL
      if (formData.image) {
        // Implementar lógica de carga de imagen
        // newPost.imageUrl = URL de la imagen subida
      }

      console.log('Nueva entrada de blog:', newPost);
      // Aquí iría la llamada al servicio para guardar el post
      this.postForm.reset();
    }
  }

  private calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} minutos`;
  }
}