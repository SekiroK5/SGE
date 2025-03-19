import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroments';

// Actualizamos la interfaz para que coincida con los datos reales
export interface ActividadDetalle {
  _id?: string;
  NombreActividad: string;
  Estatus: boolean;
  FechaActividad: string;
  Descripcion?: string;
}

export interface ParticipacionActividad {
  _id?: string;
  ClaveEmpleado: string;
  NombreCompletoEmpleado: string;
  ParticipacionActividad: ActividadDetalle[];
  // Otras propiedades si existen
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
    return this.http.post<ParticipacionActividad>(`${this.apiUrl}/registrar-actividad`, participacion);
  
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