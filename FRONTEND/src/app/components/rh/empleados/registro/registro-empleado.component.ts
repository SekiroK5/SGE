import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EmpleadoService, Empleado, Telefonos, CorreoElectronico, ReferenciaFamiliar } from '../../../Services/empleado.service';

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
  
  // Propiedades para la dirección
  callesDisponibles: string[] = [];
  coloniasDisponibles: string[] = [];

  // Mapeo de códigos postales a ciudades
  codigoPostalCiudades: { [key: string]: string } = {
    '44100': 'Guadalajara',
    '37000': 'León',
    '20029': 'Aguascalientes',
    '36010': 'Guanajuato',
    '01089': 'Ciudad de México'
  };

  // Mapeo de códigos postales a colonias
  codigoPostalColonias: { [key: string]: string[] } = {
    '44100': ['Americana', 'Lafayette', 'Arcos Vallarta', 'Ladrón de Guevara', 'Italia Providencia'],
    '37000': ['Centro', 'Coecillo', 'San Juan de Dios', 'Zona Piel', 'Arbide'],
    '20029': ['Colinas del Río', 'Jardines de la Asunción', 'La Herradura', 'Lomas del Campestre', 'Jardines de la Concepción'],
    '36010': ['Centro Histórico', 'San Javier', 'Pastita', 'La Presa', 'Noria Alta'],
    '01089': ['Del Valle', 'Narvarte', 'Roma Norte', 'Condesa', 'Polanco']
  };

  // Mapeo de códigos postales a calles
  codigoPostalCalles: { [key: string]: string[] } = {
    '44100': ['Av. México', 'Av. Chapultepec', 'Av. Vallarta', 'Calle Juárez', 'Calle Morelos'],
    '37000': ['Blvd. Adolfo López Mateos', 'Av. Miguel Alemán', 'Calle Madero', 'Calle Hidalgo', 'Av. Las Torres'],
    '20029': ['Av. Convención', 'Av. Aguascalientes', 'Av. Universidad', 'Av. López Mateos', 'Calle Zaragoza'],
    '36010': ['Calle Alonso', 'Av. Juárez', 'Calle Positos', 'Calle Sopeña', 'Calle Sangre de Cristo'],
    '01089': ['Av. Insurgentes', 'Av. Reforma', 'Av. Revolución', 'Calle Álvaro Obregón', 'Calle Sonora']
  };

  constructor(
    private formBuilder: FormBuilder,
    private empleadoService: EmpleadoService
  ) {
    this.registroForm = this.formBuilder.group({
      Nombre: ['', [Validators.required]],
      ApellidoPaterno: ['', [Validators.required]],
      ApellidoMaterno: ['', [Validators.required]],
      FechaNacimiento: ['', [Validators.required]],
      Sexo: ['', [Validators.required]],
      Foto: [''],
      Calle: ['', [Validators.required]],
      NumeroInterior: [''],
      NumeroExterior: ['', [Validators.required]],
      Colonia: ['', [Validators.required]],
      CodigoPostal: ['', [Validators.required]],
      Ciudad: ['', [Validators.required]],
      Departamento: ['', [Validators.required]],
      Puesto: ['', [Validators.required]],
      Telefonos: this.formBuilder.array([this.crearTelefono()]),
      CorreoElectronico: this.formBuilder.array([this.crearCorreo()]),
      ReferenciaFamiliar: this.formBuilder.array([this.crearReferencia()]),
      Password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Se deja vacío intencionalmente o para futuras inicializaciones
  }

  // Método para manejar el cambio en el código postal
  onCodigoPostalChange(event: any) {
    const codigoPostal = event.target.value;
    
    if (codigoPostal) {
      // Actualizar el campo de Ciudad con el valor correspondiente
      const ciudad = this.codigoPostalCiudades[codigoPostal] || '';
      this.registroForm.patchValue({
        Ciudad: ciudad
      });
      
      // Actualizar las calles disponibles para ese código postal
      this.callesDisponibles = this.codigoPostalCalles[codigoPostal] || [];
      
      // Actualizar las colonias disponibles para ese código postal
      this.coloniasDisponibles = this.codigoPostalColonias[codigoPostal] || [];
      
      // Resetear los campos para que el usuario seleccione una de las nuevas opciones
      this.registroForm.patchValue({
        Calle: '',
        Colonia: ''
      });
    } else {
      // Si no hay código postal seleccionado, limpiar los campos relacionados
      this.registroForm.patchValue({
        Ciudad: '',
        Calle: '',
        Colonia: ''
      });
      this.callesDisponibles = [];
      this.coloniasDisponibles = [];
    }
  }

  get f() { return this.registroForm.controls; }

  get telefonosArray() {
    return this.registroForm.get('Telefonos') as FormArray;
  }

  get correosArray() {
    return this.registroForm.get('CorreoElectronico') as FormArray;
  }

  get referenciasArray() {
    return this.registroForm.get('ReferenciaFamiliar') as FormArray;
  }

  // Métodos para acceder a los FormArrays anidados dentro de ReferenciaFamiliar
  getTelefonosReferencia(referenciaIndex: number): FormArray {
    return this.referenciasArray.at(referenciaIndex).get('Telefono') as FormArray;
  }

  getCorreosReferencia(referenciaIndex: number): FormArray {
    return this.referenciasArray.at(referenciaIndex).get('CorreoElectronico') as FormArray;
  }

  crearTelefono() {
    return this.formBuilder.group({
      Lada: ['', Validators.required],
      Numero: ['', Validators.required]
    });
  }

  crearCorreo() {
    return this.formBuilder.group({
      Direccion: ['', [Validators.required, Validators.email]]
    });
  }

  crearReferencia() {
    return this.formBuilder.group({
      NombreCompleto: ['', Validators.required],
      Parentesco: ['', Validators.required],
      Telefono: this.formBuilder.array([this.crearTelefono()]),
      CorreoElectronico: this.formBuilder.array([this.crearCorreo()])
    });
  }

  agregarTelefono() {
    this.telefonosArray.push(this.crearTelefono());
  }

  agregarCorreo() {
    this.correosArray.push(this.crearCorreo());
  }

  agregarReferencia() {
    this.referenciasArray.push(this.crearReferencia());
  }

  agregarTelefonoReferencia(referenciaIndex: number) {
    this.getTelefonosReferencia(referenciaIndex).push(this.crearTelefono());
  }

  agregarCorreoReferencia(referenciaIndex: number) {
    this.getCorreosReferencia(referenciaIndex).push(this.crearCorreo());
  }

  eliminarTelefono(index: number) {
    if (this.telefonosArray.length > 1) {
      this.telefonosArray.removeAt(index);
    }
  }

  eliminarCorreo(index: number) {
    if (this.correosArray.length > 1) {
      this.correosArray.removeAt(index);
    }
  }

  eliminarReferencia(index: number) {
    if (this.referenciasArray.length > 1) {
      this.referenciasArray.removeAt(index);
    }
  }

  eliminarTelefonoReferencia(referenciaIndex: number, telefonoIndex: number) {
    const telefonos = this.getTelefonosReferencia(referenciaIndex);
    if (telefonos.length > 1) {
      telefonos.removeAt(telefonoIndex);
    }
  }

  eliminarCorreoReferencia(referenciaIndex: number, correoIndex: number) {
    const correos = this.getCorreosReferencia(referenciaIndex);
    if (correos.length > 1) {
      correos.removeAt(correoIndex);
    }
  }

  onSubmit() {
    this.submitted = true;
  
    if (this.registroForm.invalid) {
      return;
    }
  
    // Obtener los datos del formulario
    const empleadoData = this.registroForm.value;
  
    // Transformar los datos al formato correcto
    const transformedData = {
      Nombre: empleadoData.Nombre,
      ApellidoPaterno: empleadoData.ApellidoPaterno,
      ApellidoMaterno: empleadoData.ApellidoMaterno,
      FechaNacimiento: empleadoData.FechaNacimiento,
      Sexo: empleadoData.Sexo,
      Foto: empleadoData.Foto,
      Calle: empleadoData.Calle,
      NumeroExterior: empleadoData.NumeroExterior,
      NumeroInterior: empleadoData.NumeroInterior,
      Colonia: empleadoData.Colonia,
      CodigoPostal: empleadoData.CodigoPostal,
      Ciudad: empleadoData.Ciudad,
      Departamento: empleadoData.Departamento,
      Puesto: empleadoData.Puesto,
      Password: empleadoData.Password,
      
      // Agregar estos campos que el backend espera
      Lada: empleadoData.Telefonos[0]?.Lada || '',
      Telefono: empleadoData.Telefonos[0]?.Numero || '',
      Correo: empleadoData.CorreoElectronico[0]?.Direccion || '',
      
      // Mantener los arrays como antes
      Telefonos: empleadoData.Telefonos.map((telefono: any) => ({
        Lada: telefono.Lada,
        Numero: telefono.Numero
      })),
      CorreoElectronico: empleadoData.CorreoElectronico.map((correo: any) => ({
        Direccion: correo.Direccion
      })),
      ReferenciaFamiliar: empleadoData.ReferenciaFamiliar.map((referencia: any) => ({
        NombreCompleto: referencia.NombreCompleto,
        Parentesco: referencia.Parentesco,
        Telefono: referencia.Telefono.map((telefono: any) => ({
          Lada: telefono.Lada,
          Numero: telefono.Numero
        })),
        CorreoElectronico: referencia.CorreoElectronico.map((correo: any) => ({
          Direccion: correo.Direccion
        }))
      }))
    };
  
    this.empleadoService.createEmpleado(transformedData)
    .subscribe({
      next: (response) => {
        this.success = true;
        this.registroForm.reset();
        this.submitted = false;
        this.reiniciarFormulario();
        setTimeout(() => this.success = false, 3000);
      },
      error: (err) => {
        this.error = `Error al registrar empleado: ${err.message || JSON.stringify(err)}`;
        console.error('Error completo:', err);
      }
    });
  }

  previewImage() {
    // Este método se invoca cuando cambia el valor del campo Foto
    // No necesita hacer nada adicional, ya que la imagen se actualiza automáticamente en el HTML
    // mediante el binding: [src]="registroForm.get('Foto')?.value"
  }

  // Método para reiniciar el formulario correctamente incluyendo arrays
  private reiniciarFormulario() {
    // Limpiar todos los arrays
    while (this.telefonosArray.length !== 0) {
      this.telefonosArray.removeAt(0);
    }
    while (this.correosArray.length !== 0) {
      this.correosArray.removeAt(0);
    }
    while (this.referenciasArray.length !== 0) {
      this.referenciasArray.removeAt(0);
    }

    // Añadir un elemento inicial en cada array
    this.telefonosArray.push(this.crearTelefono());
    this.correosArray.push(this.crearCorreo());
    this.referenciasArray.push(this.crearReferencia());
    
    // Limpiar listas de calles y colonias
    this.callesDisponibles = [];
    this.coloniasDisponibles = [];
  }
}