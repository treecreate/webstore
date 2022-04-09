import { Injectable } from '@angular/core';
import { DesignDimensionEnum, DiscountType, IDiscount, IPricing, ITransactionItem } from '@interfaces';

@Injectable({
  providedIn: 'root',
})
export class CalculatePriceService {
  constructor() {}

  calculatePrices(
    itemList: ITransactionItem[] = [],
    discount: IDiscount,
    isHomeDelivery: boolean,
    plantedTrees: number
  ): IPricing {
    // Get full price of items in basket
    const fullPrice = this.getFullPrice(itemList);

    // Get discounted price of all items
    let discountedPrice = fullPrice;
    if (discount !== null) {
      if (discount.type === DiscountType.percent) {
        // Discount in percent
        discountedPrice = fullPrice * (1 - discount.amount / 100);
      } else {
        // Discount in specific amount
        discountedPrice = fullPrice - discount.amount;
      }
    }
    // Get discounted amount / amount saved
    const discountAmount = fullPrice - discountedPrice;

    // Get delivery price
    let deliveryPrice = 0;
    if (discountedPrice > 350) {
      deliveryPrice = isHomeDelivery ? 10 : 0;
    } else {
      deliveryPrice = isHomeDelivery ? 55 : 45;
    }

    // Get planted trees price
    const extraTreesPrice = plantedTrees * 10 - 10;

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

  getFullPrice(itemList: ITransactionItem[] = []): number {
    if (itemList === null) return 0;
    let priceSum = 0;
    for (let i = 0; i < itemList.length; i++) {
      switch (itemList[i].dimension) {
        case DesignDimensionEnum.large:
          priceSum += itemList[i].quantity * 995;
          break;
        case DesignDimensionEnum.medium:
          priceSum += itemList[i].quantity * 695;
          break;
        case DesignDimensionEnum.small:
          priceSum += itemList[i].quantity * 495;
          break;
      }
    }
    return priceSum;
  }

  isMoreThan4Items(itemList: ITransactionItem[] = []): boolean {
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

  calculateItemPriceAlternative(quantity: number, dimension: DesignDimensionEnum): number {
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
