import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home/home.component';
// Importamos el componente del dashboard de RH
import { DashboardComponent } from './components/rh/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Ruta predeterminada
  { path: 'home', component: HomeComponent },
  // Ruta para el dashboard de RH
  { path: 'rh/dashboard', component: DashboardComponent },
  // Rutas hijas para las secciones del dashboard de RH
  { path: 'rh/empleados', loadChildren: () => import('./components/rh/empleados/empleados.routes').then(r => r.EMPLEADOS_ROUTES) },
  { path: 'rh/edicion', loadChildren: () => import('./components/rh/empleados/edicion/edicion.routes').then(r => r.EDICION_ROUTES) },
  { path: 'rh/lista', loadChildren: () => import('./components/rh/empleados/lista/lista.routes').then(r => r.LISTA_ROUTES) },
  { path: 'rh/registro', loadChildren: () => import('./components/rh/empleados/registro/registro.routes').then(r => r.REGISTRO_ROUTES) },
  { path: '**', redirectTo: '' } // Redirección para rutas no encontradas
];