import { Injectable } from '@angular/core';
import { DesignDimensionEnum, DesignTypeEnum, DiscountType, IDiscount, IPricing, ITransactionItem } from '@interfaces';

@Injectable({
  providedIn: 'root',
})
export class CalculatePriceService {
  constructor() {}

  /**
   * Determine the full price with discount for all of the products in the list combined based on the dimensions, quantity and design type.
   * @param itemList  a list of transaction items, which includes information about dimensions, quantity and design type of each item.
   * @param discount discount information.
   * @param isHomeDelivery type of delivery.
   * @param plantedTrees how many trees are planted as part of the purchase.
   * @returns calculated price with the discount and other factors applied.
   */
  calculatePrices(
    itemList: ITransactionItem[],
    discount: IDiscount,
    isHomeDelivery: boolean,
    plantedTrees: number
  ): IPricing {
    // Get full price of items in basket
    let sum = 0;
    if (itemList != null) {
      for (let i = 0; i < itemList.length; i++) {
        const item = itemList[i];
        sum += this.calculateItemPrice(item);
      }
    }
    const fullPrice = sum;

    // Get discounted price of all items
    let discountedPrice = fullPrice;
    if (discount !== null) {
      if (discount.type === DiscountType.percent) {
        // Discount in percent
        discountedPrice = fullPrice * (1 - discount.amount / 100);
        discountedPrice = Math.round(discountedPrice * 100) / 100;
      } else {
        // Discount in specific amount
        discountedPrice = fullPrice - discount.amount;
      }
    }

    if (discountedPrice < 0) {
      discountedPrice = 0;
    }
    // Get discounted amount / amount saved
    const discountAmount = Math.round((fullPrice - discountedPrice) * 100) / 100;

    // Get delivery price
    const deliveryPrice = isHomeDelivery ? 29 : 0;

    // Get planted trees price
    const extraTreesPrice = plantedTrees > 0 ? plantedTrees * 10 - 10 : 0;

    // Get final price with delivery and donation
    const finalPrice = discountedPrice + extraTreesPrice + deliveryPrice;

    // Get VAT for the final price
    const vat = Math.round(finalPrice * 0.2 * 100) / 100;

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

  /**
   * Determine the full price without discount for all of the products in the list combined based on the dimensions, quantity and design type.
   * @param itemList a list of transaction items, which includes information about dimensions, quantity and design type of each item.
   * @returns calculated price without any of the discounts applied.
   */
  getFullPrice(itemList: ITransactionItem[]): number {
    let priceSum = 0;
    for (let i = 0; i < itemList.length; i++) {
      priceSum += this.calculateItemPrice(itemList[i]);
    }
    return priceSum;
  }

  /**
   * Whether the given itemList satisfies the requirement for reduced price based on quantity purchased.
   * @param itemList the list of transaction items that includes quantity data.
   * @returns whether or not it satisfies the requirement.
   */
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

  /**
   * Determine the price for the given transaction item based on its dimensions, quantity and type.
   * @param item the transaction item with dimensions, quantity and design type information.
   * @returns calculated price.
   */
  calculateItemPrice(item: ITransactionItem): number {
    return this.calculateItemUnitPrice(item.dimension, item.design.designType) * item.quantity;
  }

  /**
   * Calculate the price for the given item based on its dimensions, quantity and type.
   * @param dimension dimensions of the given item.
   * @param quantity amount of items.
   * @param designType design type of the given item.
   * @returns calculated price.
   */
  calculateItemPriceAlternative(quantity: number, dimension: DesignDimensionEnum, designType: DesignTypeEnum): number {
    return this.calculateItemUnitPrice(dimension, designType) * quantity;
  }

  /**
   * Calculate the price for the given item based on its dimensions and type.
   * @param dimension dimensions of the given item.
   * @param designType design type of the given item.
   * @returns calculated price.
   */
  calculateItemUnitPrice(dimension: DesignDimensionEnum, designType: DesignTypeEnum): number {
    switch (designType) {
      case DesignTypeEnum.familyTree: {
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
      case DesignTypeEnum.quotable: {
        switch (dimension) {
          case DesignDimensionEnum.small:
            return 349;
          case DesignDimensionEnum.medium:
            return 499;
          case DesignDimensionEnum.large:
            return 599;
          default:
            return 88888888;
        }
      }
    }
  }
}
