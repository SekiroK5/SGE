import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  Descripcion:  string;

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
    return this.http.post<CursosTomados>(this.apiUrl, cursostomados);
  }
  
  // Update activity
  actualizarCursosTomados(id: string, cursostomados: CursosTomados): Observable<CursosTomados> {
    return this.http.put<CursosTomados>(`${this.apiUrl}/${id}`, cursostomados);
  }
  
  // Delete activity
  eliminarCursosTomados(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  
}