import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmployeeAddDialogComponent } from '../employee-add-dialog/employee-add-dialog.component';
import { Employee } from '../../models/Employee.model';
import { EmployeesService } from '../../services/employees.service';
import { TableModule } from 'primeng/table';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    DynamicDialogModule
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  cols = [
    { field: 'firstName', header: 'First Name' },
    { field: 'lastName', header: 'Last Name' },
    { field: 'age', header: 'Age' },
    { field: 'dob', header: 'Birth Date' },
    { field: 'email', header: 'Email' },
    { field: 'salary', header: 'Salary' },
    { field: 'address', header: 'Address' },
    { field: 'contactNumber', header: 'Phone' }
  ];
  totalRecords = 0;
  rows = 10;
  globalFilter = '';

  constructor(
    private employeesService: EmployeesService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.employeesService.getEmployees().subscribe(data => {
      this.employees = data;
      this.totalRecords = data.length;
    });
  }

  confirmDelete(employee: Employee) {
    this.confirmationService.confirm({
      message: `Do you want to delete Delete ${employee.firstName} ${employee.lastName}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      accept: () => {
        this.employees = this.employees.filter(e => e.id !== employee.id);
        this.totalRecords = this.employees.length
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: `${employee.firstName} ${employee.lastName} removed`
        });
      }
    });
  }

  showAddDialog() {
    const ref = this.dialogService.open(EmployeeAddDialogComponent, {
      header: 'Add New Employee',
      width: '500px'
    });

    ref.onClose.subscribe((newEmployee: Employee) => {
      if (newEmployee) {
        newEmployee.id = this.generateId();
        console.log("🚀 ~ EmployeeListComponent ~ ref.onClose.subscribe ~ newEmployee:", newEmployee)
        this.employees = [newEmployee, ...this.employees];
        console.log("🚀 ~ EmployeeListComponent ~ ref.onClose.subscribe ~ this.employees:", this.employees)
        this.totalRecords = this.employees.length
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: `${newEmployee.firstName} ${newEmployee.lastName} added`
        });
      }
    });
  }
isValidDate(date: any): boolean {
  return date && !isNaN(new Date(date).getTime());
}
isValidSalary(salary: any): boolean {
  return salary !== null && salary !== undefined && !isNaN(parseFloat(salary)) && isFinite(salary);
}
  private generateId(): string {
    return uuidv4();
  }
}
