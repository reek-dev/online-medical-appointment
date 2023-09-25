import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SpecializationService {
  constructor(private http: HttpClient) {}

  fetchSpecializations() {
    return this.http
      .get<{
        status: string;
        data: Array<{ id: number; name: string; description: string }>;
      }>('http://localhost:8600/api/v1/sp')
      .pipe(
        map((a) => a.data.map((sp) => sp.name)),
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent)
            console.error(error.error.message);
          else
            console.error(
              `Backend returned code ${error.status}, body was: ${error.error}`
            );

          return throwError(() => error);
        })
      );
  }
}
