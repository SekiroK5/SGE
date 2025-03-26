import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpleadoService, Empleado } from '../Services/empleado.service';
import { CursosTomadosService, CursosTomados } from '../Services/curso.service';
import { ParticipacionActividadService, ParticipacionActividad } from '../Services/actividad.service';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class EmpleadoComponent implements OnInit {
  claveEmpleado: string | null = null;
  empleado: Empleado | null = null;
  empleadoOriginal: Empleado | null = null; // Para mantener una copia del estado original
  cursosTomados: CursosTomados | null = null;
  participacionActividad: ParticipacionActividad | null = null;
  cursoForm: FormGroup;
  showCursoForm = false; // Para controlar la visibilidad del formulario
  
  loading = {
    perfil: false,
    cursos: false,
    actividades: false,
    guardando: false
  };
  
  error: {
    perfil: string | null,
    cursos: string | null,
    actividades: string | null,
    guardado: string | null
  } = {
    perfil: null,
    cursos: null,
    actividades: null,
    guardado: null
  };
  
  defaultProfileImage = 'assets/default-profile.png';
  editMode = false; // Controla si estamos en modo edición
  successMessage: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private empleadoService: EmpleadoService,
    private cursosTomadosService: CursosTomadosService,
    private participacionActividadService: ParticipacionActividadService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { 
    // Inicializar el formulario
    this.cursoForm = this.formBuilder.group({
      nombrecurso: ['', [Validators.required]],
      fechainicio: ['', [Validators.required]],
      fechatermino: ['', [Validators.required]],
      descripcion: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Primero intentamos obtener la clave del empleado desde la ruta
    this.route.paramMap.subscribe(params => {
      const routeClaveEmpleado = params.get('claveEmpleado');
      
      // Si hay una clave en la ruta, la usamos
      if (routeClaveEmpleado) {
        this.claveEmpleado = routeClaveEmpleado;
      } 
      // Si no hay clave en la ruta, intentamos obtenerla del localStorage
      else {
        this.claveEmpleado = localStorage.getItem('claveEmpleado');
      }
      
      // Si tenemos una clave, cargamos los datos
      if (this.claveEmpleado) {
        this.loadEmployeeData(this.claveEmpleado);
        this.loadEmployeeCourses(this.claveEmpleado);
        this.loadEmployeeActivities(this.claveEmpleado);
      } else {
        // Si no hay clave en ningún lado, redirigimos al login
        console.log('No se encontró clave de empleado, redirigiendo al login');
        this.router.navigate(['/login']);
      }
    });
  }

  loadEmployeeData(id: string): void {
    this.loading.perfil = true;
    this.empleadoService.getEmpleadoByClave(id).subscribe({
      next: (data: Empleado) => {
        this.empleado = data;
        // Hacemos una copia profunda para poder revertir cambios si es necesario
        this.empleadoOriginal = JSON.parse(JSON.stringify(data));
        this.loading.perfil = false;
      },
      error: (err: any) => {
        console.error('Error loading employee data:', err);
        this.error.perfil = 'Error al cargar datos del empleado';
        this.loading.perfil = false;
      }
    });
  }

  loadEmployeeCourses(id: string): void {
    this.loading.cursos = true;
    this.cursosTomadosService.getCursosTomadosbyId(id).subscribe({
      next: (data: CursosTomados) => {
        this.cursosTomados = data;
        this.loading.cursos = false;
      },
      error: (err: any) => {
        console.error('Error loading courses data:', err);
        this.error.cursos = 'Error al cargar los cursos del empleado';
        this.loading.cursos = false;
      }
    });
  }

  loadEmployeeActivities(id: string): void {
    this.loading.actividades = true;
    this.participacionActividadService.getParticipacionByClave(id).subscribe({
      next: (data: ParticipacionActividad) => {
        this.participacionActividad = data;
        this.loading.actividades = false;
      },
      error: (err: any) => {
        console.error('Error loading activities data:', err);
        this.error.actividades = 'Error al cargar las actividades del empleado';
        this.loading.actividades = false;
      }
    });
  }

  // Método para alternar el modo de edición
  toggleEditMode(): void {
    if (this.editMode) {
      // Si estábamos en modo edición, preguntamos si quiere descartar cambios
      if (confirm('¿Desea descartar los cambios?')) {
        // Restauramos los datos originales
        if (this.empleadoOriginal) {
          this.empleado = JSON.parse(JSON.stringify(this.empleadoOriginal));
        }
        this.editMode = false;
      }
    } else {
      // Activamos el modo edición
      this.editMode = true;
      this.error.guardado = null;
      this.successMessage = null;
    }
  }

  // Método para mostrar/ocultar el formulario de curso
  toggleCursoForm(): void {
    this.showCursoForm = !this.showCursoForm;
    if (!this.showCursoForm) {
      this.cursoForm.reset();
    }
  }

  // Método para guardar el nuevo curso
  guardarCurso(): void {
    if (!this.cursoForm.valid || !this.empleado || !this.empleado.ClaveEmpleado) {
      return;
    }
    
    // Asignar la clave a una constante verificada para evitar errores de tipo
    const claveEmpleado = this.empleado.ClaveEmpleado as string;
    
    // Usar esta constante en vez de acceder directamente a la propiedad
    const nuevoCursoTomado: CursosTomados = {
      ClaveEmpleado: claveEmpleado,
      NombreCompletoEmpleado: `${this.empleado.Nombre || ''} ${this.empleado.ApellidoPaterno || ''} ${this.empleado.ApellidoMaterno || ''}`.trim(),
      CursosTomados: [{
        NombreCurso: this.cursoForm.value.nombrecurso,
        FechaInicio: this.cursoForm.value.fechainicio,
        FechaTermino: this.cursoForm.value.fechatermino,
        TipoDocumento: [{
          Descripcion: this.cursoForm.value.descripcion
        }]
      }]
    };
    
    // Y usar la misma constante cuando creamos cursosTomados
    this.cursosTomadosService.saveCursoTomado(nuevoCursoTomado).subscribe({
      next: (response: any) => {
        // Actualizar la lista de cursos
        if (this.cursosTomados && this.cursosTomados.CursosTomados) {
          this.cursosTomados.CursosTomados.push(nuevoCursoTomado.CursosTomados[0]);
        } else {
          this.cursosTomados = {
            ClaveEmpleado: claveEmpleado, // Usar la constante aquí también
            NombreCompletoEmpleado: nuevoCursoTomado.NombreCompletoEmpleado,
            CursosTomados: [...nuevoCursoTomado.CursosTomados]
          };
        }
        
        // Resto del código...
      },
      error: (err: any) => {
        // Manejo de errores...
      }
    });
  }

  // Método para añadir un nuevo teléfono
  addTelefono(): void {
    if (!this.empleado) return;
    
    if (!this.empleado.Telefonos) {
      this.empleado.Telefonos = [];
    }
    
    this.empleado.Telefonos.push({
      Lada: '',
      Numero: ''
    });
  }

  // Método para eliminar un teléfono
  removeTelefono(index: number): void {
    if (!this.empleado || !this.empleado.Telefonos) return;
    
    this.empleado.Telefonos.splice(index, 1);
  }

  // Método para añadir un nuevo correo
  addCorreo(): void {
    if (!this.empleado) return;
    
    if (!this.empleado.CorreoElectronico) {
      this.empleado.CorreoElectronico = [];
    }
    
    this.empleado.CorreoElectronico.push({
      Direccion: ''
    });
  }

  // Método para eliminar un correo
  removeCorreo(index: number): void {
    if (!this.empleado || !this.empleado.CorreoElectronico) return;
    
    this.empleado.CorreoElectronico.splice(index, 1);
  }

  // Método para añadir una nueva referencia familiar
  addReferencia(): void {
    if (!this.empleado) return;
    
    if (!this.empleado.ReferenciaFamiliar) {
      this.empleado.ReferenciaFamiliar = [];
    }
    
    this.empleado.ReferenciaFamiliar.push({
      NombreCompleto: '',
      Parentesco: '',
      Telefono: [{ Lada: '', Numero: '' }],
      CorreoElectronico: [{ Direccion: '' }]
    });
  }

  // Método para eliminar una referencia familiar
  removeReferencia(index: number): void {
    if (!this.empleado || !this.empleado.ReferenciaFamiliar) return;
    
    this.empleado.ReferenciaFamiliar.splice(index, 1);
  }

  // Método para guardar los cambios
  guardarCambios(): void {
    if (!this.empleado || !this.claveEmpleado) return;
    
    this.loading.guardando = true;
    this.error.guardado = null;
    this.successMessage = null;
    
    this.empleadoService.updateEmpleado(this.claveEmpleado, this.empleado).subscribe({
      next: (response: any) => {
        console.log('Empleado actualizado correctamente:', response);
        // Actualizamos nuestra copia del estado original
        this.empleadoOriginal = JSON.parse(JSON.stringify(this.empleado));
        this.loading.guardando = false;
        this.editMode = false;
        this.successMessage = 'Datos actualizados correctamente';
        
        // Mostrar mensaje de éxito por 3 segundos
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err: any) => {
        console.error('Error al actualizar empleado:', err);
        this.error.guardado = 'Error al guardar los cambios: ' + (err.message || 'Error de conexión');
        this.loading.guardando = false;
      }
    });
  }

  // Método para cancelar la edición y volver al modo visualización
  cancelarEdicion(): void {
    // Restauramos los datos originales
    if (this.empleadoOriginal) {
      this.empleado = JSON.parse(JSON.stringify(this.empleadoOriginal));
    }
    this.editMode = false;
    this.error.guardado = null;
    this.successMessage = null;
  }

  cerrarSesion(): void {
    // Usar el método logout del AuthService
    this.authService.logout();
    
    // También eliminar la claveEmpleado ya que no se limpia en el AuthService.logout()
    localStorage.removeItem('claveEmpleado');
    localStorage.removeItem('userDepartment');
    
    // Navegar a la página home
    this.router.navigate(['/home']);
  }

  handleImageError(event: any): void {
    event.target.src = this.defaultProfileImage;
  }

  // Método para verificar si un campo existe y tiene contenido
  hasContent(obj: any, field: string): boolean {
    return obj && obj[field] && (
      (Array.isArray(obj[field]) && obj[field].length > 0) || 
      (!Array.isArray(obj[field]) && obj[field])
    );
  }

  // Método para añadir un nuevo teléfono a una referencia familiar
  addTelefonoReferencia(referenciaIndex: number): void {
    if (!this.empleado || !this.empleado.ReferenciaFamiliar) return;
    
    if (!this.empleado.ReferenciaFamiliar[referenciaIndex].Telefono) {
      this.empleado.ReferenciaFamiliar[referenciaIndex].Telefono = [];
    }
    
    this.empleado.ReferenciaFamiliar[referenciaIndex].Telefono.push({
      Lada: '',
      Numero: ''
    });
  }

  // Método para eliminar un teléfono de una referencia familiar
  // Método para eliminar un teléfono de una referencia familiar
  removeTelefonoReferencia(referenciaIndex: number, telefonoIndex: number): void {
    if (!this.empleado || 
        !this.empleado.ReferenciaFamiliar || 
        !this.empleado.ReferenciaFamiliar[referenciaIndex].Telefono) return;
    
    this.empleado.ReferenciaFamiliar[referenciaIndex].Telefono.splice(telefonoIndex, 1);
  }

  // Método para añadir un nuevo correo a una referencia familiar
  addCorreoReferencia(referenciaIndex: number): void {
    if (!this.empleado || !this.empleado.ReferenciaFamiliar) return;
    
    // Verificar si CorreoElectronico es un array
    if (!Array.isArray(this.empleado.ReferenciaFamiliar[referenciaIndex].CorreoElectronico)) {
      // Si es un string, convertirlo a array
      const correoActual = this.empleado.ReferenciaFamiliar[referenciaIndex].CorreoElectronico;
      this.empleado.ReferenciaFamiliar[referenciaIndex].CorreoElectronico = [];
      
      if (correoActual && typeof correoActual === 'string' && correoActual !== 'sin.correo@example.com') {
        this.empleado.ReferenciaFamiliar[referenciaIndex].CorreoElectronico.push({
          Direccion: correoActual
        });
      }
    }
    
    // Ahora añadimos el nuevo correo
    this.empleado.ReferenciaFamiliar[referenciaIndex].CorreoElectronico.push({
      Direccion: ''
    });
  }

  // Método para eliminar un correo de una referencia familiar
  removeCorreoReferencia(referenciaIndex: number, correoIndex: number): void {
    if (!this.empleado || 
        !this.empleado.ReferenciaFamiliar || 
        !Array.isArray(this.empleado.ReferenciaFamiliar[referenciaIndex].CorreoElectronico)) return;
    
    this.empleado.ReferenciaFamiliar[referenciaIndex].CorreoElectronico.splice(correoIndex, 1);
  }

  // Método para verificar si un valor es un array
  isArray(value: any): boolean {
    return Array.isArray(value);
  }
}