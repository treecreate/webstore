import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'webstore-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: [
    './payment-success.component.css',
    './payment-success.component.sass',
  ],
})
export class PaymentSuccessComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('');
  }
}
