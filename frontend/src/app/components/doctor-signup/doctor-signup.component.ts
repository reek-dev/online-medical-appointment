import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { SpecializationService } from 'src/app/services/specialization.service';

@Component({
  selector: 'app-doctor-signup',
  templateUrl: './doctor-signup.component.html',
  styles: [],
})
export class DoctorSignupComponent implements OnInit {
  constructor(
    private location: Location,
    private _authService: AuthService,
    private _specializationService: SpecializationService
  ) {}

  specializations: string[] = [];

  ngOnInit(): void {
    this._specializationService.fetchSpecializations().subscribe({
      next: (v) => {
        this.specializations = v;
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        console.log('specializations fetched successfully.');
      },
    });
  }

  doctorSignupForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    middleName: new FormControl('', []),
    lastName: new FormControl('', [Validators.required]),
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
    dob: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    licenseNo: new FormControl('', [Validators.required]),
    is_generalist: new FormControl('', [Validators.required]),
    specialization: new FormControl(''),
  });

  // Icons
  backIcon = faCircleArrowLeft;

  today: Date = new Date();
  todaysDate: string = `${this.today.getFullYear()}-${String(
    this.today.getMonth() + 1
  ).padStart(2, '0')}-${String(this.today.getDate()).padStart(2, '0')}`;

  goBack() {
    this.location.back();
  }

  generalistButton(event: any) {
    if (event.target.value === 'true') {
      this.doctorSignupForm.controls.specialization.setValue('');
    }
  }

  get firstName(): FormControl {
    return this.doctorSignupForm.get('firstName') as FormControl;
  }

  get middleName(): FormControl {
    return this.doctorSignupForm.get('middleName') as FormControl;
  }

  get lastName(): FormControl {
    return this.doctorSignupForm.get('lastName') as FormControl;
  }

  get phoneNo(): FormControl {
    return this.doctorSignupForm.get('phoneNo') as FormControl;
  }

  get email(): FormControl {
    return this.doctorSignupForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.doctorSignupForm.get('password') as FormControl;
  }

  get repeatPassword(): FormControl {
    return this.doctorSignupForm.get('repeatPassword') as FormControl;
  }

  get dob(): FormControl {
    return this.doctorSignupForm.get('dob') as FormControl;
  }

  get gender(): FormControl {
    return this.doctorSignupForm.get('gender') as FormControl;
  }

  get licenseNo(): FormControl {
    return this.doctorSignupForm.get('licenseNo') as FormControl;
  }

  get is_generalist(): FormControl {
    return this.doctorSignupForm.get('is_generalist') as FormControl;
  }

  get specialization(): FormControl {
    return this.doctorSignupForm.get('specialization') as FormControl;
  }

  onDoctorSignupSubmit(): void {
    this._authService
      .doctorSignUp({
        email: this.email!.value as string,
        password: this.password!.value as string,
        first_name: this.firstName!.value as string,
        middle_name: this.middleName!.value as string,
        last_name: this.lastName!.value as string,
        phone_no: this.phoneNo!.value as string,
        gender: this.gender!.value as string,
        dob: this.dob!.value as string,
        license_no: this.licenseNo!.value as string,
        yoe: 0,
        is_generalist:
          (this.is_generalist!.value as string) === 'true' ? true : false,
        is_specialist:
          (this.is_generalist!.value as string) === 'true' ? false : true,
        specialization: this.specialization!.value as string,
      })
      .subscribe({
        next: (v) => {
          console.log(v);
        },
        error: (e) => {
          console.error(e.error);
        },
        complete: () => console.info('doctor signup process complete.'),
      });
  }
}
