import { Injectable } from '@angular/core';
import { DiscountType, IDesign, IDiscount, IPricing } from '@interfaces';

@Injectable({
  providedIn: 'root',
})
export class CalculatePriceService {
  constructor() {}

  calculatePrices(
    itemList: IDesign[],
    discount: IDiscount,
    isHomeDelivery: boolean,
    donatedTrees: number
  ): IPricing {
    // Get full price of items in basket
    let sum = 0;
    for (let i = 0; i < itemList.length; i++) {
      const item = itemList[i];
      sum += this.calculateItemPrice(item);
    }
    const fullPrice = sum;

    // Get discounted price of all items
    let discountedPrice;
    if (discount.type === DiscountType.percent) {
      // Discount in percent
      discountedPrice = fullPrice * (1 - discount.amount);
    } else {
      // Discount in specific amount
      discountedPrice = fullPrice - discount.amount;
    }

    // Get discounted amount / amount saved
    const discountAmount = fullPrice - discountedPrice;

    // Get delivery price
    const deliveryPrice = isHomeDelivery ? 29 : 0;

    // Get donated trees price
    const extraTreesPrice = donatedTrees * 10;

    // Get final price with delivery and donation
    const finalPrice = discountedPrice + extraTreesPrice + deliveryPrice;

    // Get VAT for the final price
    const vat = finalPrice * 0.2;

    return {
      fullPrice,
      discountedPrice,
      finalPrice,
      discountAmount,
      deliveryPrice,
      extraTreesPrice,
      vat,
    };
  }

  isMoreThan4Items(itemList: IDesign[]): boolean {
    let sum = 0;
    for (let i = 0; i < itemList.length; i++) {
      sum += itemList[i].amount;
    }
    if (sum >= 4) {
      return true;
    } else {
      return false;
    }
  }

  calculateItemPrice(item: IDesign): number {
    switch (item.size) {
      case 'small':
        return item.amount * 495;
      case 'medium':
        return item.amount * 695;
      case 'large':
        return item.amount * 995;
    }
  }

  calculateItemPriceAlternative(amount: number, size: string): number {
    switch (size) {
      case '20cm x 20cm':
        return amount * 495;
      case '25cm x 25cm':
        return amount * 695;
      case '30cm x 30cm':
        return amount * 995;
    }
  }

  calculateItemUnitPrice(itemSize): number {
    switch (itemSize) {
      case 'small':
        return 495;
      case 'medium':
        return 695;
      case 'large':
        return 995;
    }
  }
}
