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
  empleadoId: string | null = null;
  empleado: Empleado | null = null;
  loading = true;
  error: string | null = null;
  
  
  constructor(
    private route: ActivatedRoute,
    private empleadoService: EmpleadoService
  ) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.empleadoId = params.get('_id');
      if (this.empleadoId) {
        this.loadEmpleadoData();
      }
    });
  }

  loadEmpleadoData(): void {
    if (this.empleadoId) {
      this.empleadoService.getEmpleadoByClave(this.empleadoId).subscribe(
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
