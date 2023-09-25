import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-patient-signup',
  templateUrl: './patient-signup.component.html',
  styles: [],
})
export class PatientSignupComponent {
  constructor(private router: Router, private location: Location) {}

  // Icons
  backIcon = faCircleArrowLeft;

  patientSignupForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    middleName: new FormControl('', []),
    lastName: new FormControl('', [Validators.required]),
    bloodGroup: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    phoneNo: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(32),
    ]),
    repeatPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(32),
    ]),
    gender: new FormControl('', [Validators.required]),
  });

  onPatientSignupSubmit() {
    console.log(this.patientSignupForm.value);
  }

  goBack() {
    this.location.back();
  }

  bloodGroups: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // getters
  get firstName(): FormControl {
    return this.patientSignupForm.get('firstName') as FormControl;
  }

  get middleName(): FormControl {
    return this.patientSignupForm.get('middleName') as FormControl;
  }

  get lastName(): FormControl {
    return this.patientSignupForm.get('lastName') as FormControl;
  }

  get bloodGroup(): FormControl {
    return this.patientSignupForm.get('bloodGroup') as FormControl;
  }

  get dob(): FormControl {
    return this.patientSignupForm.get('dob') as FormControl;
  }

  get phoneNo(): FormControl {
    return this.patientSignupForm.get('phoneNo') as FormControl;
  }

  get email(): FormControl {
    return this.patientSignupForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.patientSignupForm.get('password') as FormControl;
  }

  get repeatPassword(): FormControl {
    return this.patientSignupForm.get('repeatPassword') as FormControl;
  }

  get gender(): FormControl {
    return this.patientSignupForm.get('gender') as FormControl;
  }
}
