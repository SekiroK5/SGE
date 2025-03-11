import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EmpleadosComponent } from './empleados.component';
import { EMPLEADOS_ROUTES } from './empleados.routes';

@NgModule({
  imports: [
    // Importar el componente standalone en lugar de declararlo
    EmpleadosComponent,
    RouterModule.forChild(EMPLEADOS_ROUTES)
  ]
})
export class EmpleadosModule { }