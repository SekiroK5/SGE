import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon'; //me marca error de localizacion
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; //me marca error de localizacion


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule],
  templateUrl:'./home.component.html',
  providers:[NgbModal],
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private modalService: NgbModal, private router: Router) {} //me marca error con el modalService

    openModal() {
      const modalRef = this.modalService.open(LoginComponent, {
        backdrop: 'static',
        size: 'md',
        centered: true
      });
    }
}