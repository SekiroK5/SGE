
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroments';

export interface Empleado {
  _id?: string;  // Optional, si el _id se asigna automáticamente en MongoDB
  ClaveEmpleado: string;
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  RFC: string;
  FechaNacimiento: Date;
  Sexo:String;
  Foto: String;
  Calle: String;
  NumeroInterior:String;
  NumeroExterior:String;
  Colonia:String;
  CodigoPostal:String;
  Ciudad: String;
  Departamento:String;
  Puesto:String;
  Telefonos:Telefonos[];
  CorreoElectronico:CorreoElectronico[];
  ReferenciaFamiliar:ReferenciaFamiliar[];
  Password:String;
  

}
export interface Telefonos{
    Lada:String;
    Numero:String;
}

export interface CorreoElectronico{
Direccion: String;

}
export interface ReferenciaFamiliar{
    NombreCompleto:String;
    Parentesco: String;
    Telefono: Telefonos[];
    CorreoElectronico: CorreoElectronico[];

}



@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = `${environment.baseURL}/auth/empleados`;
  
  constructor(private http: HttpClient) {}
  
 // Obtener todas los Empleados
  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.apiUrl}`);
  }

  // Crear un Empleado
  createEmpleados(empleado: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(`${this.apiUrl}/register`, empleado); 
  }

  // Obtener una Empleado por su clave
  getEmpleadoByClave(claveEmpleado: string): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/${claveEmpleado}`);
  }

  // Actualizar un Empleado
  updateEmpleado(claveEmpleado: string, empleado: Empleado): Observable<Empleado> {
    return this.http.put<Empleado>(`${this.apiUrl}/${claveEmpleado}`, empleado);
  }

  // Eliminar un Empleado
  deleteEmpleado(claveEmpleado: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${claveEmpleado}`);
  }
}