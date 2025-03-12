import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EmpleadoComponent } from './empleado.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('EmpleadoComponent', () => {
  let component: EmpleadoComponent;
  let fixture: ComponentFixture<EmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [EmpleadoComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({}))
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load default data when no ID is provided', () => {
    spyOn(console, 'log');
    component.ngOnInit();
    expect(console.log).toHaveBeenCalledWith('Loading default employee data or list');
  });

  it('should load employee data when ID is provided', () => {
    spyOn(console, 'log');
    
    // Mock the route with an ID parameter
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: {
        paramMap: of(convertToParamMap({ id: '123' }))
      }
    });
    
    // Re-create component with the new route
    fixture = TestBed.createComponent(EmpleadoComponent);
    component = fixture.componentInstance;
    
    component.ngOnInit();
    expect(component.empleadoId).toBe('123');
    expect(console.log).toHaveBeenCalledWith('Loading data for employee with ID: 123');
  });
});