import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // Ajusta esta URL a la de tu backend

  constructor(private http: HttpClient) { }

  login(credentials: { ClaveEmpleado: string, Password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          // Guardar token si tu backend lo devuelve
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          // Guardar info del usuario logueado si es necesario
          if (response.empleado) {
            localStorage.setItem('currentUser', JSON.stringify(response.empleado));
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}