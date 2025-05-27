import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './auth/register/register.component';
import { CategoriesComponent } from './blog-page/categories/categories.component';
import { AuthorsComponent } from './blog-page/authors/authors.component';
import { AboutComponent } from './blog-page/about/about.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    RegisterComponent,
    CategoriesComponent,
    AuthorsComponent,
    AboutComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
})
export class AppModule { }