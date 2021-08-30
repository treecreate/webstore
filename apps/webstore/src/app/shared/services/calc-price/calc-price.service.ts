import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalcPriceService {
  private itemList;
  private discount;
  private isHomeDelivery;

  constructor() {}

  // Setters
  setList(list) {
    this.itemList = list;
  }
  setDiscount(discount: number) {
    this.discount = discount;
  }
  setDelivery(isHomeDelivery: boolean) {
    this.isHomeDelivery = isHomeDelivery;
  }
  setAll(list, discount: number, isHomeDelivery: boolean) {
    this.setList(list);
    this.setDiscount(discount);
    this.setDelivery(isHomeDelivery);
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

  getDeliveryPrice() {
    if (this.isHomeDelivery) {
      return 29;
    } else {
      return 0;
    }
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
    if (this.isHomeDelivery) {
      return this.calcFullPrice() * (1 - this.discount) + 29;
    } else {
      return this.calcFullPrice() * (1 - this.discount);
    }
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

  // For print
  calcItemPricePrint(amount: number, size: string) {
    return this.calcItemPrice(amount, size).toFixed(2);
  }

  getItemPricePrint(index: number) {
    return this.getItemPrice(index).toFixed(2);
  }

  getDeliveryPricePrint() {
    return this.getDeliveryPrice().toFixed(2);
  }

  calcFullPricePrint() {
    return this.calcFullPrice().toFixed(2);
  }

  calcFinalPricePrint() {
    return this.calcFinalPrice().toFixed(2);
  }

  calcDiscountAmountPrint() {
    return this.calcDiscountAmount().toFixed(2);
  }

  calcVatPrint() {
    return this.calcVat().toFixed(2);
  }

  calcDonationPricePrint() {
    return this.calcDiscountAmount().toFixed(2);
  }
}
