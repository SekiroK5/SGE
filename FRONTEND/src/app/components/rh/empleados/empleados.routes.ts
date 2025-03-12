import { Routes } from '@angular/router';

export const EMPLEADOS_ROUTES: Routes = [
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: 'lista', loadChildren: () => import('./lista/lista.routes').then(r => r.LISTA_ROUTES) },
  { path: 'registro', loadChildren: () => import('./registro/registro.routes').then(r => r.REGISTRO_ROUTES) },
  { path: 'edicion', loadChildren: () => import('./edicion/edicion.routes').then(r => r.EDICION_ROUTES) }
];