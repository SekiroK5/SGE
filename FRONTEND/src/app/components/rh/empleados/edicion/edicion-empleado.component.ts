import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EmpleadoService, Empleado } from '../../../Services/empleado.service';

@Component({
  selector: 'app-edicion-empleado',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './edicion-empleado.component.html',
  styleUrls: ['./edicion-empleado.component.css']
})
export class EdicionEmpleadoComponent implements OnInit {
  edicionForm: FormGroup;
  claveEmpleado: string = '';
  loading: boolean = true;
  submitted = false;
  success = false;
  error = '';
  empleadoActual: Empleado | null = null;
  
  // Modo de edición
  modoRH: boolean = false; // true si viene de RH, false si es el propio empleado

  constructor(
    private formBuilder: FormBuilder,
    private empleadoService: EmpleadoService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    // Detectar el modo basado en la URL
    const urlActual = this.router.url;
    console.log('URL actual en constructor:', urlActual);
    
    // Si la URL contiene '/rh/empleados/', estamos en modo RH
    this.modoRH = urlActual.includes('/rh/empleados/');
    
    // Si la URL contiene '/empleado/editar/', estamos en modo empleado
    const esRutaEmpleado = urlActual.includes('/empleado/editar/');
    
    // Log para depuración
    console.log('Detección inicial de modo - URL:', urlActual);
    console.log('Modo RH:', this.modoRH);
    console.log('Es ruta de empleado:', esRutaEmpleado);
    
    // Si es claramente una ruta de empleado, asegurarse de que modoRH sea false
    if (esRutaEmpleado) {
      this.modoRH = false;
      console.log('Estableciendo explícitamente modo empleado (no RH)');
    }
    
    // Crear el formulario básico (se actualizará completamente en actualizarFormulario)
    this.edicionForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    // Obtener la clave del empleado de los parámetros de la ruta
    this.route.paramMap.subscribe(params => {
      const claveParam = params.get('claveEmpleado');
      
      if (claveParam) {
        this.claveEmpleado = claveParam;
        console.log('Clave de empleado recibida:', this.claveEmpleado);
        
        // Comprobar nuevamente el modo basado en la ruta actual
        const rutaActual = this.router.url;
        const esRutaRH = rutaActual.includes('/rh/empleados/');
        const esRutaEmpleado = rutaActual.includes('/empleado/editar/');
        
        console.log('Comprobación en ngOnInit - Ruta actual:', rutaActual);
        console.log('Es ruta RH:', esRutaRH);
        console.log('Es ruta empleado:', esRutaEmpleado);
        
        // Actualizar el modo si es necesario
        if (esRutaEmpleado && this.modoRH) {
          console.log('Corrigiendo modo: cambiando a modo empleado');
          this.modoRH = false;
        }
        
        this.cargarEmpleado(this.claveEmpleado);
      } else {
        this.error = 'No se proporcionó una clave de empleado válida';
        this.loading = false;
        console.error('Clave de empleado no encontrada en los parámetros');
      }
    });
  }

  cargarEmpleado(claveEmpleado: string): void {
    console.log('Cargando empleado con clave:', claveEmpleado);
    console.log('Modo de carga:', this.modoRH ? 'RH' : 'Empleado');
    
    this.loading = true;
    this.empleadoService.getEmpleadoByClave(claveEmpleado)
      .subscribe({
        next: (empleado) => {
          console.log('Empleado cargado:', empleado);
          this.empleadoActual = empleado;
          
          // Actualizamos el formulario con los datos del empleado
          this.actualizarFormulario(empleado);
          
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar los datos del empleado.';
          this.loading = false;
          console.error('Error al obtener empleado:', err);
        }
      });
  }

