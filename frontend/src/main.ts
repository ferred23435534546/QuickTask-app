import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import '@angular/compiler';

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZone: 'zone.js',
  preserveWhitespaces: false
})
.catch(err => console.error(err));
