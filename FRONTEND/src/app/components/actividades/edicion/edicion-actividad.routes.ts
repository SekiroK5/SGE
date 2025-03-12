// edicion.routes.ts
import { Routes } from '@angular/router';
import { EdicionActividadComponent } from './edicion-actividad.component';

export const EDICION_ACTIVIDAD_ROUTES: Routes = [
  { path: '', component: EdicionActividadComponent },
  { path: ':id', component: EdicionActividadComponent }
];