import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registro-curso',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './registro-curso.component.html',
  styleUrls: ['./registro-curso.component.css']
})
export class RegistroCursoComponent implements OnInit {
  registroForm: FormGroup;
  submitted = false;
  success = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.registroForm = this.formBuilder.group({
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
  }

  get f() { return this.registroForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.registroForm.invalid) {
      return;
    }

    this.http.post('api/cursos', this.registroForm.value)
      .subscribe({
        next: () => {
          this.success = true;
          this.registroForm.reset();
          this.submitted = false;
          setTimeout(() => this.success = false, 3000);
        },
        error: (err) => {
          this.error = 'Error al registrar el curso. Intente nuevamente.';
          console.error(err);
        }
      });
  }
}