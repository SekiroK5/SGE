import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [MatIconModule, FormsModule], // Importamos FormsModule para ngModel
})
export class LoginComponent {
  passwordVisible: boolean = false;
  authData = { claveEmpleado: '', password: '' };

  constructor(
    private router: Router,
    private modalService: NgbModal, // Correcta inyección del servicio NgbModal
    private authService: AuthService
  ) {}

  // Método para cerrar el modal
  closeModal() {
    this.modalService.dismissAll();
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onLogin() {
    this.authService.login(this.authData.claveEmpleado, this.authData.password).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor', response);
        alert(response.message);

        if (response.claveEmpleado) {
          console.log('Clave del usuario:', response.claveEmpleado);
        }

        this.modalService.dismissAll(); // Cierra el modal
        //this.router.navigate(['/menu']);
      },
      error: (error) => {
        console.error('Error:', error);
        alert('Credenciales inválidas.');
      }
    });
  }
}