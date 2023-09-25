import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorSignupComponent } from './components/doctor-signup/doctor-signup.component';
import { LoginComponent } from './components/login/login.component';
import { PatientSignupComponent } from './components/patient-signup/patient-signup.component';
import { DoctorComponent } from './components/doctor/doctor.component';
import { authGuard } from './guards/auth.guard';
import { AdminComponent } from './components/admin/admin.component';
import { PaymentComponent } from './components/payment/payment.component';
import { PaymentCancelComponent } from './components/payment-cancel/payment-cancel.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'reg-d', component: DoctorSignupComponent },
  { path: 'reg-p', component: PatientSignupComponent },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
  { path: 'doctor', component: DoctorComponent, canActivate: [authGuard] },
  { path: 'pay', component: PaymentComponent },
  { path: 'success', component: PaymentSuccessComponent },
  { path: 'cancel', component: PaymentCancelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
