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
  // Datos de cursos
  cursostomados: CursosTomados[] = [];
  cursosFiltrados: CursosTomados[] = [];
  cursoEditando: CursosTomados | null = null;
  
  // Campos para edición
  nuevaFechaInicio: string = '';
  nuevaFechaTermino: string = '';
  
  // Estados
  loading = true;
  error = '';
  successMessage = '';
  cursosEditados: Set<string> = new Set<string>();
  
  // Filtros
  terminoBusqueda: string = '';
  filtroAnio: string = '';
  filtroMes: string = '';
  aniosDisponibles: string[] = [];
  
  // Paginación
  itemsPorPagina: number = 10;
  paginaActual: number = 1;
  totalPaginas: number = 1;

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
        this.extraerAniosDisponibles();
        this.aplicarFiltros();
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

  // Extraer años disponibles de los cursos para el filtro
  extraerAniosDisponibles(): void {
    const anios = new Set<string>();
    
    this.cursostomados.forEach(curso => {
      if (curso.CursosTomados && curso.CursosTomados.length > 0) {
        // Obtener año de inicio
        const fechaInicio = new Date(curso.CursosTomados[0].FechaInicio);
        anios.add(fechaInicio.getFullYear().toString());
        
        // Obtener año de término
        const fechaTermino = new Date(curso.CursosTomados[0].FechaTermino);
        anios.add(fechaTermino.getFullYear().toString());
      }
    });
    
    this.aniosDisponibles = Array.from(anios).sort((a, b) => parseInt(b) - parseInt(a));
  }

  // Filtrar cursos según criterios
  aplicarFiltros(): void {
    // Reiniciar a la primera página cuando se aplica un filtro
    this.paginaActual = 1;
    
    // Aplicar filtros
    this.cursosFiltrados = this.cursostomados.filter(curso => {
      // Si no hay información de curso, no incluir
      if (!curso.CursosTomados || curso.CursosTomados.length === 0) {
        return false;
      }
      
      let cumpleFiltros = true;
      
      // Filtrar por término de búsqueda (nombre de empleado o clave)
      if (this.terminoBusqueda.trim() !== '') {
        const terminoLower = this.terminoBusqueda.toLowerCase();
        const nombreEmpleado = curso.NombreCompletoEmpleado?.toLowerCase() || '';
        const claveEmpleado = curso.ClaveEmpleado?.toLowerCase() || '';
        const nombreCurso = curso.CursosTomados[0].NombreCurso?.toLowerCase() || '';
        
        if (!nombreEmpleado.includes(terminoLower) && 
            !claveEmpleado.includes(terminoLower) &&
            !nombreCurso.includes(terminoLower)) {
          cumpleFiltros = false;
        }
      }
      
      // Filtrar por año
      if (this.filtroAnio !== '' && cumpleFiltros) {
        const fechaInicio = new Date(curso.CursosTomados[0].FechaInicio);
        const fechaTermino = new Date(curso.CursosTomados[0].FechaTermino);
        const anioInicio = fechaInicio.getFullYear().toString();
        const anioTermino = fechaTermino.getFullYear().toString();
        
        if (anioInicio !== this.filtroAnio && anioTermino !== this.filtroAnio) {
          cumpleFiltros = false;
        }
      }
      
      // Filtrar por mes
      if (this.filtroMes !== '' && cumpleFiltros) {
        const fechaInicio = new Date(curso.CursosTomados[0].FechaInicio);
        const fechaTermino = new Date(curso.CursosTomados[0].FechaTermino);
        const mesInicio = fechaInicio.getMonth().toString();
        const mesTermino = fechaTermino.getMonth().toString();
        
        if (mesInicio !== this.filtroMes && mesTermino !== this.filtroMes) {
          cumpleFiltros = false;
        }
      }
      
      return cumpleFiltros;
    });
    
    // Actualizar el total de páginas
    this.totalPaginas = Math.ceil(this.cursosFiltrados.length / this.itemsPorPagina);
    if (this.totalPaginas === 0) this.totalPaginas = 1;
    
    // Aplicar paginación
    this.aplicarPaginacion();
  }
  
  // Limpiar la búsqueda
  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.aplicarFiltros();
  }
  
  // Reiniciar todos los filtros
  reiniciarFiltros(): void {
    this.terminoBusqueda = '';
    this.filtroAnio = '';
    this.filtroMes = '';
    this.paginaActual = 1;
    this.aplicarFiltros();
  }

  // Métodos de paginación
  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.aplicarPaginacion();
    }
  }
  
  aplicarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = Math.min(inicio + this.itemsPorPagina, this.cursosFiltrados.length);
    
    // No modificamos this.cursosFiltrados directamente para mantener todos los resultados filtrados
    // y solo mostramos los de la página actual
    this.cursosFiltrados = this.cursosFiltrados.slice(inicio, fin);
  }
  
  obtenerPaginas(): number[] {
    const paginas: number[] = [];
    const maxPaginasMostradas = 5;
    
    let inicio = Math.max(1, this.paginaActual - Math.floor(maxPaginasMostradas / 2));
    let fin = Math.min(this.totalPaginas, inicio + maxPaginasMostradas - 1);
    
    // Ajustar inicio si fin está limitado
    if (fin - inicio + 1 < maxPaginasMostradas) {
      inicio = Math.max(1, fin - maxPaginasMostradas + 1);
    }
    
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    return paginas;
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
          this.aplicarFiltros();
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
        // Volver a aplicar filtros para actualizar la vista
        this.aplicarFiltros();
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