import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { EmpleadoService, Empleado } from '../../../Services/empleado.service';

@Component({
  selector: 'app-lista-empleados',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './lista-empleados.component.html',
  styleUrls: ['./lista-empleados.component.css']
})
export class ListaEmpleadosComponent implements OnInit {
  // Variables para datos
  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];
  
  // Variables para estado
  loading: boolean = true;
  error: string = '';
  
  // Filtros y ordenamiento
  terminoBusqueda: string = '';
  departamentoFiltro: string = '';
  puestoFiltro: string = '';
  ordenPor: string = 'nombre';
  ordenAscendente: boolean = true;
  
  // Listas para opciones de filtro
  departamentos: string[] = [];
  puestos: string[] = [];
  
  // Variables para modal de detalles del empleado
  empleadoSeleccionadoDetalles: Empleado | null = null;
  mostrarModalDetalles: boolean = false;
  
  // Variables para modal de desactivación temporal
  razonDesactivacion: string = '';
  empleadoSeleccionado: Empleado | null = null;
  mostrarModalDesactivacion: boolean = false;

  constructor(private empleadoService: EmpleadoService, private router: Router) { }

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.loading = true;
    this.empleadoService.getEmpleados()
      .subscribe({
        next: (data) => {
          this.empleados = data;
          this.empleadosFiltrados = [...data];
          
          // Extraer departamentos y puestos únicos para filtros
          this.extraerOpcionesFiltro();
          
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar los empleados. Intente nuevamente.';
          this.loading = false;
          console.error(err);
        }
      });
  }

  extraerOpcionesFiltro(): void {
    // Extraer departamentos únicos
    this.departamentos = [...new Set(
      this.empleados
        .filter(emp => emp.Departamento)
        .map(emp => emp.Departamento)
    )];
    
    // Extraer puestos únicos
    this.puestos = [...new Set(
      this.empleados
        .filter(emp => emp.Puesto)
        .map(emp => emp.Puesto)
    )];
  }

  // Búsqueda en tiempo real a medida que el usuario escribe
  buscarEnTiempoReal(): void {
    // Siempre usar filtrado local para la búsqueda en tiempo real
    // para evitar demasiadas llamadas al servidor
    this.empleadosFiltrados = this.filtrarLocalmente();
  }
  
  // Aplica filtros localmente
  aplicarFiltros(): void {
    // Siempre usar filtrado local para evitar errores con el backend
    this.empleadosFiltrados = this.filtrarLocalmente();
  }

  filtrarLocalmente(): Empleado[] {
    let resultados = [...this.empleados];
    
    // Filtrar por término de búsqueda
    if (this.terminoBusqueda) {
      const termino = this.terminoBusqueda.toLowerCase();
      resultados = resultados.filter(emp => {
        const nombreCompleto = `${emp.Nombre || ''} ${emp.ApellidoPaterno || ''} ${emp.ApellidoMaterno || ''}`.toLowerCase();
        const clave = emp.ClaveEmpleado?.toLowerCase() || '';
        const rfc = emp.RFC?.toLowerCase() || '';
        
        return nombreCompleto.includes(termino) || 
               clave.includes(termino) || 
               rfc.includes(termino);
      });
    }
    
    // Filtrar por departamento
    if (this.departamentoFiltro) {
      resultados = resultados.filter(emp => emp.Departamento === this.departamentoFiltro);
    }
    
    // Filtrar por puesto
    if (this.puestoFiltro) {
      resultados = resultados.filter(emp => emp.Puesto === this.puestoFiltro);
    }
    
    // Aplicar ordenamiento
    return this.ordenarResultados(resultados);
  }
  
  // Ordenar resultados según criterio seleccionado
  ordenarResultados(resultados: Empleado[]): Empleado[] {
    return resultados.sort((a, b) => {
      let valorA, valorB;
      
      switch (this.ordenPor) {
        case 'nombre':
          valorA = `${a.Nombre || ''} ${a.ApellidoPaterno || ''} ${a.ApellidoMaterno || ''}`.toLowerCase();
          valorB = `${b.Nombre || ''} ${b.ApellidoPaterno || ''} ${b.ApellidoMaterno || ''}`.toLowerCase();
          break;
        case 'departamento':
          valorA = (a.Departamento || '').toLowerCase();
          valorB = (b.Departamento || '').toLowerCase();
          break;
        case 'puesto':
          valorA = (a.Puesto || '').toLowerCase();
          valorB = (b.Puesto || '').toLowerCase();
          break;
        case 'clave':
          valorA = (a.ClaveEmpleado || '').toLowerCase();
          valorB = (b.ClaveEmpleado || '').toLowerCase();
          break;
        default:
          valorA = (a.Nombre || '').toLowerCase();
          valorB = (b.Nombre || '').toLowerCase();
      }
      
      if (this.ordenAscendente) {
        return valorA.localeCompare(valorB);
      } else {
        return valorB.localeCompare(valorA);
      }
    });
  }

  // Cambiar dirección del ordenamiento
  cambiarOrden(): void {
    this.ordenAscendente = !this.ordenAscendente;
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.terminoBusqueda = '';
    this.departamentoFiltro = '';
    this.puestoFiltro = '';
    this.ordenPor = 'nombre';
    this.ordenAscendente = true;
    this.empleadosFiltrados = [...this.empleados];
  }

  eliminarEmpleado(clave: string): void {
    if (!clave) {
      this.error = 'Clave de empleado no válida';
      return;
    }

    if (confirm('¿Está seguro que desea ELIMINAR PERMANENTEMENTE este empleado? Esta acción no se puede deshacer.')) {
      this.loading = true;
      this.empleadoService.deleteEmpleado(clave)
        .subscribe({
          next: () => {
            this.empleados = this.empleados.filter(emp => emp.ClaveEmpleado !== clave);
            this.empleadosFiltrados = this.empleadosFiltrados.filter(emp => emp.ClaveEmpleado !== clave);
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Error al eliminar el empleado. Intente nuevamente.';
            this.loading = false;
            console.error(err);
          }
        });
    }
  }
  
  // Helper para verificar si un empleado está activo basado en su departamento
  estaActivo(empleado: Empleado): boolean {
    return empleado.Departamento !== 'Sin asignar';
  }
  
  // Abrir modal para ver detalles del empleado
  abrirModalDetalles(empleado: Empleado): void {
    this.empleadoSeleccionadoDetalles = empleado;
    this.mostrarModalDetalles = true;
    
    // Prevenir scroll en el body cuando el modal está abierto
    document.body.classList.add('modal-open');
  }
  
  // Cerrar modal de detalles
  cerrarModalDetalles(): void {
    this.mostrarModalDetalles = false;
    this.empleadoSeleccionadoDetalles = null;
    
    // Restaurar scroll en el body
    document.body.classList.remove('modal-open');
  }
  
  // Navegar a la página de edición del empleado
  // Navegar a la página de edición del empleado
