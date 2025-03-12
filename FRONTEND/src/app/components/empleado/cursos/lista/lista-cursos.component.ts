import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Curso {
  _id: string;
  titulo: string;
  descripcion: string;
  instructor: string;
  duracion: number;
  fechaInicio: string;
  fechaFin: string;
  capacidad: number;
  modalidad: string;
  inscritos?: number;
}

@Component({
  selector: 'app-lista-cursos',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './lista-cursos.component.html',
  styleUrls: ['./lista-cursos.component.css']
})
export class ListaCursosComponent implements OnInit {
  cursos: Curso[] = [];
  cursosFiltrados: Curso[] = [];
  loading: boolean = true;
  error: string = '';
  
  // Filtros
  tituloFiltro: string = '';
  modalidadFiltro: string = '';
  estadoFiltro: string = ''; // 'activo', 'próximo', 'finalizado'

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos(): void {
    this.http.get<Curso[]>('api/cursos')
      .subscribe({
        next: (data) => {
          this.cursos = data;
          this.cursosFiltrados = [...data];
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar los cursos. Intente nuevamente.';
          this.loading = false;
          console.error(err);
        }
      });
  }

  aplicarFiltros(): void {
    this.cursosFiltrados = this.cursos.filter(curso => {
      const tituloCoincide = this.tituloFiltro ? curso.titulo.toLowerCase().includes(this.tituloFiltro.toLowerCase()) : true;
      const modalidadCoincide = this.modalidadFiltro ? curso.modalidad === this.modalidadFiltro : true;
      
      let estadoCoincide = true;
      const hoy = new Date();
      const fechaInicio = new Date(curso.fechaInicio);
      const fechaFin = new Date(curso.fechaFin);
      
      if (this.estadoFiltro === 'activo') {
        estadoCoincide = fechaInicio <= hoy && fechaFin >= hoy;
      } else if (this.estadoFiltro === 'proximo') {
        estadoCoincide = fechaInicio > hoy;
      } else if (this.estadoFiltro === 'finalizado') {
        estadoCoincide = fechaFin < hoy;
      }
      
      return tituloCoincide && modalidadCoincide && estadoCoincide;
    });
  }

  limpiarFiltros(): void {
    this.tituloFiltro = '';
    this.modalidadFiltro = '';
    this.estadoFiltro = '';
    this.cursosFiltrados = [...this.cursos];
  }

  eliminarCurso(id: string): void {
    if (confirm('¿Está seguro que desea eliminar este curso?')) {
      this.http.delete(`api/cursos/${id}`)
        .subscribe({
          next: () => {
            this.cursos = this.cursos.filter(curso => curso._id !== id);
            this.cursosFiltrados = this.cursosFiltrados.filter(curso => curso._id !== id);
          },
          error: (err) => {
            this.error = 'Error al eliminar el curso. Intente nuevamente.';
            console.error(err);
          }
        });
    }
  }

  obtenerEstadoCurso(curso: Curso): string {
    const hoy = new Date();
    const fechaInicio = new Date(curso.fechaInicio);
    const fechaFin = new Date(curso.fechaFin);
    
    if (fechaInicio > hoy) {
      return 'Próximo';
    } else if (fechaFin < hoy) {
      return 'Finalizado';
    } else {
      return 'Activo';
    }
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }
}