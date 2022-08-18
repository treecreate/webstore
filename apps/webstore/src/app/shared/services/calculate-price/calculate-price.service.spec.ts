import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ITransactionItem } from '@interfaces';
import { CalculatePriceService } from './calculate-price.service';
import {
  calculateDiscountedPriceParams,
  calculateItemPriceAlternativeParams,
  calculateItemPriceParams,
  calculateItemUnitPriceParams,
  calculatePricesParams,
  getDeliveryPriceParams,
  getExtraTreesPriceParams,
  getFullPriceParams,
  isMoreThan4ItemsParams,
} from './test-data.constant';

describe('CalculatePriceService', () => {
  let service: CalculatePriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
    });
    service = TestBed.inject(CalculatePriceService);
  });

  describe.each(calculatePricesParams)('calculatePrices()', (params) => {
    it(`Should correctly calculate the full price of the item list with discount etc {discount: ${
      params.discount ? true : false
    }, isHomeDelivery: ${params.isHomeDelivery}, itemListLength: ${params.itemList.length}} = ${
      params.expectedPrice.finalPrice
    }`, () => {
      expect(
        service.calculatePrices(params.itemList, params.discount, params.isHomeDelivery, params.plantedTrees)
      ).toStrictEqual(params.expectedPrice);
    });
  });

  describe.each(getExtraTreesPriceParams)('getExtraTreesPrice()', (params) => {
    it(`Should correctly determine given extra planted trees price {${params.plantedTrees}} = ${params.expectedPrice}`, () => {
      expect(service.getExtraTreesPrice(params.plantedTrees)).toEqual(params.expectedPrice);
    });
  });
  describe('getVat()', () => {
    it(`Should correctly determine given VAT amount 123.45 = 24.69 VAT}`, () => {
      expect(service.getVat(123.45)).toEqual(24.69);
    });
  });

  describe.each(calculateDiscountedPriceParams)('calculateDiscountedPrice()', (params) => {
    it(`Should correctly determine given discount price {${params.fullPrice}, ${params.discount.type}: ${params.discount.amount}} = ${params.expectedPrice}`, () => {
      expect(service.calculateDiscountedPrice(params.fullPrice, params.discount)).toEqual({
        discountAmount: params.expectedDiscountedAmount,
        discountedPrice: params.expectedPrice,
      });
    });
  });

  describe.each(getDeliveryPriceParams)('getDeliveryPrice()', (params) => {
    it(`Should correctly determine given delivery price {${params.discountedPrice}, ${params.isHomeDelivery}} = ${params.expectedPrice}`, () => {
      expect(service.getDeliveryPrice(params.discountedPrice, params.isHomeDelivery)).toEqual(params.expectedPrice);
    });
  });

  describe.each(getFullPriceParams)('getFullPrice()', (params) => {
    it(`Should correctly calculate the full price of the item list without discounts etc { itemListLength: ${params.itemList.length}} = ${params.expectedPrice}`, () => {
      expect(service.getFullPrice(params.itemList)).toBe(params.expectedPrice);
    });
  });

  describe.each(isMoreThan4ItemsParams)('isMoreThan4()', (params) => {
    it(`Should correctly determine if there are more than 4 items in the basket {actual quantity: ${params.actualQuantity}} = ${params.expected}`, () => {
      expect(service.isMoreThan4Items(params.itemList)).toBe(params.expected);
    });
  });

  describe.each(calculateItemUnitPriceParams)('calculateItemUnitPrice()', (params) => {
    it(`Should correctly determine given item price {${params.dimension}, ${params.designType}} = ${params.expectedPrice}`, () => {
      expect(service.calculateItemUnitPrice(params.dimension, params.designType)).toEqual(params.expectedPrice);
    });
  });

  describe.each(calculateItemPriceAlternativeParams)('calculateItemPriceAlternative()', (params) => {
    it(`Should correctly determine given item price {${params.quantity}, ${params.dimension}, ${params.designType}} = ${params.expectedPrice}`, () => {
      expect(service.calculateItemPriceAlternative(params.quantity, params.dimension, params.designType)).toEqual(
        params.expectedPrice
      );
    });
  });

  describe.each(calculateItemPriceParams)('calculateItemPrice()', (params) => {
    it(`Should correctly determine given item price {${params.quantity}, ${params.dimension}, ${params.designType}} = ${params.expectedPrice}`, () => {
      const item: ITransactionItem = {
        quantity: params.quantity,
        dimension: params.dimension,
        design: { designType: params.designType, designId: null, designProperties: null, mutable: true, user: null },
        transactionItemId: null,
        orderId: null,
      };
      expect(service.calculateItemPrice(item)).toEqual(params.expectedPrice);
    });
  });
});