  actualizarFormulario(empleado: Empleado): void {
    console.log('Actualizando formulario en modo:', this.modoRH ? 'RH' : 'Empleado');
    
    // Crear el formulario según el modo
    const formGroupConfig: any = {
      // Campos personales (se deshabilitan en modo RH)
      Nombre: [{value: empleado.Nombre, disabled: this.modoRH}, [Validators.required]],
      ApellidoPaterno: [{value: empleado.ApellidoPaterno, disabled: this.modoRH}, [Validators.required]],
      ApellidoMaterno: [{value: empleado.ApellidoMaterno, disabled: this.modoRH}, [Validators.required]],
      RFC: [{value: empleado.RFC, disabled: this.modoRH}],
      FechaNacimiento: [{value: this.formatearFechaParaInput(empleado.FechaNacimiento), disabled: this.modoRH}, [Validators.required]],
      Sexo: [{value: empleado.Sexo, disabled: this.modoRH}, [Validators.required]],
      
      // Campos de dirección (se deshabilitan en modo RH)
      Calle: [{value: empleado.Calle, disabled: this.modoRH}, [Validators.required]],
      NumeroExterior: [{value: empleado.NumeroExterior, disabled: this.modoRH}, [Validators.required]],
      NumeroInterior: [{value: empleado.NumeroInterior, disabled: this.modoRH}],
      Colonia: [{value: empleado.Colonia, disabled: this.modoRH}, [Validators.required]],
      CodigoPostal: [{value: empleado.CodigoPostal, disabled: this.modoRH}, [Validators.required]],
      Ciudad: [{value: empleado.Ciudad, disabled: this.modoRH}, [Validators.required]],
      
      // Campos laborales (siempre editables)
      Departamento: [empleado.Departamento, [Validators.required]],
      Puesto: [empleado.Puesto, [Validators.required]],
    };
    
    // Crear el formulario con configuración básica
    this.edicionForm = this.formBuilder.group(formGroupConfig);
    
    // Agregar los arrays dinámicos solo en modo empleado
    if (!this.modoRH) {
      // Arrays para información de contacto y referencias
      this.edicionForm.addControl('Telefonos', this.buildTelefonosArray(empleado.Telefonos || []));
      this.edicionForm.addControl('CorreoElectronico', this.buildCorreosArray(empleado.CorreoElectronico || []));
      this.edicionForm.addControl('ReferenciaFamiliar', this.buildReferenciasArray(empleado.ReferenciaFamiliar || []));
    }
  }

  // El resto del código permanece igual...
  
  buildTelefonosArray(telefonos: any[]): FormArray {
    return this.formBuilder.array(
      telefonos.map(tel => this.formBuilder.group({
        Lada: [tel.Lada, Validators.required],
        Numero: [tel.Numero, Validators.required]
      }))
    );
  }
  
  buildCorreosArray(correos: any[]): FormArray {
    return this.formBuilder.array(
      correos.map(correo => this.formBuilder.group({
        Direccion: [correo.Direccion, [Validators.required, Validators.email]]
      }))
    );
  }
  
  buildReferenciasArray(referencias: any[]): FormArray {
    return this.formBuilder.array(
      referencias.map(ref => this.formBuilder.group({
        NombreCompleto: [ref.NombreCompleto, Validators.required],
        Parentesco: [ref.Parentesco, Validators.required],
        Telefono: this.buildTelefonosArray(ref.Telefono || []),
        CorreoElectronico: this.buildCorreosArray(ref.CorreoElectronico || [])
      }))
    );
  }
  
  // Getters para acceder a los FormArray
  get telefonos(): FormArray {
    return this.edicionForm.get('Telefonos') as FormArray;
  }
  
  get correos(): FormArray {
    return this.edicionForm.get('CorreoElectronico') as FormArray;
  }
  
  get referencias(): FormArray {
    return this.edicionForm.get('ReferenciaFamiliar') as FormArray;
  }
  
  // Métodos para agregar nuevos elementos a los arrays
  agregarTelefono(): void {
    this.telefonos.push(
      this.formBuilder.group({
        Lada: ['', Validators.required],
        Numero: ['', Validators.required]
      })
    );
  }
  
  eliminarTelefono(index: number): void {
    this.telefonos.removeAt(index);
  }
  
  agregarCorreo(): void {
    this.correos.push(
      this.formBuilder.group({
        Direccion: ['', [Validators.required, Validators.email]]
      })
    );
  }
  
