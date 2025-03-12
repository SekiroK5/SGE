import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActividadesService, Actividad } from '../Services/actividad.service';

@Component({
  selector: 'app-actividades',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css']
})
export class ActividadesComponent implements OnInit {
  actividades: Actividad[] = [];
  loading = true;
  error = '';
  
  // Filtros
  filtroEstado: 'todos' | 'pendiente' | 'en progreso' | 'completada' | 'cancelada' = 'todos';
  filtroPrioridad: 'todos' | 'baja' | 'media' | 'alta' = 'todos';
  busqueda: string = '';

  // Variable para controlar el modo de demostración
  modoDemostracion = false;

  constructor(
    private actividadesService: ActividadesService
  ) {}

  ngOnInit(): void {
    this.cargarActividades();
  }

  cargarActividades(): void {
    this.loading = true;
    
    if (this.modoDemostracion) {
      // Datos de ejemplo para el frontend mientras no hay backend
      setTimeout(() => {
        this.actividades = [
          {
            _id: '1',
            nombre: 'Capacitación de seguridad',
            descripcion: 'Capacitación obligatoria sobre protocolos de seguridad en el trabajo',
            fechaInicio: new Date('2025-03-15'),
            fechaFin: new Date('2025-03-20'),
            estado: 'pendiente',
            prioridad: 'alta'
          },
          {
            _id: '2',
            nombre: 'Actualización de documentación',
            descripcion: 'Actualizar manuales de procedimientos internos',
            fechaInicio: new Date('2025-03-10'),
            fechaFin: new Date('2025-03-25'),
            estado: 'en progreso',
            prioridad: 'media'
          },
          {
            _id: '3',
            nombre: 'Evaluación de desempeño',
            descripcion: 'Realizar evaluaciones trimestrales de desempeño',
            fechaInicio: new Date('2025-03-01'),
            fechaFin: new Date('2025-03-14'),
            estado: 'completada',
            prioridad: 'alta'
          }
        ];
        this.loading = false;
      }, 1000);
    } else {
      // Llamada real al servicio
      this.actividadesService.getActividades().subscribe({
        next: (data) => {
          this.actividades = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar actividades: ' + err.message;
          this.loading = false;
          
          // Si falla la conexión con el backend, podemos activar el modo demostración
          if (err.status === 0) {
            console.warn('No se pudo conectar con el backend. Activando modo demostración.');
            this.modoDemostracion = true;
            this.cargarActividades();
          }
        }
      });
    }
  }

  actividadesFiltradas(): Actividad[] {
    return this.actividades.filter(actividad => {
      // Filtrar por estado
      if (this.filtroEstado !== 'todos' && actividad.estado !== this.filtroEstado) {
        return false;
      }
      
      // Filtrar por prioridad
      if (this.filtroPrioridad !== 'todos' && actividad.prioridad !== this.filtroPrioridad) {
        return false;
      }
      
      // Filtrar por término de búsqueda
      if (this.busqueda && !actividad.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) && 
          !actividad.descripcion.toLowerCase().includes(this.busqueda.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'estado-pendiente';
      case 'en progreso': return 'estado-progreso';
      case 'completada': return 'estado-completada';
      case 'cancelada': return 'estado-cancelada';
      default: return '';
    }
  }

  getPrioridadClass(prioridad: string): string {
    switch (prioridad) {
      case 'baja': return 'prioridad-baja';
      case 'media': return 'prioridad-media';
      case 'alta': return 'prioridad-alta';
      default: return '';
    }
  }
}