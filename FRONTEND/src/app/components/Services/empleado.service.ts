import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../enviroments/enviroments';
import { tap, catchError } from 'rxjs/operators';

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
 // En EmpleadoService, mejoremos la estructura del método updateEmpleado:

updateEmpleado(claveEmpleado: string, empleado: any): Observable<any> {
  console.log('Datos originales recibidos para actualizar:', JSON.stringify(empleado));
  
  // 1. Crear una copia limpia
  const empleadoLimpio: any = {};
  
  // 2. Copiar solo los campos específicos que queremos actualizar
  // Campos básicos
  const camposBasicos = [
    'Nombre', 'ApellidoPaterno', 'ApellidoMaterno', 'RFC', 
    'FechaNacimiento', 'Sexo', 'Calle', 'NumeroExterior',
    'NumeroInterior', 'Colonia', 'CodigoPostal', 'Ciudad',
    'Departamento', 'Puesto', 'Foto'
  ];
  
  camposBasicos.forEach(campo => {
    if (empleado[campo] !== undefined) {
      empleadoLimpio[campo] = empleado[campo];
    }
  });
  
  // 3. Manejar arrays específicamente
  
  // Teléfonos
  if (empleado.Telefonos && Array.isArray(empleado.Telefonos)) {
    empleadoLimpio.Telefonos = empleado.Telefonos
      .filter((tel: any) => tel && tel.Lada && tel.Numero)
      .map((tel: any) => ({
        Lada: tel.Lada,
        Numero: tel.Numero
      }));
  }
  
  // Correos
  if (empleado.CorreoElectronico && Array.isArray(empleado.CorreoElectronico)) {
    empleadoLimpio.CorreoElectronico = empleado.CorreoElectronico
      .filter((correo: any) => correo && correo.Direccion)
      .map((correo: any) => ({
        Direccion: correo.Direccion
      }));
  }
  
  // Referencias
  if (empleado.ReferenciaFamiliar && Array.isArray(empleado.ReferenciaFamiliar)) {
    empleadoLimpio.ReferenciaFamiliar = empleado.ReferenciaFamiliar
      .filter((ref: any) => ref && ref.NombreCompleto && ref.Parentesco)
      .map((ref: any) => {
        const referencia: any = {
          NombreCompleto: ref.NombreCompleto,
          Parentesco: ref.Parentesco
        };
        
        // Teléfonos de referencia
        if (ref.Telefono && Array.isArray(ref.Telefono)) {
          referencia.Telefono = ref.Telefono
            .filter((tel: any) => tel && tel.Lada && tel.Numero)
            .map((tel: any) => ({
              Lada: tel.Lada,
              Numero: tel.Numero
            }));
        } else {
          referencia.Telefono = [];
        }
        
        // Correos de referencia - Ajustado para manejar formato array o string
        if (ref.CorreoElectronico) {
          if (Array.isArray(ref.CorreoElectronico)) {
            referencia.CorreoElectronico = ref.CorreoElectronico
              .filter((correo: any) => correo && correo.Direccion)
              .map((correo: any) => ({
                Direccion: correo.Direccion
              }));
          } else if (typeof ref.CorreoElectronico === 'string') {
            // Si es string, convertir a formato de array
            referencia.CorreoElectronico = [{
              Direccion: ref.CorreoElectronico
            }];
          } else {
            referencia.CorreoElectronico = [];
          }
        } else {
          referencia.CorreoElectronico = [];
        }
        
        return referencia;
      });
  }
  
  // 4. Asegurarse de NO enviar contraseña
  if (empleado.Password) {
    // Si viene una contraseña, no la incluimos en el objeto a enviar
    console.log('Se recibió contraseña en el empleado original, NO se enviará al backend');
  }
  
  // 5. Formatear fecha si es necesario
  if (empleadoLimpio.FechaNacimiento) {
    try {
      const fecha = new Date(empleadoLimpio.FechaNacimiento);
      if (!isNaN(fecha.getTime())) {
        empleadoLimpio.FechaNacimiento = fecha.toISOString().split('T')[0];
      }
    } catch (error) {
      console.error('Error al formatear fecha:', error);
    }
  }
  
  console.log('Datos procesados que se enviarán:', JSON.stringify(empleadoLimpio));
  
  // 6. Verificar URL correcta
  const url = `${this.apiUrl}/${claveEmpleado}`;
  console.log('URL para actualización:', url);
  
  // 7. Utilizar content-type adecuado
  const headers = { 'Content-Type': 'application/json' };
  
  // 8. Hacer la petición
  return this.http.put<any>(url, empleadoLimpio, { headers })
    .pipe(
      tap((response: any) => {
        console.log('Respuesta exitosa del servidor:', response);
      }),
      catchError((error: any) => {
        console.error('Error del servidor al actualizar:', error);
        // Incluir más detalles en el error si están disponibles
        if (error.error) {
          console.error('Detalles del error:', error.error);
        }
        return throwError(() => error);
      })
    );
}

  // Eliminar un Empleado
  deleteEmpleado(claveEmpleado: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${claveEmpleado}`);
  }

  // Desactivar temporalmente un empleado
desactivarEmpleado(claveEmpleado: string): Observable<any> {
  return this.http.put(`${environment.baseURL}/auth/desactiva/${claveEmpleado}`, {});
}

// Activar temporalmente un empleado
activarEmpleado(claveEmpleado: string): Observable<any> {
  return this.http.put(`${environment.baseURL}/auth/activa/${claveEmpleado}`, {});
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

