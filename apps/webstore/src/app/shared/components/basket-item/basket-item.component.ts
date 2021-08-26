import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'webstore-basket-item',
  templateUrl: './basket-item.component.html',
  styleUrls: [
    './basket-item.component.css',
    '../../../../assets/styles/tc-input-field.scss',
  ],
})
export class BasketItemComponent implements OnInit {
  @Input() item;

  constructor() {}

  calcPrice(size: string, amount: number) {
    switch (size) {
      case 'small':
        return 495 * amount;
      case 'medium':
        return 695 * amount;
      case 'large':
        return 995 * amount;
    }
  }

  ngOnInit(): void {
    console.log('basket item');
  }
}
