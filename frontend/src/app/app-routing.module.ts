import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Asegúrate de crear este componente si no existe
import { BlogPageComponent } from './blog-page/blog-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'blog', component: BlogPageComponent },
  // Puedes añadir más rutas aquí
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }