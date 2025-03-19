// edicion-actividad.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ParticipacionActividad, ParticipacionActividadService } from '../../Services/actividad.service';

@Component({
  selector: 'app-edicion-actividad',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edicion-actividad.component.html',
  styleUrls: ['./edicion-actividad.component.css']
})
export class EdicionActividadComponent implements OnInit {
  formulario: FormGroup;
  actividad: ParticipacionActividad | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private participacionActividadService: ParticipacionActividadService
  ) {
    this.formulario = this.fb.group({
      claveempleado: [{value: '', disabled: true}, Validators.required],  // Disabled para que no se pueda editar
      nombrecompletoempleado: [{value: '', disabled: true}, Validators.required], // Disabled también aquí
      nombreactividad: ['', Validators.required],
      descripcionactividad: ['', Validators.required],
      estatus: [true, Validators.required],
      fechaactividad: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const claveEmpleado = this.route.snapshot.paramMap.get('claveEmpleado');
    
    if (claveEmpleado) {
      this.obtenerParticipacion(claveEmpleado);
    }
  }

  obtenerParticipacion(claveEmpleado: string): void {
    this.participacionActividadService.getParticipacionByClave(claveEmpleado).subscribe(
      (data) => {
        this.actividad = data;
        this.formulario.patchValue({
          claveempleado: data.ClaveEmpleado,
          nombrecompletoempleado: data.NombreCompletoEmpleado,
          nombreactividad: data.ParticipacionActividad[0]?.NombreActividad,
          descripcionactividad: data.ParticipacionActividad[0]?.Descripcion,
          estatus: data.ParticipacionActividad[0]?.Estatus,
          fechaactividad: new Date(data.ParticipacionActividad[0]?.FechaActividad).toISOString().slice(0, 16)
        });
      },
      (error) => {
        console.error('Error al obtener la participación:', error);
      }
    );
  }

  guardar(): void {
    if (this.formulario.valid) {
      const updatedData: ParticipacionActividad = {
        ClaveEmpleado: this.formulario.value.claveempleado,  // Mantener el ClaveEmpleado
        NombreCompletoEmpleado: this.formulario.value.nombrecompletoempleado,  // Mantener el NombreCompletoEmpleado
        ParticipacionActividad: [{
          NombreActividad: this.formulario.value.nombreactividad,
          Estatus: this.formulario.value.estatus,
          FechaActividad: this.formulario.value.fechaactividad,
          Descripcion: this.formulario.value.descripcionactividad
        }]
      };
  
      if (this.actividad) {
        this.participacionActividadService.updateParticipacion(this.actividad._id!, updatedData).subscribe(
          (data) => {
            console.log('Actividad actualizada:', data);
            this.router.navigate(['/actividades']); // Redirigir a la lista de actividades o a otro lugar
          },
          (error) => {
            console.error('Error al actualizar la actividad:', error);
          }
        );
      }
    }
  }
  

  cancelar(): void {
    this.router.navigate(['/actividades']); // Redirigir a la lista de actividades o a otro lugar
  }
}