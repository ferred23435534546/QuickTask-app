import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Asumo que está en src/app/home/home.component
import { EditProfileComponent } from './edit-profile/edit-profile.component'; // Asumo que está en src/app/edit-profile/edit-profile.component
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { BlogPageComponent } from './blog-page/blog-page.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { CategoriesComponent } from './blog-page/categories/categories.component';
import { AuthorsComponent } from './blog-page/authors/authors.component';
import { AboutComponent } from './blog-page/about/about.component';
import { CategoryDetailComponent } from './blog-page/categories/category-detail/category-detail.component';
import { TaskBoardComponent } from './task-board/task-board.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'task-board', component: TaskBoardComponent},
  { 
    path: 'blog', 
    component: BlogPageComponent,
    children: [
      { path: 'categories', component: CategoriesComponent },
      { path: 'categories/:category', component: CategoryDetailComponent },
      { path: 'authors', component: AuthorsComponent },
      { path: 'about', component: AboutComponent },
      { path: '', redirectTo: 'categories', pathMatch: 'full' }
    ]
  },
  { path: 'create-task', component: CreateTaskComponent },
  { path: 'task/:id', component: TaskDetailComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
