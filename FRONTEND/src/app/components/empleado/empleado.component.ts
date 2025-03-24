import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmpleadoService, Empleado } from '../Services/empleado.service';
import { CursosTomadosService, CursosTomados } from '../Services/curso.service';
import { ParticipacionActividadService, ParticipacionActividad } from '../Services/actividad.service';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class EmpleadoComponent implements OnInit {
  claveEmpleado: string | null = null;
  empleado: Empleado | null = null;
  cursosTomados: CursosTomados | null = null;
  participacionActividad: ParticipacionActividad | null = null;
  loading = {
    perfil: false,
    cursos: false,
    actividades: false
  };
  error: {
    perfil: string | null,
    cursos: string | null,
    actividades: string | null
  } = {
    perfil: null,
    cursos: null,
    actividades: null
  };
  defaultProfileImage = 'assets/default-profile.png';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private empleadoService: EmpleadoService,
    private cursosTomadosService: CursosTomadosService,
    private participacionActividadService: ParticipacionActividadService,
    private authService: AuthService
  ) { }

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

  loadDefaultData(): void {
    // Load default data when no specific employee is selected
    console.log('Loading default employee data or list');
    // You might want to navigate to a different route or show a different view
  }

  // Método para navegar a la pantalla de edición
  editarEmpleado(): void {
    if (this.claveEmpleado) {
      // La navegación debe ser relativa a la ruta 'empleado'
      this.router.navigate(['empleado', 'editar', this.claveEmpleado]);
      console.log('Navegando a edición del empleado con clave:', this.claveEmpleado);
    } else {
      console.error('No hay clave de empleado para editar');
    }
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
}