  eliminarCorreo(index: number): void {
    this.correos.removeAt(index);
  }
  
  agregarReferencia(): void {
    this.referencias.push(
      this.formBuilder.group({
        NombreCompleto: ['', Validators.required],
        Parentesco: ['', Validators.required],
        Telefono: this.formBuilder.array([
          this.formBuilder.group({
            Lada: ['', Validators.required],
            Numero: ['', Validators.required]
          })
        ]),
        CorreoElectronico: this.formBuilder.array([
          this.formBuilder.group({
            Direccion: ['', [Validators.required, Validators.email]]
          })
        ])
      })
    );
  }
  
  eliminarReferencia(index: number): void {
    this.referencias.removeAt(index);
  }
  
  // Helper para obtener un FormArray dentro de una referencia
  getTelefonosDeReferencia(referenciaIndex: number): FormArray {
    return (this.referencias.at(referenciaIndex).get('Telefono') as FormArray);
  }
  
  getCorreosDeReferencia(referenciaIndex: number): FormArray {
    return (this.referencias.at(referenciaIndex).get('CorreoElectronico') as FormArray);
  }
  
  agregarTelefonoReferencia(referenciaIndex: number): void {
    this.getTelefonosDeReferencia(referenciaIndex).push(
      this.formBuilder.group({
        Lada: ['', Validators.required],
        Numero: ['', Validators.required]
      })
    );
  }
  
  eliminarTelefonoReferencia(referenciaIndex: number, telefonoIndex: number): void {
    this.getTelefonosDeReferencia(referenciaIndex).removeAt(telefonoIndex);
  }
  
  agregarCorreoReferencia(referenciaIndex: number): void {
    this.getCorreosDeReferencia(referenciaIndex).push(
      this.formBuilder.group({
        Direccion: ['', [Validators.required, Validators.email]]
      })
    );
  }
  
  eliminarCorreoReferencia(referenciaIndex: number, correoIndex: number): void {
    this.getCorreosDeReferencia(referenciaIndex).removeAt(correoIndex);
  }

  formatearFechaParaInput(fecha: Date | string): string {
    if (!fecha) return '';
    
    const fechaObj = new Date(fecha);
    const year = fechaObj.getFullYear();
    const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const day = String(fechaObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  get f() { return this.edicionForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.edicionForm.invalid) {
      console.log('Formulario inválido:', this.edicionForm.errors);
      return;
    }

    this.loading = true;
    
    // Crear objeto para actualizar, diferente según el modo
    const empleadoActualizado: any = {};
    
    if (this.modoRH) {
      // En modo RH, solo actualizar departamento y puesto
      empleadoActualizado.Departamento = this.f['Departamento'].value;
      empleadoActualizado.Puesto = this.f['Puesto'].value;
      
      console.log('Actualizando solo departamento y puesto:', empleadoActualizado);
    } else {
      // En modo empleado, actualizar todos los campos del formulario
      // Combinar los datos actuales con los nuevos para preservar campos no presentes en el formulario
      const formValue = this.edicionForm.getRawValue(); // Incluye campos disabled
      
      // Mezclamos los datos actuales con los del formulario
      Object.assign(empleadoActualizado, this.empleadoActual, formValue);
      
      console.log('Actualizando todos los campos:', empleadoActualizado);
    }
    
    this.empleadoService.updateEmpleado(this.claveEmpleado, empleadoActualizado)
      .subscribe({
        next: () => {
          this.success = true;
          console.log('Empleado actualizado correctamente');
          
          setTimeout(() => {
            if (this.modoRH) {
              this.router.navigate(['/rh/empleados/lista']);
            } else {
              this.router.navigate(['/empleado/perfil']);
            }
          }, 2000);
        },
        error: (err) => {
          this.error = 'Error al actualizar empleado. Intente nuevamente.';
          this.loading = false;
          console.error('Error en la actualización:', err);
        }
      });
  }
  
  cancelar(): void {
    if (this.modoRH) {
      this.router.navigate(['/rh/empleados/lista']);
    } else {
      this.router.navigate(['/empleado/perfil']);
    }
  }
}