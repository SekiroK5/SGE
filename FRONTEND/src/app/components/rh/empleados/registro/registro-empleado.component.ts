import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registro-empleado',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './registro-empleado.component.html',
  styleUrls: ['./registro-empleado.component.css']
})
export class RegistroEmpleadoComponent implements OnInit {
  registroForm: FormGroup;
  submitted = false;
  success = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.registroForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      posicion: ['', [Validators.required]],
      fechaIngreso: ['', [Validators.required]]
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

    const empleadoData = {
      ...this.registroForm.value,
      clave: this.generarClave()
    };

    this.http.post('api/empleados', empleadoData)
      .subscribe({
        next: () => {
          this.success = true;
          this.registroForm.reset();
          this.submitted = false;
          setTimeout(() => this.success = false, 3000);
        },
        error: (err) => {
          this.error = 'Error al registrar empleado. Intente nuevamente.';
          console.error(err);
        }
      });
  }

  generarClave(): string {
    // Generar clave automática basada en apellido e ID aleatorio
    const apellido = this.registroForm.get('apellido')?.value.substring(0, 3).toUpperCase() || '';
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${apellido}${random}`;
  }
}