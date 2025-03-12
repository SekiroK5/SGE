import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Empleado {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  departamento: string;
  puesto: string;
  fechaContratacion: Date;
  salario: number;
  activo: boolean;
}

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class EmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];
  filteredEmpleados: Empleado[] = [];
  searchTerm: string = '';
  departamentos: string[] = [];
  filterDepartamento: string = '';
  loading: boolean = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEmpleados();
  }

  loadEmpleados(): void {
    this.loading = true;
    this.http.get<Empleado[]>('http://localhost:3000/auth/empleados')
      .subscribe({
        next: (data) => {
          this.empleados = data;
          this.filteredEmpleados = [...this.empleados];
          this.extractDepartamentos();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error cargando empleados:', err);
          this.error = 'Error al cargar empleados. Por favor intente de nuevo.';
          this.loading = false;
        }
      });
  }

  extractDepartamentos(): void {
    // Extract unique departments from employee data
    this.departamentos = [...new Set(this.empleados.map(emp => emp.departamento))];
  }

  searchEmpleados(): void {
    this.applyFilters();
  }

  filterByDepartamento(departamento: string): void {
    this.filterDepartamento = departamento;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterDepartamento = '';
    this.filteredEmpleados = [...this.empleados];
  }

  private applyFilters(): void {
    this.filteredEmpleados = this.empleados.filter(emp => {
      const matchesSearch = this.searchTerm ? 
        emp.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        emp.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(this.searchTerm.toLowerCase()) :
        true;
        
      const matchesDepartamento = this.filterDepartamento ? 
        emp.departamento === this.filterDepartamento : 
        true;
        
      return matchesSearch && matchesDepartamento;
    });
  }
}