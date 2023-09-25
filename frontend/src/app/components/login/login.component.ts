import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import {
  IconDefinition,
  faCircleCheck,
  faCircleXmark,
  faHospitalUser,
  faLock,
  faRightToBracket,
  faUserDoctor,
} from '@fortawesome/free-solid-svg-icons';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent {
  constructor(
    private router: Router,
    private _authService: AuthService,
    private _userService: UserService
  ) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(32),
    ]),
  });

  loginSuccessful: boolean = false;
  invalidCredentials: boolean = false;
  displaySignupModal: boolean = false;

  // Icons
  loginIcon: IconDefinition = faRightToBracket;
  lockIcon: IconDefinition = faLock;
  greenFilledCheckedIcon: IconDefinition = faCircleCheck;
  redFilledCrossIcon: IconDefinition = faCircleXmark;
  redHollowCrossIcon: IconDefinition = faCircleXmark;
  doctorIcon: IconDefinition = faUserDoctor;
  patientIcon: IconDefinition = faHospitalUser;

  doctorSignupClicked() {
    this.router.navigate(['/reg-d']);
  }
  patientSignupClicked() {
    this.router.navigate(['/reg-p']);
  }

  InputValid(field: string) {
    if (
      this.loginForm.get(`${field}`)?.touched ||
      this.loginForm.get(`${field}`)?.dirty
    ) {
      if (this.loginForm.get(`${field}`)?.valid) {
        return { 'border-color': 'green' };
      } else {
        return { 'border-color': 'red' };
      }
    }
    return {};
  }

  onSignupClick(): void {
    this.displaySignupModal = true;
  }

  onCloseSignup(): void {
    this.displaySignupModal = false;
  }

  onLoginSubmit(): void {
    this._authService
      .login({
        email: this.loginForm.get('email')!.value as string,
        password: this.loginForm.get('password')!.value as string,
      })
      .subscribe({
        next: (v) => {
          this.invalidCredentials = false;
          this.loginSuccessful = true;
          setTimeout(() => console.log('login successful'), 1000);

          this._userService.getUser(v.id).subscribe({
            next: (user) => {
              const userRole = user.role;
              let route: string | undefined;

              switch (userRole) {
                case 'A':
                  route = '/admin';
                  break;
                case 'D':
                  route = '/doctor';
                  break;
                case 'P':
                  route: '/patient';
                  break;
                default:
                  break;
              }

              this.router.navigate([route]);
            },
            error: (err) => {},
          });
        },

        complete: () => console.info('login process complete.'),
      });
  }

  get email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }
  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }
}
