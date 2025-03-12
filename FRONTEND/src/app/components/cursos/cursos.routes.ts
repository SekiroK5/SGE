import { Routes } from '@angular/router';

export const CURSOS_ROUTES: Routes = [
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: 'registro', loadChildren: () => import('./registro/registro-curso.routes').then(r => r.REGISTRO_ROUTES) },
  { path: 'edicion', loadChildren: () => import('./edicion/edicion-curso.routes').then(r => r.EDICION_CURSO_ROUTES) }
];