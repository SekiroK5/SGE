import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home/home.component'; // Ajusta esta ruta según tu estructura de carpetas

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Ruta predeterminada
  { path: 'home', component: HomeComponent },
  // Aquí puedes agregar otras rutas según necesites
  { path: '**', redirectTo: '' } // Redirección para rutas no encontradas
];