import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'webstore-basket',
  templateUrl: './basket.component.html',
  styleUrls: [
    './basket.component.scss',
    '../../../../assets/styles/tc-input-field.scss',
  ],
})
export class BasketComponent implements OnInit {
  basketItems = [
    {
      image: 'default',
      title: 'first design',
      size: 'small',
      amount: 2,
    },
    {
      image: 'default',
      title: 'second design',
      size: 'large',
      amount: 1,
    },
    {
      image: 'default',
      title: 'last design',
      size: 'medium',
      amount: 2,
    },
  ];

  calcItemPrice(size: string, amount: number) {
    switch (size) {
      case 'small':
        return 495 * amount;
      case 'medium':
        return 695 * amount;
      case 'large':
        return 995 * amount;
    }
  }

  calcFinalPrice(...prices: number[]): number {
    let sum = 0;
    for (let i = 0; i < prices.length; i++) {
      sum += prices[i];
    }
    return sum;
  }

  calcVat(finalPrice: number) {
    return finalPrice * 0.2;
  }

  constructor() {}

  ngOnInit(): void {
    console.log(this.basketItems);
  }
}
