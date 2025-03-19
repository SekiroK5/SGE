import { Component, OnInit } from '@angular/core';
import { CursosTomadosService, CursosTomados } from '../Services/curso.service'; // Asegúrate de importar el servicio y la interfaz
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  cursostomados: CursosTomados[] = [];  // Define la propiedad cursostomados como un arreglo de CursosTomados
  loading = true;  // Variable para mostrar el estado de carga
  error = '';  // Variable para almacenar errores

  constructor(private cursosTomadosService: CursosTomadosService) {}

  ngOnInit(): void {
    this.cargarCursosTomados();  // Llama al método para cargar los cursos cuando se inicializa el componente
  }

  // Método para cargar todos los cursos tomados desde el servicio
  cargarCursosTomados(): void {
    this.loading = true;
    this.cursosTomadosService.getCursosTomados().subscribe(
      (data) => {
        console.log('Cursos recibidos:', data);  // Verifica qué datos estás recibiendo
        this.cursostomados = data;  // Guarda los datos obtenidos en la propiedad cursostomados
        this.loading = false;  // Cambia el estado de carga a falso
      },
      (error) => {
        this.error = 'Error al cargar los cursos';  // Si ocurre un error, muestra un mensaje
        this.loading = false;  // Cambia el estado de carga a falso
      }
      
    );
  }
  eliminarCurso(id: string | undefined): void {
    if (!id) {
      this.error = 'ID de curso no válido';
      return;  // Si el ID no es válido, termina la ejecución del método.
    }
  
    this.cursosTomadosService.eliminarCursosTomados(id).subscribe(
      () => {
        // Si la eliminación fue exitosa, eliminamos el curso de la lista
        this.cursostomados = this.cursostomados.filter(curso => curso._id !== id);
        console.log(`Curso con id ${id} eliminado correctamente`);
      },
      (error) => {
        this.error = 'Error al eliminar el curso';
      }
    );
  }
}
