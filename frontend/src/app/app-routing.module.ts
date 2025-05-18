import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Asumo que está en src/app/home/home.component
import { EditProfileComponent } from './edit-profile/edit-profile.component'; // Asumo que está en src/app/edit-profile/edit-profile.component
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { BlogPageComponent } from './blog-page/blog-page.component';
import { CreateTaskComponent } from './create-task/create-task.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'blog', component: BlogPageComponent },
  { path: 'blog-page', component: BlogPageComponent },
  { path: 'create-task', component: CreateTaskComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
