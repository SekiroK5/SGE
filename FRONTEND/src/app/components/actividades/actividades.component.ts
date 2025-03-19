import { Component, OnInit } from '@angular/core';
import { ParticipacionActividadService, ParticipacionActividad } from '../Services/actividad.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';  // Importar Router
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
  loading = true;
  error = '';

  constructor(
    private actividadesService: ParticipacionActividadService,
    private router: Router  // Inyectamos el Router para navegar
  ) {}

  ngOnInit(): void {
    this.cargarActividades();
  }

  cargarActividades(): void {
    this.loading = true;
    this.actividadesService.getParticipaciones().subscribe(
      (data) => {
        this.actividades = data;
        this.loading = false;
      },
      (error) => {
        this.error = 'Error al cargar las actividades';
        this.loading = false;
      }
    );
  }

  eliminarActividadTomada(id: string | undefined): void {
    if (!id) {
      this.error = 'ID de curso no válido';
      return;
    }

    this.actividadesService.deleteParticipacion(id).subscribe(
      () => {
        this.actividades = this.actividades.filter(actividad => actividad._id !== id);
        console.log(`La actividad tomada con id ${id} eliminada correctamente`);
      },
      (error) => {
        this.error = 'Error al eliminar la actividad';
      }
    );
  }

  // Función para redirigir al formulario de actualización con la claveEmpleado
  seleccionarActividad(claveEmpleado: string,nombrecompletoempleado:string): void {
    this.router.navigate([`actividades/edicion`, claveEmpleado, nombrecompletoempleado]);
  }
}
