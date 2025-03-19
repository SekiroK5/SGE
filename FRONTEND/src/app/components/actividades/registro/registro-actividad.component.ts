import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ParticipacionActividadService, ParticipacionActividad } from '../../Services/actividad.service';  // Asegúrate de importar el servicio

@Component({
  selector: 'app-registro-actividad',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro-actividad.component.html',
  styleUrls: ['./registro-actividad.component.css']
})
export class RegistroActividadComponent {
  formulario: FormGroup;

  submitted = false;
  success = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private participacionService: ParticipacionActividadService  // Inyecta el servicio
  ) {
    this.formulario = this.fb.group({
      claveempleado: ['', [Validators.required]],
      nombrecompletoempleado: ['', [Validators.required]],
      nombreactividad: ['', [Validators.required]],
      descripcionactividad: ['', [Validators.required]],  // Campo Descripción añadido
      estatus: ['', [Validators.required]]
    });
    
  }

  get f() { return this.formulario.controls; }

  guardar(): void {
    if (this.formulario.valid) {
      const nuevaParticipacion: ParticipacionActividad = {
        ClaveEmpleado: this.formulario.value.claveempleado,
        NombreCompletoEmpleado: this.formulario.value.nombrecompletoempleado,
        ParticipacionActividad: [{
          NombreActividad: this.formulario.value.nombreactividad,
          Descripcion: this.formulario.value.descripcionactividad, // Incluye la Descripción aquí
          Estatus: this.formulario.value.estatus, 
          FechaActividad: new Date().toISOString(),
        }]
      };
  
      console.log('Datos enviados:', nuevaParticipacion);  // Verifica el valor de Estatus y Descripción
  
      // Llamar al servicio para guardar los datos
      this.participacionService.createParticipacion(nuevaParticipacion).subscribe(
        (response) => {
          this.success = true;
          this.error = '';
          this.router.navigate(['/actividades/lista']);
        },
        (error) => {
          this.error = 'Hubo un error al guardar la actividad: ' + error.message;
          this.success = false;
        }
      );
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.formulario.controls).forEach(key => {
        this.formulario.get(key)?.markAsTouched();
      });
    }
  }
  
  
  cancelar(): void {
    this.router.navigate(['/rh/dashboard']);
  }
  
}
