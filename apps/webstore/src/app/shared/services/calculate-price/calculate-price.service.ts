import { Injectable } from '@angular/core';
import {
  DesignDimensionEnum,
  DesignTypeEnum,
  DiscountType,
  ErrorlogPriorityEnum,
  IDiscount,
  IPricing,
  ITransactionItem,
} from '@interfaces';
import { ErrorlogsService } from '../errorlog/errorlog.service';

@Injectable({
  providedIn: 'root',
})
export class CalculatePriceService {
  constructor(private errorlogsService: ErrorlogsService) {}

  /**
   * Determine the full price with discount for all of the products in the list combined based on the dimensions, quantity and design type.
   * @param itemList  a list of transaction items, which includes information about dimensions, quantity and design type of each item.
   * @param discount discount information.
   * @param isHomeDelivery type of delivery.
   * @param plantedTrees how many trees are planted as part of the purchase.
   * @returns calculated price with the discount and other factors applied.
   */
  calculatePrices(
    itemList: ITransactionItem[] = [],
    discount: IDiscount,
    isHomeDelivery: boolean,
    plantedTrees: number
  ): IPricing {
    // Get full price of items in basket
    const fullPrice = this.getFullPrice(itemList);
    // Get discounted price of all items
    const { discountedPrice, discountAmount } = this.calculateDiscountedPrice(fullPrice, discount);

    // Get delivery price
    const deliveryPrice = this.getDeliveryPrice(discountedPrice, isHomeDelivery);

    // Get planted trees price
    const extraTreesPrice = this.getExtraTreesPrice(plantedTrees);

    // Get final price with delivery and donation
    const finalPrice = discountedPrice + extraTreesPrice + deliveryPrice;

    // Get VAT for the final price
    const vat = this.getVat(finalPrice);

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
   * Get the price of the planted trees that come with the order.
   * @param plantedTrees the selected planted trees. At least one by default.
   * @returns the price for planted trees.
   */
  getExtraTreesPrice(plantedTrees: number): number {
    return plantedTrees > 0 ? plantedTrees * 10 - 10 : 0;
  }

  /**
   * Get the Danish VAT.
   * @param finalPrice the price of the order with the discount and planted trees applied.
   * @returns the VAT.
   */
  getVat(finalPrice: number): number {
    return Math.round(finalPrice * 0.2 * 100) / 100;
  }

  /**
   * Calculate discounted price for the given full price.
   * @param fullPrice price of the items (no delivery price).
   * @param discount the applied discount.
   * @returns discountedPrice and discountAmount.
   */
  calculateDiscountedPrice(
    fullPrice: number,
    discount: IDiscount
  ): { discountedPrice: number; discountAmount: number } {
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
    return { discountedPrice, discountAmount };
  }

  /**
   * Calculate delivery price based on the discounted price and delivery type.
   * @param discountedPrice the full price after the discount is applied.
   * @param isHomeDelivery delivery type.
   * @returns price of the delivery.
   */
  getDeliveryPrice(discountedPrice: number, isHomeDelivery: boolean): number {
    let deliveryPrice = 0;
    if (discountedPrice > 350) {
      deliveryPrice = isHomeDelivery ? 25 : 0;
    } else {
      deliveryPrice = isHomeDelivery ? 65 : 45;
    }
    return deliveryPrice;
  }

  /**
   * Determine the full price without discount for all of the products in the list combined based on the dimensions, quantity and design type.
   * @param itemList a list of transaction items, which includes information about dimensions, quantity and design type of each item.
   * @returns calculated price without any of the discounts applied.
   */
  getFullPrice(itemList: ITransactionItem[] = []): number {
    if (itemList === null) return 0;
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
            return 499;
          case DesignDimensionEnum.medium:
            return 699;
          case DesignDimensionEnum.large:
            return 999;
          default:
            this.errorlogsService.create(
              'webstore.calculate-price-service.calculate-item-unit-price-default-value',
              ErrorlogPriorityEnum.high,
              { message: 'Price set to 99999999', dimension, designType }
            );
            return 99999999;
        }
      }
      case DesignTypeEnum.quotable: {
        switch (dimension) {
          case DesignDimensionEnum.small:
            return 299;
          case DesignDimensionEnum.medium:
            return 399;
          case DesignDimensionEnum.large:
            return 499;
          default:
            this.errorlogsService.create(
              'webstore.calculate-price-service.calculate-item-unit-price-default-value',
              ErrorlogPriorityEnum.high,
              { message: 'Price set to 88888888', dimension, designType }
            );
            return 88888888;
        }
      }
    }
  }
}
