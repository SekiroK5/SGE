import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroments';

export interface Actividad {
  _id?: string;
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  estado: 'pendiente' | 'en progreso' | 'completada' | 'cancelada';
  prioridad: 'baja' | 'media' | 'alta';
  responsableId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  private apiUrl = `${environment.baseURL}/auth/participacionActividad`;

  constructor(private http: HttpClient) {}

  // Obtener todas las actividades
  getActividades(): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(this.apiUrl);
  }

  // Obtener actividad por claveEmpleado
  getActividad(claveEmpleado: string): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(`${this.apiUrl}/${claveEmpleado}`);
  }

  // Crear nueva actividad (corregida para coincidir con la ruta del backend)
  crearActividad(actividad: Actividad): Observable<Actividad> {
    return this.http.post<Actividad>(`${environment.baseURL}/auth/registrar-actividad`, actividad);
  }

  // Actualizar actividad
  actualizarActividad(id: string, actividad: Actividad): Observable<Actividad> {
    return this.http.put<Actividad>(`${this.apiUrl}/${id}`, actividad);
  }

  // Eliminar actividad
  eliminarActividad(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Obtener actividades de un empleado específico
  getActividadesEmpleado(claveEmpleado: string): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(`${this.apiUrl}/${claveEmpleado}`);
  }
}
