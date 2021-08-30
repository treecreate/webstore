import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalcPriceService {
  private itemList;
  private discount;

  constructor() {}

  // Setters
  setList(list) {
    this.itemList = list;
  }

  setDiscount(discount: number) {
    this.discount = discount;
  }

  // Calculations
  calcItemPrice(amount: number, size: string) {
    switch (size) {
      case 'small':
        return amount * 495;
      case 'medium':
        return amount * 695;
      case 'large':
        return amount * 995;
    }
  }

  getItemPrice(index: number) {
    return this.calcItemPrice(
      this.itemList[index].amount,
      this.itemList[index].size
    );
  }

  calcFullPrice(): number {
    let sum = 0;
    for (let i = 0; i < this.itemList.length; i++) {
      const item = this.itemList[i];
      sum += this.calcItemPrice(item.amount, item.size);
    }
    return sum;
  }

  calcFinalPrice(): number {
    return this.calcFullPrice() * (1 - this.discount);
  }

  calcDiscountAmount(): number {
    return this.calcFullPrice() * this.discount;
  }

  calcVat() {
    return this.calcFinalPrice() * 0.2;
  }

  calcDonationPrice(donatedTrees) {
    return (donatedTrees - 1) * 10;
  }
}
