import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Router} from '@angular/router'
import { environment } from '../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
    private baseURI = environment.baseURL;

    constructor(private http:HttpClient,private router : Router){}

    login(claveEmpleado: string, password:string):Observable<any>{
        return this.http.post(`${this.baseURI}/auth/login`,{claveEmpleado,password});
    }

    isLoggedIn(): boolean {
        // Lógica para verificar si el usuario está autenticado
        return !!localStorage.getItem('token'); // Ejemplo usando un token en localStorage
    }

    logout():void{
        localStorage.removeItem('token'); // Ejemplo usando un token en localStorage
        this.router.navigate(['/home']);
    }
}