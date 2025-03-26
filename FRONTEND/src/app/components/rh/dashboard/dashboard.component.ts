import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Module {
  name: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  modules: Module[] = [
    { name: 'Lista de Empleados', icon: 'people', route: '/rh/empleados/lista' },
    { name: 'Registrar Empleado', icon: 'person_add', route: '/rh/empleados/registro' },
    { name: 'Actividades Asignadas', icon: 'assignment', route: '/actividades' },
    { name: 'Asignar Actividad', icon: 'add_task', route: '/actividades/registro' },
    //{ name: 'Editar Actividad', icon: 'edit', route: '/actividades/edicion' },
    { name: 'Cursos de los Empleados', icon: 'school', route: '/cursos' },
    { name: 'Asignar Curso', icon: 'add_circle', route: '/cursos/registro' },
   // {name: 'Editar Curso', icon:'edit', route:'/cursos/edicion'},
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  getModuleDescription(moduleName: string): string {
    const descriptions: { [key: string]: string } = {
      'Lista de Empleados': 'Ver, buscar y gestionar todos los empleados registrados en el sistema.',
      'Registrar Empleado': 'Agregar un nuevo empleado al sistema con toda su información personal y laboral.',
      'Editar Empleado': 'Modificar la información de los empleados existentes en el sistema.',
      'Actividades': 'Visualizar todas las actividades disponibles en la organización.',
      'Asignar Actividad': 'Asignar actividades a nuevos empleados',
      'Registrar Actividad': 'Registrar y asignar actividades específicas a empleados o grupos de trabajo.',
      'Cursos de los Empleados': 'Permite observar los cursos donde han participado sus empleados',
       'Asignar Curso': 'Asignar cursos específicos a empleados según sus necesidades de desarrollo.'
      //'Editar Curso': 'Modificar la información de los cursos existentes dentro del sistema.',
     
    };

    return descriptions[moduleName] || 'Acceso a funcionalidad del módulo de recursos humanos.';
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}