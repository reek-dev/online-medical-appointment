import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { Credential } from './../models/credential.model';
import { Doctor } from './../models/doctor.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _endpoint = `http://localhost:8600`;

  constructor(private http: HttpClient) {}

  doctorSignUp(details: Doctor): Observable<{ status: string; token: string }> {
    return this.http
      .post<{ status: string; token: string }>(
        `${this._endpoint}/api/v1/auth/register/doctor`,
        details
      )
      .pipe(
        tap((response) => localStorage.setItem('access_token', response.token))
      );
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    return localStorage.getItem('access_token') !== null ? true : false;
  }

  login(credentials: Credential) {
    return this.http
      .post<{ id: number; status: string; token: string }>(
        `${this._endpoint}/api/v1/auth/login`,
        credentials
      )
      .pipe(
        tap((response) => localStorage.setItem('access_token', response.token)),
        catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse) {
    let msg = '';
    // this means client-side error
    if (error.error instanceof ErrorEvent) msg = error.error.message;
    // this means server-side error
    else msg = `Error code: ${error.status}\nMessage: ${error.message}`;
    return throwError(() => msg);
  }
}
