import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home/home.component';
// Importamos el componente del dashboard de RH
import { DashboardComponent } from './components/rh/dashboard/dashboard.component';
import { LoginComponent } from './components/home/login/login.component';
import { ActividadesComponent } from './components/actividades/actividades.component';
import {EdicionActividadComponent} from './components/actividades/edicion/edicion-actividad.component'

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {path: 'login', component: LoginComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // Ruta para el dashboard de RH
  { path: 'rh/dashboard', component: DashboardComponent },
  { path: 'rh/empleados', loadChildren: () => import('./components/rh/empleados/empleados.routes').then(r => r.EMPLEADOS_ROUTES) },
  // Rutas para actividades
  { path: 'actividades', loadChildren: () => import('./components/actividades/actividades.routes').then(r => r.ACTIVIDADES_ROUTES) },
  { path: 'actividades/edicion', loadChildren: () => import('./components/actividades/edicion/edicion-actividad.routes').then(r => r.EDICION_ACTIVIDAD_ROUTES) },
  { path: 'actividades/registro', loadChildren: () => import('./components/actividades/registro/registro-actividad.routes').then(r => r.REGISTRO_ACTIVIDAD_ROUTES) },
  
  // Rutas para cursos
  { path: 'cursos', loadChildren: () => import('./components/cursos/cursos.routes').then(r => r.CURSOS_ROUTES) },
  { path: 'cursos/edicion', loadChildren: () => import('./components/cursos/edicion/edicion-curso.routes').then(r => r.EDICION_CURSO_ROUTES) },
  { path: 'cursos/registro', loadChildren: () => import('./components/cursos/registro/registro-curso.routes').then(r => r.REGISTRO_ROUTES) },
  
  // Rutas para empleado (individual)
  { path: 'empleado', loadChildren: () => import('./components/empleado/empleado.routes').then(r => r.EMPLEADO_ROUTES) },
  { path: 'empleado/actividades', loadChildren: () => import('./components/empleado/actividades/lista/lista-actividades.routes').then(r => r.LISTA_ACTIVIDADES_ROUTES) },
  { path: 'empleado/cursos', loadChildren: () => import('./components/empleado/cursos/lista/lista-cursos.routes').then(r => r.LISTA_CURSOS_ROUTES) },
  { path: 'empleado/perfil', loadChildren: () => import('./components/empleado/perfil/perfil.routes').then(r => r.PERFIL_ROUTES) },
  
  { path: '**', redirectTo: '' }, // Redirección para rutas no encontradas

  { path: 'actividades', component: ActividadesComponent },
  { path: 'actividad-update/:claveEmpleado', component: EdicionActividadComponent },  // Ruta para la actualización
  { path: '', redirectTo: '/actividades', pathMatch: 'full' }


];