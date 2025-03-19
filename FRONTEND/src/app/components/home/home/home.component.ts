import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private modalService: NgbModal, private router: Router) {}

  openModal() {
    // Limpiar cualquier token de autenticación existente
    localStorage.removeItem('token'); // Ajusta esto según la clave que uses
    sessionStorage.clear();
    
    // Navegar a la página de login en lugar de abrir un modal
    this.router.navigate(['/login']);
  }
}