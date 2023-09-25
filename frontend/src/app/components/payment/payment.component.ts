import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  constructor(
    private _paymentService: PaymentService,
    private router: Router
  ) {}

  makePayment() {
    this._paymentService
      .doPayment({
        items: [
          {
            id: 1,
            quantity: 2,
            price: 20000,
            name: 'Sneakers',
          },
        ],
      })
      .subscribe({
        next: (v: any) => {
          console.log("done");
          window.open(v?.url, "_blank");
        },
        
      });
  }
}
