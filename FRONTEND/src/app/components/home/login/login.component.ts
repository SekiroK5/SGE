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
    // Si el usuario ya está autenticado, redirigir al dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
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
      console.log('Login exitoso:', response);
      this.loading = false;
      if (response.token) {
        console.log('Token recibido, redirigiendo a dashboard');
      } else {
        console.warn('No se recibió token del servidor');
      }
      // Intentar redirigir después de un breve retraso
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 100);
    },
    error: (err) => {
      console.error('Error completo:', err);
      this.loading = false;
      if (err.status === 401) {
        this.error = 'Clave de empleado o contraseña incorrectos';
      } else {
        this.error = 'Error al iniciar sesión. Intente más tarde.';
      }
    }
  });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }
}