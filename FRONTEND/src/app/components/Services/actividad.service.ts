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

export interface AsignacionActividad {
  actividadId: string;
  empleadoId: string;
  fechaAsignacion: Date;
  comentarios?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  private apiUrl = `${environment.baseURL}/api/participacionActividad`;
  
  constructor(private http: HttpClient) {}
  
  // Get all activities
  getActividades(): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(this.apiUrl);
  }
  
  // Get activity by ID
  getActividad(id: string): Observable<Actividad> {
    return this.http.get<Actividad>(`${this.apiUrl}/${id}`);
  }
  
  // Create new activity
  crearActividad(actividad: Actividad): Observable<Actividad> {
    return this.http.post<Actividad>(this.apiUrl, actividad);
  }
  
  // Update activity
  actualizarActividad(id: string, actividad: Actividad): Observable<Actividad> {
    return this.http.put<Actividad>(`${this.apiUrl}/${id}`, actividad);
  }
  
  // Delete activity
  eliminarActividad(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  // Assign activity to employee
  asignarActividad(asignacion: AsignacionActividad): Observable<any> {
    return this.http.post(`${this.apiUrl}/asignar`, asignacion);
  }
  
  // Get activities assigned to specific employee
  getActividadesEmpleado(empleadoId: string): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(`${this.apiUrl}/empleado/${empleadoId}`);
  }
}