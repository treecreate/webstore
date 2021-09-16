import { Injectable } from '@angular/core';
import {
  DesignDimensionEnum,
  DiscountType,
  IDiscount,
  IPricing,
  ITransactionItem,
} from '@interfaces';

@Injectable({
  providedIn: 'root',
})
export class CalculatePriceService {
  constructor() {}

  calculatePrices(
    itemList: ITransactionItem[],
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

  isMoreThan4Items(itemList: ITransactionItem[]): boolean {
    let sum = 0;
    for (let i = 0; i < itemList.length; i++) {
      sum += itemList[i].quantity;
    }
    if (sum >= 4) {
      return true;
    } else {
      return false;
    }
  }

  calculateItemPrice(item: ITransactionItem): number {
    switch (item.dimension) {
      case DesignDimensionEnum.small:
        return item.quantity * 495;
      case DesignDimensionEnum.medium:
        return item.quantity * 695;
      case DesignDimensionEnum.large:
        return item.quantity * 995;
      default:
        return 99999999;
    }
  }

  calculateItemPriceAlternative(
    quantity: number,
    dimension: DesignDimensionEnum
  ): number {
    switch (dimension) {
      case DesignDimensionEnum.small:
        return quantity * 495;
      case DesignDimensionEnum.medium:
        return quantity * 695;
      case DesignDimensionEnum.large:
        return quantity * 995;
      default:
        return 99999999;
    }
  }

  calculateItemUnitPrice(dimension: DesignDimensionEnum): number {
    switch (dimension) {
      case DesignDimensionEnum.small:
        return 495;
      case DesignDimensionEnum.medium:
        return 695;
      case DesignDimensionEnum.large:
        return 995;
      default:
        return 99999999;
    }
  }
}
