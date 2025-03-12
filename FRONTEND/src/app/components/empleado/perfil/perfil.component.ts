import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Empleado {
  id?: string;
  nombre?: string;
  cargo?: string;
  departamento?: string;
  sede?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  fechaIngreso?: Date;
  supervisor?: string;
  tipoContrato?: string;
  estado?: string;
  resumen?: string;
  foto?: string;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PerfilComponent implements OnInit {
  empleadoId: string | null = null;
  empleado: Empleado | null = null;
  
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.empleadoId = params.get('id');
      this.loadEmpleadoData();
    });
  }

  loadEmpleadoData(): void {
    // In a real application, you would call a service to get the data
    // For now, we'll use mock data
    setTimeout(() => {
      this.empleado = {
        id: this.empleadoId || '12345',
        nombre: 'Juan Pérez',
        cargo: 'Desarrollador Senior',
        departamento: 'Tecnología',
        sede: 'Madrid',
        email: 'juan.perez@empresa.com',
        telefono: '+34 612 345 678',
        direccion: 'Calle Principal 123, Madrid',
        fechaIngreso: new Date('2020-03-15'),
        supervisor: 'María García',
        tipoContrato: 'Indefinido',
        estado: 'Activo',
        resumen: 'Desarrollador con más de 5 años de experiencia en desarrollo web y aplicaciones móviles. Especializado en Angular y tecnologías front-end. Graduado en Ingeniería Informática.'
      };
    }, 500);
  }

  getInitials(): string {
    if (this.empleado?.nombre) {
      return this.empleado.nombre
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return 'EM';
  }
}