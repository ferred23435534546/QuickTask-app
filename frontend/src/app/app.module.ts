import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    RegisterComponent   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppComponent,
    LoginComponent,      
    EditProfileComponent, 
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
})
export class AppModule { }