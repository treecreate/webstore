import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'webstore-checkout-item',
  templateUrl: './checkout-item.component.html',
  styleUrls: ['./checkout-item.component.css'],
})
export class CheckoutItemComponent implements OnInit {
  @Input() item;

  constructor() {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}
}
