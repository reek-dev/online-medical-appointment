import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DoctorSignupComponent } from './components/doctor-signup/doctor-signup.component';
import { PatientSignupComponent } from './components/patient-signup/patient-signup.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthInterceptor } from './shared/authconfig.interceptor';
import { DoctorComponent } from './components/doctor/doctor.component';
import { PaymentComponent } from './components/payment/payment.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { PaymentCancelComponent } from './components/payment-cancel/payment-cancel.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DoctorSignupComponent,
    PatientSignupComponent,
    HeaderComponent,
    FooterComponent,
    AdminComponent,
    DoctorComponent,
    PaymentComponent,
    PaymentSuccessComponent,
    PaymentCancelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
