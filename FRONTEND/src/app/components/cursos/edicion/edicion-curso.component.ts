import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
}

@Component({
  selector: 'app-edicion-curso',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './edicion-curso.component.html',
  styleUrls: ['./edicion-curso.component.css']
})
export class EdicionCursoComponent implements OnInit {
  edicionForm: FormGroup;
  cursoId: string = '';
  loading: boolean = true;
  submitted = false;
  success = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.edicionForm = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      instructor: ['', [Validators.required]],
      duracion: ['', [Validators.required, Validators.min(1)]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      capacidad: ['', [Validators.required, Validators.min(1)]],
      modalidad: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.cursoId = params['id'];
      this.cargarCurso();
    });
  }

  cargarCurso(): void {
    this.http.get<Curso>(`auth/cursos/${this.cursoId}`)
      .subscribe({
        next: (curso) => {
          this.edicionForm.patchValue({
            titulo: curso.titulo,
            descripcion: curso.descripcion,
            instructor: curso.instructor,
            duracion: curso.duracion,
            fechaInicio: curso.fechaInicio,
            fechaFin: curso.fechaFin,
            capacidad: curso.capacidad,
            modalidad: curso.modalidad
          });
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar los datos del curso.';
          this.loading = false;
          console.error(err);
        }
      });
  }

  get f() { return this.edicionForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.edicionForm.invalid) {
      return;
    }

    this.http.put(`auth/cursos/${this.cursoId}`, this.edicionForm.value)
      .subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => {
            this.router.navigate(['/cursos']);
          }, 2000);
        },
        error: (err) => {
          this.error = 'Error al actualizar el curso. Intente nuevamente.';
          console.error(err);
        }
      });
  }
}