import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class EmpleadoComponent implements OnInit {
  empleadoId: string | null = null;
  
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Get the employee ID from the route params if available
    this.route.paramMap.subscribe(params => {
      this.empleadoId = params.get('id');
      
      if (this.empleadoId) {
        this.loadEmployeeData(this.empleadoId);
      } else {
        // Load default data or list of employees
        this.loadDefaultData();
      }
    });
  }

  loadEmployeeData(id: string): void {
    // Here you would typically call a service to get employee data
    console.log(`Loading data for employee with ID: ${id}`);
    // Example: this.employeeService.getEmployeeById(id).subscribe(data => this.employeeData = data);
  }

  loadDefaultData(): void {
    // Load default data when no specific employee is selected
    console.log('Loading default employee data or list');
    // Example: this.employeeService.getAllEmployees().subscribe(data => this.employees = data);
  }
}