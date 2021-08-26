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
  // TODO: get actual items in basket from API
  basketItems = [
    {
      title: 'First design',
      size: 'small',
      amount: 2,
    },
    {
      title: 'Second design',
      size: 'large',
      amount: 1,
    },
    {
      title: 'Last design',
      size: 'medium',
      amount: 2,
    },
  ];

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
    console.log('basket');
  }
}
