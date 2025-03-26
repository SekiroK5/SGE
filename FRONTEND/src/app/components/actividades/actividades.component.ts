import { Component, OnInit } from '@angular/core';
import { ParticipacionActividadService, ParticipacionActividad } from '../Services/actividad.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-actividades',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css']
})
export class ActividadesComponent implements OnInit {
  actividades: ParticipacionActividad[] = [];
  actividadesFiltradas: ParticipacionActividad[] = [];
  loading = true;
  error = '';
  
  // Variables para filtrado y búsqueda
  busqueda: string = '';
  filtroEstatus: string = 'todos'; // 'todos', 'pendientes', 'completadas'

  constructor(
    private actividadesService: ParticipacionActividadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarActividades();
  }

  cargarActividades(): void {
    this.loading = true;
    this.actividadesService.getParticipaciones().subscribe(
      (data) => {
        this.actividades = data;
        this.actividadesFiltradas = [...this.actividades];
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar las actividades:', error);
        this.error = 'Error al cargar las actividades';
        this.loading = false;
      }
    );
  }

  eliminarActividadTomada(id: string | undefined): void {
    if (!id) {
      this.error = 'ID de actividad no válido';
      return;
    }

    this.actividadesService.deleteParticipacion(id).subscribe(
      () => {
        this.actividades = this.actividades.filter(actividad => actividad._id !== id);
        this.actividadesFiltradas = this.actividadesFiltradas.filter(actividad => actividad._id !== id);
        console.log(`La actividad tomada con id ${id} eliminada correctamente`);
      },
      (error) => {
        console.error('Error al eliminar la actividad:', error);
        this.error = 'Error al eliminar la actividad';
      }
    );
  }

  seleccionarActividad(claveEmpleado: string, nombrecompletoempleado: string): void {
    this.router.navigate([`actividades/edicion`, claveEmpleado, nombrecompletoempleado]);
  }

  // Método corregido para cambiar el estado de una actividad
  cambiarEstado(actividad: ParticipacionActividad): void {
    if (!actividad._id) {
      this.error = 'ID de actividad no válido';
      return;
    }

    // Verificar que existe el array ParticipacionActividad y tiene elementos
    if (!actividad.ParticipacionActividad || actividad.ParticipacionActividad.length === 0) {
      this.error = 'La actividad no tiene información de participación';
      return;
    }

    // Crear una copia profunda del objeto para no modificar el original directamente
    const actividadActualizada = JSON.parse(JSON.stringify(actividad)) as ParticipacionActividad;

    // Cambiar el estado de la actividad
    actividadActualizada.ParticipacionActividad[0].Estatus = 
      !actividadActualizada.ParticipacionActividad[0].Estatus;

    // Enviar la actualización al backend
    this.actividadesService.updateParticipacion(actividad._id, actividadActualizada).subscribe(
      (respuesta) => {
        console.log('Actividad actualizada:', respuesta);
        
        // Actualizar la actividad en nuestras listas locales
        const index = this.actividades.findIndex(a => a._id === actividad._id);
        if (index !== -1) {
          this.actividades[index] = respuesta || actividadActualizada;
          this.aplicarFiltros(); // Volver a aplicar los filtros
        }
      },
      (error) => {
        console.error('Error al actualizar el estado de la actividad:', error);
        this.error = 'Error al actualizar el estado de la actividad';
      }
    );
  }

  // Método para aplicar filtros
  aplicarFiltros(): void {
    this.actividadesFiltradas = this.actividades.filter(actividad => {
      // Filtro por estado
      if (this.filtroEstatus !== 'todos') {
        const esCompletada = actividad.ParticipacionActividad?.[0]?.Estatus === true;
        if (this.filtroEstatus === 'pendientes' && esCompletada) return false;
        if (this.filtroEstatus === 'completadas' && !esCompletada) return false;
      }

      // Filtro por texto de búsqueda
      if (this.busqueda.trim() !== '') {
        const busquedaLowerCase = this.busqueda.toLowerCase();
        return (
          actividad.ClaveEmpleado?.toLowerCase().includes(busquedaLowerCase) ||
          actividad.NombreCompletoEmpleado?.toLowerCase().includes(busquedaLowerCase) ||
          actividad.ParticipacionActividad?.[0]?.NombreActividad?.toLowerCase().includes(busquedaLowerCase)
        );
      }

      return true;
    });
  }

  // Método para resetear los filtros
  resetearFiltros(): void {
    this.busqueda = '';
    this.filtroEstatus = 'todos';
    this.actividadesFiltradas = [...this.actividades];
  }
}