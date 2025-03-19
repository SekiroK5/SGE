import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../Services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  authData = {
    claveEmpleado: '',
    password: ''
  };
  passwordVisible = false;
  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si el usuario ya está autenticado, redirigir según su rol
    if (this.authService.isLoggedIn()) {
      try {
        // Usamos getUserDepartment() en lugar de getUserData()
        const departamento = this.authService.getUserDepartment().toUpperCase();
        
        // Verificar si el departamento es "Sin asignar" - en ese caso cerrar sesión
        if (departamento === 'SIN ASIGNAR') {
          this.error = 'Su cuenta está temporalmente inactiva. Contacte a Recursos Humanos.';
          this.authService.logout();
          return;
        }
        
        if (departamento) {
          if (departamento === 'RH' || departamento === 'RECURSOS HUMANOS') {
            this.router.navigate(['/rh/dashboard']);
          } else {
            this.router.navigate(['/empleado']);
          }
        }
      } catch (error) {
        console.error('Error al procesar datos de sesión:', error);
        this.authService.logout();
      }
    }
  }
  
  onLogin(): void {
    if (!this.authData.claveEmpleado || !this.authData.password) {
      this.error = 'Por favor, complete todos los campos';
      return;
    }
  
    this.loading = true;
    this.error = '';
  
    // Convertir los nombres de campos a como los espera el backend
    const credentials = {
      ClaveEmpleado: this.authData.claveEmpleado,
      Password: this.authData.password
    };
  
    this.authService.login(credentials)
    .subscribe({
      next: (response) => {
        this.loading = false;
        
        // Verificar si el departamento es "Sin asignar"
        if (response.usuario && response.usuario.departamento) {
          const departamento = response.usuario.departamento.toUpperCase();
          
          if (departamento === 'SIN ASIGNAR') {
            // El empleado está temporalmente dado de baja
            this.error = 'Su cuenta está temporalmente inactiva. Contacte a Recursos Humanos.';
            
            // Cerrar la sesión que se acaba de crear
            this.authService.logout();
            return;
          }
          
          console.log('Login exitoso:', response);
          
          // Cerrar el modal primero
          this.closeModal();
          
          // Redirigir según el departamento
          if (departamento === 'RH' || departamento === 'RECURSOS HUMANOS') {
            this.router.navigate(['/rh/dashboard'])
              .then(() => console.log('Navegación a RH exitosa'))
              .catch(err => console.error('Error en navegación a RH:', err));
          } else {
            this.router.navigate(['/empleado'])
              .then(() => console.log('Navegación a Empleado exitosa'))
              .catch(err => console.error('Error en navegación a Empleado:', err));
          }
        } else {
          console.warn('No se recibió información de departamento');
          this.error = 'Error al obtener información del usuario.';
          this.authService.logout();
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Error al iniciar sesión. Verifique sus credenciales.';
        }
        console.error('Error en login:', err);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  closeModal(): void {
    // Primero cierra el modal
    this.modalService.dismissAll();
    
    // Luego navega a la página de inicio
    this.router.navigate(['/home']);
  }
}