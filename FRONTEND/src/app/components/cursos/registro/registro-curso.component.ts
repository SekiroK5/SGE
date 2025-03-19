import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { CursosTomado, CursosTomados, CursosTomadosService } from '../../Services/curso.service';

@Component({
  selector: 'app-registro-curso',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ],
  templateUrl: './registro-curso.component.html',
  styleUrls: ['./registro-curso.component.css']
})
export class RegistroCursoComponent implements OnInit {
  registroForm: FormGroup;
  submitted = false;
  success = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cursosTomadosService: CursosTomadosService

  ) {
    this.registroForm = this.formBuilder.group({
      claveempleado: ['', [Validators.required]],
      nombrecompletoempleado: ['', [Validators.required]],
      nombrecurso: ['', [Validators.required]],
      fechainicio: ['', [Validators.required]],
      fechatermino: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
    });
  }
  get f(){return this.registroForm.controls;}

  ngOnInit(): void {
  }
guardar():void{
  if(this.registroForm.valid){
    const nuevoCursoTomado: CursosTomados ={
      ClaveEmpleado: this.registroForm.value.claveempleado,
      NombreCompletoEmpleado: this.registroForm.value.nombrecompletoempleado,
      CursosTomados: [{
        NombreCurso: this.registroForm.value.nombrecurso,
        FechaInicio: this.registroForm.value.fechainicio ,
        FechaTermino: this.registroForm.value.fechatermino,
         TipoDocumento: [{
          Descripcion: this.registroForm.value.descripcion,
         }]
      }]
    };
    console.log('Datos enviados:',nuevoCursoTomado);

    this.cursosTomadosService.crearCursosTomados(nuevoCursoTomado).subscribe(
      (response) =>{
        this.success = true;
        this.error = '';
        this.router.navigate(['/cursos/lista']);


      },
      (error) =>{
        this.error ='Hubo un error al guardar el curso'+ error.message;
        this.success =false;


      }
    );

  }else{
    Object.keys(this.registroForm.controls).forEach(key =>{
      this.registroForm.get(key)?.markAsTouched();
    });
  }


}

cancelar():void{
  this.router.navigate(['/rh/dashboard']);
}
}