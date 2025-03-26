import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' 
})
export class AddressService {
  private apiUrl = 'https://api.copomex.com/query/info_cp';
  private token = 'e31b4a0e-7830-40a1-8d61-76603968ec4e';

  constructor(private http: HttpClient) {}

  getDireccion(codigoPostal: string): Observable<any> {
    // Format URL according to documentation: endpoint/codigoPostal?type=simplified&token=YOUR_TOKEN
    const url = `${this.apiUrl}/${codigoPostal}`;
    return this.http.get<any>(url, { 
      params: { 
        token: this.token 
      }
    });
  }
}