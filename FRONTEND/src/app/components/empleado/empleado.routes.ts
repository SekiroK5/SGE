import { Routes } from '@angular/router';
import { EmpleadoComponent } from './empleado.component';
import { EdicionEmpleadoComponent } from '../rh/empleados/edicion/edicion-empleado.component';

export const EMPLEADO_ROUTES: Routes = [
  { path: '', component: EmpleadoComponent },
  { path: ':claveEmpleado', component: EmpleadoComponent },
  { path: 'editar/:claveEmpleado', component: EdicionEmpleadoComponent },
  { path: 'perfil', loadChildren: () => import('./perfil/perfil.routes').then(r => r.PERFIL_ROUTES) },
  { path: 'actividades', loadChildren: () => import('./actividades/lista/lista-actividades.routes').then(r => r.LISTA_ACTIVIDADES_ROUTES) },
  { path: 'cursos', loadChildren: () => import('./cursos/lista/lista-cursos.routes').then(r => r.LISTA_CURSOS_ROUTES) }
];