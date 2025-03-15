import { Component, OnInit } from '@angular/core';
import { ParticipacionActividadService, ParticipacionActividad } from '../Services/actividad.service'; // Importa el servicio y la interfaz
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  actividades: ParticipacionActividad[] = [];  // Array para almacenar las actividades
  loading = true;  // Variable para mostrar el estado de carga
  error = '';  // Variable para almacenar errores

  constructor(private actividadesService: ParticipacionActividadService) {}

  ngOnInit(): void {
    this.cargarActividades();  // Llama al método para cargar las actividades cuando se inicializa el componente
  }

  // Método para cargar todas las actividades desde el servicio
  cargarActividades(): void {
    this.loading = true;
    this.actividadesService.getParticipaciones().subscribe(
      (data) => {
        this.actividades = data;  // Guarda los datos obtenidos en la propiedad actividades
        this.loading = false;  // Cambia el estado de carga a falso
      },
      (error) => {
        this.error = 'Error al cargar las actividades';  // Si ocurre un error, muestra un mensaje
        this.loading = false;  // Cambia el estado de carga a falso
      }
    );
  }
}
