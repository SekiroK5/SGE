import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Empleado {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  departamento: string;
  posicion: string;
  fechaIngreso: string;
  clave: string;
}

@Component({
  selector: 'app-edicion-empleado',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './edicion-empleado.component.html',
  styleUrls: ['./edicion-empleado.component.css']
})
export class EdicionEmpleadoComponent implements OnInit {
  edicionForm: FormGroup;
  empleadoId: string = '';
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
    this.route.params.subscribe(params => {
      this.empleadoId = params['id'];
      this.cargarEmpleado();
    });
  }

  cargarEmpleado(): void {
    this.http.get<Empleado>(`api/empleados/${this.empleadoId}`)
      .subscribe({
        next: (empleado) => {
          this.edicionForm.patchValue({
            nombre: empleado.nombre,
            apellido: empleado.apellido,
            email: empleado.email,
            telefono: empleado.telefono,
            departamento: empleado.departamento,
            posicion: empleado.posicion,
            fechaIngreso: empleado.fechaIngreso
          });
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar los datos del empleado.';
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

    this.http.put(`api/empleados/${this.empleadoId}`, this.edicionForm.value)
      .subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => {
            this.router.navigate(['/lista-empleados']);
          }, 2000);
        },
        error: (err) => {
          this.error = 'Error al actualizar empleado. Intente nuevamente.';
          console.error(err);
        }
      });
  }
}