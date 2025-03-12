import { Routes } from '@angular/router';
import { PerfilComponent } from './perfil.component';

export const PERFIL_ROUTES: Routes = [
  { path: '', component: PerfilComponent },
  { path: ':id', component: PerfilComponent }
];