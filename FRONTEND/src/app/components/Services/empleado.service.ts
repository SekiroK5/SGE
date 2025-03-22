import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroments';

export interface Telefonos {
    Lada: string;
    Numero: string;
}

export interface CorreoElectronico {
    Direccion: string;
}

export interface ReferenciaFamiliar {
    NombreCompleto: string;
    Parentesco: string;
    Telefono: Telefonos[];
    CorreoElectronico: CorreoElectronico[]; // Ahora es un array de objetos
}

export interface Empleado {
    _id?: string;  
    ClaveEmpleado?: string; // Opcional, ya que se genera en el backend
    Nombre: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    RFC?: string; // Opcional, ya que se genera en el backend
    FechaNacimiento: Date;
    Sexo: string;
    Foto?: string;
    Calle: string;
    NumeroInterior?: string;
    NumeroExterior: string;
    Colonia: string;
    CodigoPostal: string;
    Ciudad: string;
    Departamento: string;
    Puesto: string;
    Telefonos: Telefonos[];
    CorreoElectronico: CorreoElectronico[];
    ReferenciaFamiliar: ReferenciaFamiliar[];
    Password: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = `${environment.baseURL}/auth/empleados`;
  
  constructor(private http: HttpClient) {}
  
  // Obtener todos los Empleados
  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.apiUrl}`);
  }

  // Crear un Empleado
  createEmpleado(empleado: Empleado): Observable<Empleado> {
    // Asegurarse de que la estructura sea la correcta antes de enviar
    const empleadoToSend = this.prepareEmpleadoData(empleado);
    return this.http.post<Empleado>(`${environment.baseURL}/auth/register`, empleadoToSend); 
  }

  // Obtener una Empleado por su clave
  getEmpleadoByClave(claveEmpleado: string): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/${claveEmpleado}`);
  }

  // Actualizar un Empleado
  updateEmpleado(claveEmpleado: string, empleado: Empleado): Observable<Empleado> {
    const empleadoToUpdate = this.prepareEmpleadoData(empleado);
    return this.http.put<Empleado>(`${this.apiUrl}/${claveEmpleado}`, empleadoToUpdate);
  }

  // Eliminar un Empleado
  deleteEmpleado(claveEmpleado: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${claveEmpleado}`);
  }
  
  // Preparar datos del empleado para asegurar compatibilidad con el backend
  private prepareEmpleadoData(empleado: Empleado): any {
    // Crear una copia para no modificar el original
    const preparedEmpleado = { ...empleado };
    
    // Asegurar que CorreoElectronico tenga la estructura correcta
    if (preparedEmpleado.CorreoElectronico && preparedEmpleado.CorreoElectronico.length === 0) {
      preparedEmpleado.CorreoElectronico = [{ Direccion: '' }];
    }
    
    // Asegurar que Telefonos tenga la estructura correcta
    if (preparedEmpleado.Telefonos && preparedEmpleado.Telefonos.length === 0) {
      preparedEmpleado.Telefonos = [{ Lada: '', Numero: '' }];
    }
    
    // Asegurar que ReferenciaFamiliar tenga la estructura correcta
    if (preparedEmpleado.ReferenciaFamiliar && preparedEmpleado.ReferenciaFamiliar.length === 0) {
      preparedEmpleado.ReferenciaFamiliar = [{
        NombreCompleto: 'Por especificar',
        Parentesco: 'Por especificar',
        Telefono: [{ Lada: '000', Numero: '0000000' }],
        CorreoElectronico: [{ Direccion: 'por.especificar@example.com' }]
      }];
    } else if (preparedEmpleado.ReferenciaFamiliar && preparedEmpleado.ReferenciaFamiliar.length > 0) {
      // Asegurar que cada referencia familiar tenga la estructura correcta
      preparedEmpleado.ReferenciaFamiliar = preparedEmpleado.ReferenciaFamiliar.map(ref => {
        // Asegurar que Telefono esté como array
        if (!ref.Telefono || !Array.isArray(ref.Telefono)) {
          ref.Telefono = [{ Lada: '000', Numero: '0000000' }];
        }
        
        // Asegurar que CorreoElectronico esté como array de objetos
        if (!ref.CorreoElectronico || !Array.isArray(ref.CorreoElectronico)) {
          // Si es un string (como parece manejar el backend), convertirlo a objeto
          if (typeof ref.CorreoElectronico === 'string') {
            ref.CorreoElectronico = [{ Direccion: ref.CorreoElectronico }];
          } else {
            ref.CorreoElectronico = [{ Direccion: 'por.especificar@example.com' }];
          }
        }
        
        return ref;
      });
    }
    
    return preparedEmpleado;
  }
  
  // Obtener empleados por filtros (nombre, departamento)
  getEmpleadosByFilters(nombre?: string, departamento?: string): Observable<Empleado[]> {
    let url = `${this.apiUrl}/filter?`;
    
    if (nombre) {
      url += `nombre=${nombre}&`;
    }
    
    if (departamento) {
      url += `departamento=${departamento}`;
    }
    
    return this.http.get<Empleado[]>(url);
  }
}