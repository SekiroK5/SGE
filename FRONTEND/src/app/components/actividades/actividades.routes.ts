// actividades.routes.ts
import { Routes } from '@angular/router';

export const ACTIVIDADES_ROUTES: Routes = [
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: 'registro', loadChildren: () => import('./registro/registro-actividad.routes').then(r => r.REGISTRO_ACTIVIDAD_ROUTES) },
  { path: 'edicion', loadChildren: () => import('./edicion/edicion-actividad.routes').then(r => r.EDICION_ACTIVIDAD_ROUTES) }
];