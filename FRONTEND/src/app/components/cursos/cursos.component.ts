import { Component, OnInit } from '@angular/core';
import { CursosTomadosService, CursosTomados } from '../Services/curso.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-lista-cursos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosTomadosComponent implements OnInit {
  cursostomados: CursosTomados[] = [];
  cursoEditando: CursosTomados | null = null;
  nuevaFechaInicio: string = '';
  nuevaFechaTermino: string = '';
  loading = true;
  error = '';
  successMessage = '';
  // Lista de cursos que ya han sido editados (solo para UI)
  cursosEditados: Set<string> = new Set<string>();

  constructor(
    private cursosTomadosService: CursosTomadosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCursosTomados();
  }

  cargarCursosTomados(): void {
    this.loading = true;
    this.cursosTomadosService.getCursosTomados().subscribe(
      (data) => {
        console.log('Cursos recibidos:', data);
        this.cursostomados = data;
        // Limpiar la lista de cursos editados cuando se recarga
        this.cursosEditados.clear();
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar los cursos:', error);
        this.error = 'Error al cargar los cursos';
        this.loading = false;
      }
    );
  }

  eliminarCurso(id: string | undefined): void {
    if (!id) {
      this.error = 'ID de curso no válido';
      return;
    }

    // Confirmar antes de eliminar
    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      this.cursosTomadosService.eliminarCursosTomados(id).subscribe(
        () => {
          this.cursostomados = this.cursostomados.filter(curso => curso._id !== id);
          this.successMessage = 'Curso eliminado correctamente';
          // Eliminar de la lista de cursos editados
          if (this.cursosEditados.has(id)) {
            this.cursosEditados.delete(id);
          }
          setTimeout(() => this.successMessage = '', 3000);
        },
        (error) => {
          console.error('Error al eliminar el curso:', error);
          this.error = 'Error al eliminar el curso';
          setTimeout(() => this.error = '', 5000);
        }
      );
    }
  }

  // Método para ir al dashboard
  irAlDashboard(): void {
    this.router.navigate(['/rh/dashboard']);
  }

  // Método para comprobar si un curso ya ha sido editado
  esCursoEditado(id: string | undefined): boolean {
    if (!id) return false;
    return this.cursosEditados.has(id);
  }

  // Método para comenzar a editar un curso (solo fechas)
  editarFechas(curso: CursosTomados): void {
    // Verificar si el curso ya ha sido editado
    if (curso._id && this.cursosEditados.has(curso._id)) {
      this.error = 'Este curso ya ha sido editado y no puede modificarse nuevamente';
      setTimeout(() => this.error = '', 5000);
      return;
    }
    
    this.cursoEditando = curso;
    
    // Si el curso tiene datos, preparamos las fechas para editarlas
    if (curso.CursosTomados && curso.CursosTomados.length > 0) {
      // Convertir fechas al formato YYYY-MM-DD para el input type="date"
      const fechaInicio = new Date(curso.CursosTomados[0].FechaInicio);
      const fechaTermino = new Date(curso.CursosTomados[0].FechaTermino);
      
      this.nuevaFechaInicio = fechaInicio.toISOString().split('T')[0];
      this.nuevaFechaTermino = fechaTermino.toISOString().split('T')[0];
    }
  }

  // Método para cancelar la edición
  cancelarEdicion(): void {
    this.cursoEditando = null;
    this.nuevaFechaInicio = '';
    this.nuevaFechaTermino = '';
    this.error = '';
  }

  // Método para guardar las fechas actualizadas
  guardarFechas(): void {
    if (!this.cursoEditando || !this.cursoEditando._id) {
      this.error = 'No se puede actualizar el curso';
      return;
    }

    // Validar que ambas fechas estén presentes
    if (!this.nuevaFechaInicio || !this.nuevaFechaTermino) {
      this.error = 'Ambas fechas son requeridas';
      return;
    }

    // Validar que la fecha de término sea posterior a la de inicio
    const fechaInicio = new Date(this.nuevaFechaInicio);
    const fechaTermino = new Date(this.nuevaFechaTermino);
    
    if (fechaTermino < fechaInicio) {
      this.error = 'La fecha de término debe ser posterior a la fecha de inicio';
      return;
    }

    const cursoId = this.cursoEditando._id;
    
    // Llamar al servicio para actualizar
    this.cursosTomadosService.actualizarFechasCurso(
      cursoId,
      this.cursoEditando.ClaveEmpleado,
      this.cursoEditando.NombreCompletoEmpleado,
      this.nuevaFechaInicio,
      this.nuevaFechaTermino
    ).subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
        
        // Encontrar y actualizar el curso en la lista local
        const index = this.cursostomados.findIndex(c => c._id === this.cursoEditando?._id);
        if (index !== -1) {
          // Si el servidor devuelve los datos actualizados, usamos esos
          if (response && response.cursoTomado) {
            this.cursostomados[index] = response.cursoTomado;
          } else {
            // Si no, actualizamos los datos locales
            if (this.cursostomados[index].CursosTomados && 
                this.cursostomados[index].CursosTomados.length > 0) {
              this.cursostomados[index].CursosTomados[0].FechaInicio = this.nuevaFechaInicio;
              this.cursostomados[index].CursosTomados[0].FechaTermino = this.nuevaFechaTermino;
            }
          }
          
          // Marcar el curso como editado en nuestra lista local
          if (cursoId) {
            this.cursosEditados.add(cursoId);
          }
        }
        
        this.successMessage = 'Fechas actualizadas correctamente';
        this.cancelarEdicion();
        setTimeout(() => this.successMessage = '', 3000);
      },
      (error) => {
        console.error('Error al actualizar las fechas del curso:', error);
        
        // Intentar obtener mensaje de error más descriptivo
        let mensajeError = 'Error al actualizar las fechas del curso';
        if (error.error && error.error.error) {
          mensajeError = error.error.error;
        }
        
        this.error = mensajeError;
        setTimeout(() => this.error = '', 5000);
      }
    );
  }
}