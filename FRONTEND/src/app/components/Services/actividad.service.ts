import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroments';


export interface ParticipacionActividad {
  NombreActividad: string;
  Estatus: boolean;  // true = participó, false = no participó
  FechaActividad: string;  // Puede ser un string o Date dependiendo del formato que utilices
  Descripcion?: string;  // Si la descripción es opcional
}


@Injectable({
  providedIn: 'root'
})
export class ParticipacionActividadService {
  private apiUrl = `${environment.baseURL}/auth/participacionActividad`;
  
  constructor(private http: HttpClient) {}
  
 // Obtener todas las participaciones
  getParticipaciones(): Observable<ParticipacionActividad[]> {
    return this.http.get<ParticipacionActividad[]>(`${this.apiUrl}`);
  }

  // Crear una nueva participación
  createParticipacion(participacion: ParticipacionActividad): Observable<ParticipacionActividad> {
    return this.http.post<ParticipacionActividad>(`${this.apiUrl}/registrar-actividad`, participacion);//Posible error aquí :p
  }

  // Obtener una participación por clave de empleado
  getParticipacionByClave(claveEmpleado: string): Observable<ParticipacionActividad> {
    return this.http.get<ParticipacionActividad>(`${this.apiUrl}/${claveEmpleado}`);
  }

  // Actualizar una participación
  updateParticipacion(id: string, participacion: ParticipacionActividad): Observable<ParticipacionActividad> {
    return this.http.put<ParticipacionActividad>(`${this.apiUrl}/${id}`, participacion);
  }

  // Eliminar una participación
  deleteParticipacion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
