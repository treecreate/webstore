import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ITransactionItem } from '@interfaces';
import { CalculatePriceService } from './calculate-price.service';
import {
  calculateItemPriceAlternativeParams,
  calculateItemPriceParams,
  calculateItemUnitPriceParams,
  calculatePricesParams,
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

  describe.each(isMoreThan4ItemsParams)('isMoreThan4()', (params) => {
    it(`Should correctly determine if there are more than 4 items in the basket {actual quantity: ${params.actualQuantity}} = ${params.expected}`, () => {
      expect(service.isMoreThan4Items(params.itemList)).toBe(params.expected);
    });
  });

  describe.each(getFullPriceParams)('getFullPrice()', (params) => {
    it(`Should correctly calculate the full price of the item list without discounts etc { itemListLength: ${params.itemList.length}} = ${params.expectedPrice}`, () => {
      expect(service.getFullPrice(params.itemList)).toBe(params.expectedPrice);
    });
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
});
