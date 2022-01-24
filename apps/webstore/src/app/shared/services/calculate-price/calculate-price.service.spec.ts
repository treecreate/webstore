import { TestBed } from '@angular/core/testing';
import { TreeDesignEnum } from '@assets';
import {
  DesignDimensionEnum,
  DesignTypeEnum,
  DiscountType,
  FamilyTreeFontEnum,
  IPricing,
  ITransactionItem,
  IUser,
} from '@interfaces';
import { UserRoles } from '@models';
import { CalculatePriceService } from './calculate-price.service';

describe('CalculatePriceService', () => {
  let service: CalculatePriceService;
  const itemListInfo = {
    discount: {
      discountCode: '',
      type: DiscountType.percent,
      amount: 10,
      remainingUses: 1,
      totalUses: 0,
      isEnabled: true,
    },
    isHomeDelivery: true,
    plantedTrees: 1,
  };
  const mockUser: IUser = {
    userId: '1',
    email: 'mock@hotdeals.dev',
    roles: [UserRoles.user],
  };
  const itemList: ITransactionItem[] = [
    {
      design: {
        designId: '1',
        designProperties: {
          title: 'first design',
          font: FamilyTreeFontEnum.roboto,
          backgroundTreeDesign: TreeDesignEnum.tree1,
          boxSize: 10,
          banner: undefined,
          largeFont: true,
          boxes: [],
        },
        user: mockUser,
        designType: DesignTypeEnum.familyTree,
        mutable: false,
      },
      dimension: DesignDimensionEnum.small,
      quantity: 2,
      orderId: '123',
      transactionItemId: '1',
    },
    {
      design: {
        designId: '1',
        designProperties: {
          title: 'second design',
          font: FamilyTreeFontEnum.roboto,
          backgroundTreeDesign: TreeDesignEnum.tree2,
          boxSize: 10,
          banner: undefined,
          largeFont: true,
          boxes: [],
        },
        user: mockUser,
        designType: DesignTypeEnum.familyTree,
        mutable: false,
      },
      dimension: DesignDimensionEnum.medium,
      quantity: 1,
      orderId: '123',
      transactionItemId: '1',
    },
    {
      design: {
        designId: '1',
        designProperties: {
          title: 'third design',
          font: FamilyTreeFontEnum.roboto,
          backgroundTreeDesign: TreeDesignEnum.tree1,
          boxSize: 10,
          banner: undefined,
          largeFont: true,
          boxes: [],
        },
        user: mockUser,
        designType: DesignTypeEnum.familyTree,
        mutable: false,
      },
      dimension: DesignDimensionEnum.large,
      quantity: 1,
      orderId: '123',
      transactionItemId: '1',
    },
  ];

  const secondItemListInfo = {
    discount: {
      discountCode: '',
      type: DiscountType.amount,
      amount: 495,
      remainingUses: 1,
      totalUses: 0,
      isEnabled: true,
    },
    isHomeDelivery: false,
    plantedTrees: 3,
  };
  const secondItemList: ITransactionItem[] = [
    {
      design: {
        designId: '1',
        designProperties: {
          title: 'second design',
          font: FamilyTreeFontEnum.roboto,
          backgroundTreeDesign: TreeDesignEnum.tree1,
          boxSize: 10,
          banner: undefined,
          largeFont: true,
          boxes: [],
        },
        user: mockUser,
        designType: DesignTypeEnum.familyTree,
        mutable: false,
      },
      dimension: DesignDimensionEnum.medium,
      quantity: 2,
      orderId: '123',
      transactionItemId: '1',
    },
    {
      design: {
        designId: '1',
        designProperties: {
          title: 'third design',
          font: FamilyTreeFontEnum.roboto,
          backgroundTreeDesign: TreeDesignEnum.tree2,
          boxSize: 10,
          banner: undefined,
          largeFont: true,
          boxes: [],
        },
        user: mockUser,
        designType: DesignTypeEnum.familyTree,
        mutable: false,
      },
      dimension: DesignDimensionEnum.large,
      quantity: 1,
      orderId: '123',
      transactionItemId: '1',
    },
  ];

  let priceInfo: IPricing;
  let secondPriceInfo: IPricing;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatePriceService);

    priceInfo = service.calculatePrices(
      itemList,
      itemListInfo.discount,
      itemListInfo.isHomeDelivery,
      itemListInfo.plantedTrees
    );
    secondPriceInfo = service.calculatePrices(
      secondItemList,
      secondItemListInfo.discount,
      secondItemListInfo.isHomeDelivery,
      secondItemListInfo.plantedTrees
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should return true if there are more than 4 items in the basket', () => {
    expect(service.isMoreThan4Items(itemList)).toBeTruthy();
  });

  it('Should return false if there are less than 4 items in the basket', () => {
    expect(service.isMoreThan4Items(secondItemList)).toBeFalsy();
  });

  it('Should calculate the item price correctly', () => {
    expect(service.calculateItemPrice(itemList[0])).toEqual(990);
    expect(service.calculateItemPrice(itemList[1])).toEqual(695);
    expect(service.calculateItemPrice(itemList[2])).toEqual(995);
    expect(service.calculateItemPrice(secondItemList[0])).toEqual(1390);
    expect(service.calculateItemPrice(secondItemList[1])).toEqual(995);
  });

  it('Should return the right unit prices for all design', () => {
    expect(service.calculateItemUnitPrice(itemList[0].dimension)).toEqual(495);
    expect(service.calculateItemUnitPrice(itemList[1].dimension)).toEqual(695);
    expect(service.calculateItemUnitPrice(itemList[2].dimension)).toEqual(995);
  });

  it('Should calculate the full price correctly', () => {
    // 495 + 495 + 695 + 995
    expect(priceInfo.fullPrice).toEqual(2680);
    // 695 + 695 + 995
    expect(secondPriceInfo.fullPrice).toEqual(2385);
  });

  it('Should calculate the right discountedPrice', () => {
    // 2680 * 0.9
    expect(priceInfo.discountedPrice).toEqual(2412);
    // 2395 - 495
    expect(secondPriceInfo.discountedPrice).toEqual(1890);
  });

  it('Should calculate the right discountAmount', () => {
    // 2680 * 0.1
    expect(priceInfo.discountAmount).toEqual(268);
    // 495
    expect(secondPriceInfo.discountAmount).toEqual(495);
  });

  it('Should calculate the finalPrice correctly', () => {
    // ( 2680 * 0.9 ) + 29 + 0
    expect(priceInfo.finalPrice).toEqual(2441);
    // ( 2385 - 495 ) + 0 + 30
    expect(secondPriceInfo.finalPrice).toEqual(1910);
  });

  it('Should calculate the right delivery price', () => {
    // isHomeDelivery = true
    expect(priceInfo.deliveryPrice).toEqual(29);
    // isHomeDelivery = false
    expect(secondPriceInfo.deliveryPrice).toEqual(0);
  });

  it('Should calculate the right donation price', () => {
    // 1 planted tree
    expect(priceInfo.extraTreesPrice).toEqual(0);
    // 3 planted trees
    expect(secondPriceInfo.extraTreesPrice).toEqual(20);
  });

  it('Should calculate the right VAT price', () => {
    // 2441 * 0.2
    expect(priceInfo.vat.toFixed(2)).toEqual('488.20');
    // 1910 * 0.2
    expect(secondPriceInfo.vat).toEqual(382);
  });
});
