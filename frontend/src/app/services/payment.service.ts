import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private _endpoint = `http://localhost:8600`;

  constructor(private http: HttpClient) {}

  doPayment(data: any) {
    return this.http.post(`${this._endpoint}/checkout`, data);
  }
}
