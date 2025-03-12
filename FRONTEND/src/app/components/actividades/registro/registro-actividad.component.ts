// registro-actividad.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-actividad',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro-actividad.component.html',
  styleUrls: ['./registro-actividad.component.css']
})
export class RegistroActividadComponent {
  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      duracion: ['', [Validators.required, Validators.min(1)]],
      responsable: ['', [Validators.required]]
    });
  }

  guardar(): void {
    if (this.formulario.valid) {
      // Aquí guardarías la actividad usando un servicio
      console.log('Datos de la actividad:', this.formulario.value);
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