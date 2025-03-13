import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-employee-add-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    ButtonModule
  ],
  templateUrl: './employee-add-dialog.component.html',
  styleUrl: './employee-add-dialog.component.css'
})
export class EmployeeAddDialogComponent {
  submitted = false;
  maxDate!: Date;
  employeeForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    dob: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    salary: [null, Validators.required],
    address: ['', Validators.required],
    contactNumber: [null, Validators.required],
    age: [{ value: null as number | null, disabled: true }]
  });

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef
  ) { }

  ngOnInit(): void {
    const today = new Date();
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    this.employeeForm.get('dob')?.valueChanges.subscribe(dobValue => {
      if (dobValue) {
        const birthDate = new Date(dobValue);
        const calculatedAge = this.calculateAge(birthDate);
        this.employeeForm.get('age')?.setValue(calculatedAge);
      } else {
        this.employeeForm.get('age')?.setValue(null);
      }
    });
  }

  // Helper method to calculate age based on the birth date
  calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  submit() {
    this.submitted = true;
    if (this.employeeForm.valid) {
      this.ref.close(this.employeeForm.getRawValue());
    }
  }
}
