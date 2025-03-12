import { Routes } from '@angular/router';
import { EdicionCursoComponent } from './edicion-curso.component';

export const EDICION_CURSO_ROUTES: Routes = [
  { path: '', component: EdicionCursoComponent },
  { path: ':id', component: EdicionCursoComponent }
];