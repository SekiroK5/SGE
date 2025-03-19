import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpleadoService } from '../../Services/empleado.service';  // Asegúrate de importar el servicio
import { Empleado } from '../../Services/empleado.service';  // Importa la interfaz Empleado
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PerfilComponent implements OnInit {
  claveEmpleado: string | null = null;
  empleado: Empleado | null = null;
  loading = true;
  error: string | null = null;
  
  
  constructor(
    private route: ActivatedRoute,
    private empleadoService: EmpleadoService
  ) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.claveEmpleado = params.get('claveEmplead');
      if (this.claveEmpleado) {
        this.loadEmpleadoData();
      }
    });
  }

  loadEmpleadoData(): void {
    if (this.claveEmpleado) {
      this.empleadoService.getEmpleadoByClave(this.claveEmpleado).subscribe(
        (data) => {
          this.empleado = data;
          this.loading = false;
        },
        (error) => {
          this.error = 'Error al cargar los datos del empleado';
          this.loading = false;
        }
      );
    }
  }

  getInitials(): string {
    if (this.empleado?.Nombre) {
      return this.empleado.Nombre
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return 'EM';
  }
  
}
