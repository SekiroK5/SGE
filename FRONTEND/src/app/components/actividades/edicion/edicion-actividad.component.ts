// edicion-actividad.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-edicion-actividad',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edicion-actividad.component.html',
  styleUrls: ['./edicion-actividad.component.css']
})
export class EdicionActividadComponent implements OnInit {
  formulario: FormGroup;
  id: number = 0;
  actividad: any = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      duracion: ['', [Validators.required, Validators.min(1)]],
      responsable: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = +params['id'];
        // Aquí cargarías los datos de la actividad desde un servicio
        this.cargarActividad(this.id);
      }
    });
  }

  cargarActividad(id: number): void {
    // Simular carga desde un servicio
    this.actividad = {
      id: id,
      nombre: 'Actividad ' + id,
      descripcion: 'Descripción de la actividad ' + id,
      fecha: '2025-03-20',
      duracion: 2,
      responsable: 'Responsable de la actividad ' + id
    };

    this.formulario.patchValue({
      nombre: this.actividad.nombre,
      descripcion: this.actividad.descripcion,
      fecha: this.actividad.fecha,
      duracion: this.actividad.duracion,
      responsable: this.actividad.responsable
    });
  }

  guardar(): void {
    if (this.formulario.valid) {
      // Aquí actualizarías la actividad usando un servicio
      console.log('Datos actualizados:', {
        id: this.id,
        ...this.formulario.value
      });
      this.router.navigate(['/actividades/lista']);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.formulario.controls).forEach(key => {
        this.formulario.get(key)?.markAsTouched();
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/actividades/lista']);
  }
}