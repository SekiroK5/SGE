import { Routes } from '@angular/router';
import { EmpleadoComponent } from './empleado.component';


export const EMPLEADO_ROUTES: Routes = [
  { path: '', component: EmpleadoComponent },
  { path: ':claveEmpleado', component: EmpleadoComponent }, // Cambiado de EdicionEmpleadoComponent a EmpleadoEdicionComponent
  { path: 'perfil', loadChildren: () => import('./perfil/perfil.routes').then(r => r.PERFIL_ROUTES) },
  { path: 'actividades', loadChildren: () => import('./actividades/lista/lista-actividades.routes').then(r => r.LISTA_ACTIVIDADES_ROUTES) },
  { path: 'cursos', loadChildren: () => import('./cursos/lista/lista-cursos.routes').then(r => r.LISTA_CURSOS_ROUTES) }
];