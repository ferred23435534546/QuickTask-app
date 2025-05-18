// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser'; // Para arrancar componentes autónomos
import { AppComponent } from './app/app.component';       // Tu componente raíz autónomo
import { AppModule } from './app/app.module';           // Importaremos configuraciones desde aquí
import { importProvidersFrom } from '@angular/core';      // Para usar proveedores de NgModules existentes

// Opción de configuración de la aplicación.
// Usaremos importProvidersFrom(AppModule) para tomar las configuraciones
// importantes de AppModule (como AppRoutingModule, HttpClientModule, BrowserModule, etc.)
// y hacerlas disponibles para nuestra aplicación autónoma.
const appConfig = {
  providers: [
    importProvidersFrom(AppModule)
  ]
};

// Arrancamos AppComponent directamente con su configuración
bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));