// En ListaEmpleadosComponent
editarEmpleado(empleado: Empleado): void {
  if (empleado && empleado.ClaveEmpleado) {
    // Cerramos el modal
    this.cerrarModalDetalles();
    
    // Navegamos a la ruta correcta basada en tu estructura
    const url = '/rh/empleados/edicion/' + empleado.ClaveEmpleado;
    console.log('Navegando a:', url);
    
    // Usar el Router para la navegación
    this.router.navigate(['/rh/empleados/edicion', empleado.ClaveEmpleado]);
  } else {
    console.error('No se puede editar: Clave de empleado no válida o indefinida');
    this.error = 'No se puede editar: Falta la clave del empleado';
  }
}
  
  // Abrir modal para desactivación temporal
  abrirModalDesactivacion(empleado: Empleado): void {
    this.empleadoSeleccionado = empleado;
    this.razonDesactivacion = '';
    this.mostrarModalDesactivacion = true;
    
    // Prevenir scroll en el body cuando el modal está abierto
    document.body.classList.add('modal-open');
  }
  
  // Cerrar modal de desactivación
  cerrarModalDesactivacion(): void {
    this.mostrarModalDesactivacion = false;
    this.empleadoSeleccionado = null;
    
    // Restaurar scroll en el body
    document.body.classList.remove('modal-open');
  }
  
  // Desactivar temporalmente empleado
  desactivarEmpleado(): void {
    if (!this.empleadoSeleccionado || !this.empleadoSeleccionado.ClaveEmpleado) {
      this.error = 'No se ha seleccionado un empleado válido';
      return;
    }
    
    if (!this.razonDesactivacion || !this.razonDesactivacion.trim()) {
      this.error = 'Debe proporcionar una razón para la desactivación temporal';
      return;
    }
    
    const clave = this.empleadoSeleccionado.ClaveEmpleado;
    
    this.loading = true;
    this.empleadoService.desactivarEmpleado(clave)
      .subscribe({
        next: () => {
          // Actualizar el estado del empleado en el array local
          const empleadoIndex = this.empleados.findIndex(e => e.ClaveEmpleado === clave);
          if (empleadoIndex !== -1) {
            this.empleados[empleadoIndex].Departamento = 'Sin asignar';
          }
          
          const empleadoFiltradoIndex = this.empleadosFiltrados.findIndex(e => e.ClaveEmpleado === clave);
          if (empleadoFiltradoIndex !== -1) {
            this.empleadosFiltrados[empleadoFiltradoIndex].Departamento = 'Sin asignar';
          }
          
          this.cerrarModalDesactivacion();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al desactivar el empleado. Intente nuevamente.';
          this.loading = false;
          console.error(err);
        }
      });
  }
  
  // Activar empleado 
  activarEmpleado(clave: string): void {
    if (!clave) {
      this.error = 'Clave de empleado no válida';
      return;
    }
    
    this.loading = true;
    this.empleadoService.activarEmpleado(clave)
      .subscribe({
        next: () => {
          // Actualizar el estado del empleado en el array local
          const empleadoIndex = this.empleados.findIndex(e => e.ClaveEmpleado === clave);
          if (empleadoIndex !== -1) {
            this.empleados[empleadoIndex].Departamento = 'Asignando';
          }
          
          const empleadoFiltradoIndex = this.empleadosFiltrados.findIndex(e => e.ClaveEmpleado === clave);
          if (empleadoFiltradoIndex !== -1) {
            this.empleadosFiltrados[empleadoFiltradoIndex].Departamento = 'Asignando';
          }
          
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al activar el empleado. Intente nuevamente.';
          this.loading = false;
          console.error(err);
        }
      });
  }

  formatearFecha(fecha: string | Date): string {
    if (!fecha) return 'No disponible';
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  obtenerCorreoPrincipal(correos: any[]): string {
    return correos && correos.length > 0 && correos[0].Direccion ? correos[0].Direccion : 'No disponible';
  }

  obtenerTelefonoPrincipal(telefonos: any[]): string {
    return telefonos && telefonos.length > 0 ? `${telefonos[0].Lada} ${telefonos[0].Numero}` : 'No disponible';
  }
}