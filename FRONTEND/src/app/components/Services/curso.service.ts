import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroments';

export interface CursosTomados {
  _id?: string;
  ClaveEmpleado: string;
  NombreCompletoEmpleado: string;
  CursosTomados: CursosTomado[]
}

export interface TipoDocumento {
  Descripcion: string;
}

export interface CursosTomado{
  NombreCurso: string;
  FechaInicio: string;
  FechaTermino: string;
  TipoDocumento: TipoDocumento[];
}

@Injectable({
  providedIn: 'root'
})
export class CursosTomadosService {
  private apiUrl = `${environment.baseURL}/auth/cursosTomados`;
  
  constructor(private http: HttpClient) {}
  
  // Get all activities
  getCursosTomados(): Observable<CursosTomados[]> {
    return this.http.get<CursosTomados[]>(this.apiUrl);
  }
  
  // Get activity by ID
  getCursosTomadosbyId(id: string): Observable<CursosTomados> {
    return this.http.get<CursosTomados>(`${this.apiUrl}/${id}`);
  }
  
  // Create new activity
  crearCursosTomados(cursostomados: CursosTomados): Observable<CursosTomados> {
    return this.http.post<CursosTomados>(`${this.apiUrl}/registrar-cursos`, cursostomados);
  }
  
  // Update activity
  actualizarCursosTomados(id: string, cursostomados: CursosTomados): Observable<CursosTomados> {
    return this.http.put<CursosTomados>(`${this.apiUrl}/${id}`, cursostomados);
  }
  
  // Delete activity
  eliminarCursosTomados(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  // Método específico para actualizar sólo las fechas de un curso
 // Método específico para actualizar sólo las fechas de un curso
actualizarFechasCurso(id: string, claveEmpleado: string, nombreCompleto: string, 
  fechaInicio: string, fechaTermino: string): Observable<any> {
// Creamos un objeto que contiene solo los datos necesarios para actualizar las fechas
const updateData = {
_id: id,
ClaveEmpleado: claveEmpleado,
NombreCompletoEmpleado: nombreCompleto,
actualizarFechas: true, // Indicador para el backend de que solo actualizamos fechas
CursosTomados: [{
FechaInicio: fechaInicio,
FechaTermino: fechaTermino
}]
};

return this.http.put<any>(`${this.apiUrl}/${id}`, updateData);
}

  saveCursoTomado(curso: CursosTomados): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    return this.http.post<any>(`${this.apiUrl}/registrar-cursos`, curso, httpOptions);
  }
}