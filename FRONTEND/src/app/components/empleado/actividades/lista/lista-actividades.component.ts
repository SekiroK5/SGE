// lista-actividades.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-actividades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-actividades.component.html',
  styleUrls: ['./lista-actividades.component.css']
})
export class ListaActividadesComponent implements OnInit {
  actividades: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Aquí cargarías las actividades desde un servicio
    this.actividades = [
      { id: 1, nombre: 'Actividad 1', descripcion: 'Descripción de la actividad 1', fecha: '2025-03-15' },
      { id: 2, nombre: 'Actividad 2', descripcion: 'Descripción de la actividad 2', fecha: '2025-03-20' },
      { id: 3, nombre: 'Actividad 3', descripcion: 'Descripción de la actividad 3', fecha: '2025-03-25' }
    ];
  }

  nuevaActividad(): void {
    this.router.navigate(['/actividades/registro']);
  }

  editarActividad(id: number): void {
    this.router.navigate(['/actividades/edicion', id]);
  }

  eliminarActividad(id: number): void {
    // Implementar lógica para eliminar actividad
    this.actividades = this.actividades.filter(actividad => actividad.id !== id);
  }
}