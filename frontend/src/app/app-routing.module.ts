import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component'

const routes: Routes = [
  { path: '', component: HomeComponent }, // Esta línea conecta la URL raíz con tu componente
  { path: 'edit-profile', component: EditProfileComponent } 
  // Puedes añadir más rutas después
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
