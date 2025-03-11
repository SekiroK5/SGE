import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Empleado {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  departamento: string;
  posicion: string;
  fechaIngreso: string;
}

@Component({
  selector: 'app-lista-empleados',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './lista-empleados.component.html',
  styleUrls: ['./lista-empleados.component.css']
})
export class ListaEmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];
  loading: boolean = true;
  error: string = '';
  
  // Filtros
  nombreFiltro: string = '';
  departamentoFiltro: string = '';
  departamentos: string[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.http.get<Empleado[]>('api/empleados')
      .subscribe({
        next: (data) => {
          this.empleados = data;
          this.empleadosFiltrados = [...data];
          
          // Extraer departamentos únicos para el filtro
          this.departamentos = [...new Set(data.map(emp => emp.departamento))];
          
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar los empleados. Intente nuevamente.';
          this.loading = false;
          console.error(err);
        }
      });
  }

  aplicarFiltros(): void {
    this.empleadosFiltrados = this.empleados.filter(emp => {
      const nombreCompleto = `${emp.nombre} ${emp.apellido}`.toLowerCase();
      const nombreCoincide = this.nombreFiltro ? nombreCompleto.includes(this.nombreFiltro.toLowerCase()) : true;
      const departamentoCoincide = this.departamentoFiltro ? emp.departamento === this.departamentoFiltro : true;
      
      return nombreCoincide && departamentoCoincide;
    });
  }

  limpiarFiltros(): void {
    this.nombreFiltro = '';
    this.departamentoFiltro = '';
    this.empleadosFiltrados = [...this.empleados];
  }

  eliminarEmpleado(id: string): void {
    if (confirm('¿Está seguro que desea eliminar este empleado?')) {
      this.http.delete(`api/empleados/${id}`)
        .subscribe({
          next: () => {
            this.empleados = this.empleados.filter(emp => emp._id !== id);
            this.empleadosFiltrados = this.empleadosFiltrados.filter(emp => emp._id !== id);
          },
          error: (err) => {
            this.error = 'Error al eliminar el empleado. Intente nuevamente.';
            console.error(err);
          }
        });
    }
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }
}