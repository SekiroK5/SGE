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
    { name: 'Editar Empleado', icon: 'edit', route: '/rh/empleados/edicion' },
    { name: 'Actividades', icon: 'assignment', route: '/actividades' },
    { name: 'Crear Actividad', icon: 'add_task', route: '/actividades/registro' },
    //{ name: 'Editar Actividad', icon: 'edit', route: '/actividades/edicion' },
    { name: 'Registrar Actividad', icon: 'assignment_turned_in', route: '/actividades/registro' },
    { name: 'Cursos', icon: 'school', route: '/cursos' },
    { name: 'Crear Curso', icon: 'add_circle', route: '/cursos/registro' },
   // {name: 'Editar Curso', icon:'edit', route:'/cursos/edicion'},
    { name: 'Registrar Curso', icon: 'book', route: '/cursos/registro' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  getModuleDescription(moduleName: string): string {
    const descriptions: { [key: string]: string } = {
      'Lista de Empleados': 'Ver, buscar y gestionar todos los empleados registrados en el sistema.',
      'Registrar Empleado': 'Agregar un nuevo empleado al sistema con toda su información personal y laboral.',
      'Editar Empleado': 'Modificar la información de los empleados existentes en el sistema.',
      'Actividades': 'Visualizar todas las actividades disponibles en la organización.',
      'Crear Actividad': 'Diseñar y publicar una nueva actividad para los empleados.',
      'Registrar Actividad': 'Registrar y asignar actividades específicas a empleados o grupos de trabajo.',
      'Cursos': 'Gestionar el catálogo de cursos de capacitación disponibles.',
      'Crear Curso': 'Desarrollar un nuevo curso de formación para el personal.',
      //'Editar Curso': 'Modificar la información de los cursos existentes dentro del sistema.',
      'Registrar Curso': 'Registrar y asignar cursos específicos a empleados según sus necesidades de desarrollo.'
    };

    return descriptions[moduleName] || 'Acceso a funcionalidad del módulo de recursos humanos.';
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}