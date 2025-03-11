// components/rh/lista/lista.routes.ts
import { Routes } from '@angular/router';
import { ListaEmpleadosComponent } from './lista-empleados.component';

export const LISTA_ROUTES: Routes = [
  { path: '', component: ListaEmpleadosComponent }
];

export default LISTA_ROUTES;