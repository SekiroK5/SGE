import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  modules = [
    { name: 'Empleados', route: '/rh/empleados', icon: 'people' },
    { name: 'Registro', route: '/rh/registro', icon: 'person_add' },
    { name: 'Edición', route: '/rh/edicion', icon: 'edit' },
    { name: 'Lista', route: '/rh/lista', icon: 'list' }
  ];

  constructor() {}

  getModuleDescription(moduleName: string): string {
    switch(moduleName) {
      case 'Empleados':
        return 'Visualización y gestión completa de la plantilla de personal';
      case 'Registro':
        return 'Alta de nuevos empleados con generación automática de claves';
      case 'Edición':
        return 'Modificación de datos personales y profesionales';
      case 'Lista':
        return 'Consulta avanzada con múltiples criterios de búsqueda';
      default:
        return '';
    }
  }
}