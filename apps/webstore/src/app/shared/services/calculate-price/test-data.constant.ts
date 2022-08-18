import {
  DesignDimensionEnum,
  DesignTypeEnum,
  DiscountType,
  IDesign,
  IDiscount,
  IPricing,
  ITransactionItem,
} from '@interfaces';

// ======================================================================== //
// ============================== Constants =============================== //
// ======================================================================== //

const treeDesign: IDesign = {
  designType: DesignTypeEnum.familyTree,
  designId: null,
  designProperties: null,
  mutable: true,
  user: null,
};

const quotableDesign: IDesign = {
  designType: DesignTypeEnum.quotable,
  designId: null,
  designProperties: null,
  mutable: true,
  user: null,
};

const discountAmount100: IDiscount = {
  discountCode: null,
  type: DiscountType.amount,
  amount: 100,
  remainingUses: 1,
  totalUses: 0,
  isEnabled: true,
};

const discountAmount200: IDiscount = {
  discountCode: null,
  type: DiscountType.amount,
  amount: 200,
  remainingUses: 1,
  totalUses: 0,
  isEnabled: true,
};

const discountPercent10: IDiscount = {
  discountCode: null,
  type: DiscountType.percent,
  amount: 10,
  remainingUses: 1,
  totalUses: 0,
  isEnabled: true,
};

const singleTreeItemList: ITransactionItem[] = [
  {
    design: treeDesign,
    dimension: DesignDimensionEnum.small,
    quantity: 1,
    orderId: null,
    transactionItemId: null,
  },
];
const multipleTreeItemList: ITransactionItem[] = [
  {
    design: treeDesign,
    dimension: DesignDimensionEnum.small,
    quantity: 1,
    orderId: null,
    transactionItemId: null,
  },
  {
    design: treeDesign,
    dimension: DesignDimensionEnum.medium,
    quantity: 1,
    orderId: null,
    transactionItemId: null,
  },
  {
    design: treeDesign,
    dimension: DesignDimensionEnum.large,
    quantity: 2,
    orderId: null,
    transactionItemId: null,
  },
];

const singleQuoteItemList: ITransactionItem[] = [
  {
    design: quotableDesign,
    dimension: DesignDimensionEnum.small,
    quantity: 1,
    orderId: null,
    transactionItemId: null,
  },
];

const multipleQuoteItemList: ITransactionItem[] = [
  {
    design: quotableDesign,
    dimension: DesignDimensionEnum.small,
    quantity: 1,
    orderId: null,
    transactionItemId: null,
  },
  {
    design: quotableDesign,
    dimension: DesignDimensionEnum.medium,
    quantity: 1,
    orderId: null,
    transactionItemId: null,
  },
  {
    design: treeDesign,
    dimension: DesignDimensionEnum.large,
    quantity: 2,
    orderId: null,
    transactionItemId: null,
  },
];

// ======================================================================== //
// ============================= Test Params ============================== //
// ======================================================================== //

export const calculateItemUnitPriceParams = [
  { dimension: DesignDimensionEnum.small, designType: DesignTypeEnum.familyTree, expectedPrice: 499 },
  { dimension: DesignDimensionEnum.medium, designType: DesignTypeEnum.familyTree, expectedPrice: 699 },
  { dimension: DesignDimensionEnum.large, designType: DesignTypeEnum.familyTree, expectedPrice: 999 },
  { dimension: DesignDimensionEnum.oneSize, designType: DesignTypeEnum.familyTree, expectedPrice: 99999999 },
  { dimension: DesignDimensionEnum.small, designType: DesignTypeEnum.quotable, expectedPrice: 299 },
  { dimension: DesignDimensionEnum.medium, designType: DesignTypeEnum.quotable, expectedPrice: 399 },
  { dimension: DesignDimensionEnum.large, designType: DesignTypeEnum.quotable, expectedPrice: 499 },
  { dimension: DesignDimensionEnum.oneSize, designType: DesignTypeEnum.quotable, expectedPrice: 88888888 },
];

export const getExtraTreesPriceParams = [
  { plantedTrees: 0, expectedPrice: 0 },
  { plantedTrees: 1, expectedPrice: 0 },
  { plantedTrees: 2, expectedPrice: 10 },
  { plantedTrees: 2.2, expectedPrice: 12 },
];

export const calculateDiscountedPriceParams = [
  { fullPrice: 1000, discount: discountAmount100, expectedPrice: 900, expectedDiscountedAmount: 100 },
  { fullPrice: 1000, discount: discountPercent10, expectedPrice: 900, expectedDiscountedAmount: 100 },
  { fullPrice: 1000, discount: discountAmount200, expectedPrice: 800, expectedDiscountedAmount: 200 },
  { fullPrice: 1000.69, discount: discountAmount100, expectedPrice: 900.69, expectedDiscountedAmount: 100 },
  { fullPrice: 1000.69, discount: discountPercent10, expectedPrice: 900.62, expectedDiscountedAmount: 100.07 },
  { fullPrice: 100, discount: discountAmount100, expectedPrice: 0, expectedDiscountedAmount: 100 },
  { fullPrice: 0, discount: discountAmount100, expectedPrice: 0, expectedDiscountedAmount: 0 },
  { fullPrice: 50, discount: discountAmount100, expectedPrice: 0, expectedDiscountedAmount: 50 },
  { fullPrice: 100, discount: discountPercent10, expectedPrice: 90, expectedDiscountedAmount: 10 },
  { fullPrice: 0, discount: discountPercent10, expectedPrice: 0, expectedDiscountedAmount: 0 },
  { fullPrice: 50, discount: discountPercent10, expectedPrice: 45, expectedDiscountedAmount: 5 },
];

export const getDeliveryPriceParams = [
  { discountedPrice: 1000, isHomeDelivery: true, expectedPrice: 25 },
  { discountedPrice: 1000, isHomeDelivery: false, expectedPrice: 0 },
  { discountedPrice: 100, isHomeDelivery: true, expectedPrice: 65 },
  { discountedPrice: 100, isHomeDelivery: false, expectedPrice: 45 },
];

export const calculateItemPriceAlternativeParams = [
  { quantity: 1, dimension: DesignDimensionEnum.small, designType: DesignTypeEnum.familyTree, expectedPrice: 499 },
  { quantity: 1, dimension: DesignDimensionEnum.medium, designType: DesignTypeEnum.familyTree, expectedPrice: 699 },
  { quantity: 1, dimension: DesignDimensionEnum.large, designType: DesignTypeEnum.familyTree, expectedPrice: 999 },
  {
    quantity: 1,
    dimension: DesignDimensionEnum.oneSize,
    designType: DesignTypeEnum.familyTree,
    expectedPrice: 99999999,
  },
  { quantity: 1, dimension: DesignDimensionEnum.small, designType: DesignTypeEnum.quotable, expectedPrice: 299 },
  { quantity: 1, dimension: DesignDimensionEnum.medium, designType: DesignTypeEnum.quotable, expectedPrice: 399 },
  { quantity: 1, dimension: DesignDimensionEnum.large, designType: DesignTypeEnum.quotable, expectedPrice: 499 },
  {
    quantity: 1,
    dimension: DesignDimensionEnum.oneSize,
    designType: DesignTypeEnum.quotable,
    expectedPrice: 88888888,
  },
  {
    quantity: 2,
    dimension: DesignDimensionEnum.small,
    designType: DesignTypeEnum.familyTree,
    expectedPrice: 499 * 2,
  },
  {
    quantity: 2,
    dimension: DesignDimensionEnum.medium,
    designType: DesignTypeEnum.familyTree,
    expectedPrice: 699 * 2,
  },
  {
    quantity: 2,
    dimension: DesignDimensionEnum.large,
    designType: DesignTypeEnum.familyTree,
    expectedPrice: 999 * 2,
  },
  {
    quantity: 2,
    dimension: DesignDimensionEnum.oneSize,
    designType: DesignTypeEnum.familyTree,
    expectedPrice: 99999999 * 2,
  },
  {
    quantity: 2,
    dimension: DesignDimensionEnum.small,
    designType: DesignTypeEnum.quotable,
    expectedPrice: 299 * 2,
  },
  {
    quantity: 2,
    dimension: DesignDimensionEnum.medium,
    designType: DesignTypeEnum.quotable,
    expectedPrice: 399 * 2,
  },
  {
    quantity: 2,
    dimension: DesignDimensionEnum.large,
    designType: DesignTypeEnum.quotable,
    expectedPrice: 499 * 2,
  },
  {
    quantity: 2,
    dimension: DesignDimensionEnum.oneSize,
    designType: DesignTypeEnum.quotable,
    expectedPrice: 88888888 * 2,
  },
];

export const calculateItemPriceParams = calculateItemPriceAlternativeParams;

export const isMoreThan4ItemsParams = [
  {
    itemList: [
      // Positive case. Multiple items. Null design. Various dimensions
      {
        design: null,
        dimension: DesignDimensionEnum.small,
        quantity: 2,
        orderId: null,
        transactionItemId: null,
      },
      {
        design: null,
        dimension: DesignDimensionEnum.medium,
        quantity: 1,
        orderId: null,
        transactionItemId: null,
      },
      {
        design: null,
        dimension: DesignDimensionEnum.oneSize,
        quantity: 1,
        orderId: null,
        transactionItemId: null,
      },
    ],
    expected: true,
    actualQuantity: 4,
  },
  // Positive case. Multiple Items. More than 4. Null design. Various dimensions
  {
    itemList: [
      {
        design: null,
        dimension: DesignDimensionEnum.small,
        quantity: 2,
        orderId: null,
        transactionItemId: null,
      },
      {
        design: null,
        dimension: DesignDimensionEnum.medium,
        quantity: 1,
        orderId: null,
        transactionItemId: null,
      },
      {
        design: null,
        dimension: DesignDimensionEnum.large,
        quantity: 1,
        orderId: null,
        transactionItemId: null,
      },
      {
        design: null,
        dimension: DesignDimensionEnum.oneSize,
        quantity: 1,
        orderId: null,
        transactionItemId: null,
      },
    ],
    expected: true,
    actualQuantity: 5,
  },
  // Positive case. One Items. Exactly 4. Null design. One dimension
  {
    itemList: [
      {
        design: null,
        dimension: DesignDimensionEnum.small,
        quantity: 4,
        orderId: null,
        transactionItemId: null,
      },
    ],
    expected: true,
    actualQuantity: 4,
  },
  // Positive case. One Items. Exactly 5. Null design. One dimension
  {
    itemList: [
      {
        design: null,
        dimension: DesignDimensionEnum.small,
        quantity: 5,
        orderId: null,
        transactionItemId: null,
      },
    ],
    expected: true,
    actualQuantity: 5,
  },
  // Negative case. One Items. Exactly 3. Null design. One dimension
  {
    itemList: [
      {
        design: null,
        dimension: DesignDimensionEnum.small,
        quantity: 3,
        orderId: null,
        transactionItemId: null,
      },
    ],
    expected: false,
    actualQuantity: 3,
  },
  // Negative case. Empty item list. Exactly 0. Null design
  {
    itemList: [],
    expected: false,
    actualQuantity: 0,
  },
  // Negative case. Multiple Items. Less than 4. Null design. Various dimensions
  {
    itemList: [
      {
        design: null,
        dimension: DesignDimensionEnum.small,
        quantity: 1,
        orderId: null,
        transactionItemId: null,
      },
      {
        design: null,
        dimension: DesignDimensionEnum.medium,
        quantity: 1,
        orderId: null,
        transactionItemId: null,
      },
      {
        design: null,
        dimension: DesignDimensionEnum.oneSize,
        quantity: 1,
        orderId: null,
        transactionItemId: null,
      },
    ],
    expected: false,
    actualQuantity: 4,
  },
  // Positive case. Multiple Items. More than 4. Multiple design types. Various dimensions
  {
    itemList: [
      {
        design: {
          designType: DesignTypeEnum.familyTree,
          designId: null,
          designProperties: null,
          mutable: true,
          user: null,
        },
        dimension: DesignDimensionEnum.small,
        quantity: 1,
        orderId: null,
        transactionItemId: null,
      },
      {
        design: {
          designType: DesignTypeEnum.familyTree,
          designId: null,
          designProperties: null,
          mutable: true,
          user: null,
        },
        dimension: DesignDimensionEnum.medium,
        quantity: 1,
        orderId: null,
        transactionItemId: null,
      },
      {
        design: {
          designType: DesignTypeEnum.quotable,
          designId: null,
          designProperties: null,
          mutable: true,
          user: null,
        },
        dimension: DesignDimensionEnum.oneSize,
        quantity: 2,
        orderId: null,
        transactionItemId: null,
      },
    ],
    expected: true,
    actualQuantity: 4,
  },
  // Negative case. Multiple Items. Less than 4. Multiple design types. Various dimensions
  {
    itemList: [
      {
        design: {
          designType: DesignTypeEnum.familyTree,
          designId: null,
          designProperties: null,
          mutable: true,
          user: null,
        },
        dimension: DesignDimensionEnum.small,
        quantity: 1,
        orderId: null,
        transactionItemId: null,
      },
      {
        design: {
          designType: DesignTypeEnum.familyTree,
          designId: null,
          designProperties: null,
          mutable: true,
          user: null,
        },
        dimension: DesignDimensionEnum.medium,
        quantity: 1,
        orderId: null,
        transactionItemId: null,
      },
      {
        design: {
          designType: DesignTypeEnum.quotable,
          designId: null,
          designProperties: null,
          mutable: true,
          user: null,
        },
        dimension: DesignDimensionEnum.oneSize,
        quantity: 1,
        orderId: null,
        transactionItemId: null,
      },
    ],
    expected: false,
    actualQuantity: 3,
  },
];

// ======================================================================== //
// ========== Get Full Price Params and Calculate Prices Params  ========== //
// ======================================================================== //

// 499 + 299
const multipleCombinedLessThan4ItemList: ITransactionItem[] = [...singleTreeItemList, ...singleQuoteItemList];
// [499 + 699 + 999 + 999] + [299 + 399 + 499 + 499]
const multipleCombinedMoreThan4ItemList: ITransactionItem[] = [...multipleTreeItemList, ...multipleQuoteItemList];

export const getFullPriceParams: { itemList: ITransactionItem[]; expectedPrice: number }[] = [
  {
    itemList: singleTreeItemList,
    expectedPrice: 499,
  },
  {
    itemList: singleQuoteItemList,
    expectedPrice: 299,
  },
  {
    itemList: multipleTreeItemList,
    expectedPrice: 3196,
  },
  {
    itemList: multipleQuoteItemList,
    expectedPrice: 2696,
  },
  {
    itemList: multipleCombinedLessThan4ItemList,
    expectedPrice: 798,
  },
  {
    itemList: multipleCombinedMoreThan4ItemList,
    expectedPrice: 5892,
  },
];

export const calculatePricesParams: {
  isHomeDelivery: boolean;
  plantedTrees: number;
  discount: IDiscount;
  itemList: ITransactionItem[];
  expectedPrice: IPricing;
}[] = [
  // =================================================== //
  // DiscountedPrice - less than 350 (special delivery pricing)
  {
    itemList: singleTreeItemList,
    isHomeDelivery: true,
    plantedTrees: 1,
    discount: discountAmount200,
    expectedPrice: {
      deliveryPrice: 65,
      discountAmount: 200,
      discountedPrice: 299,
      extraTreesPrice: 0,
      finalPrice: 364,
      fullPrice: 499,
      vat: 72.8,
    },
  },
  {
    itemList: singleTreeItemList,
    isHomeDelivery: false,
    plantedTrees: 1,
    discount: discountAmount200,
    expectedPrice: {
      deliveryPrice: 45,
      discountAmount: 200,
      discountedPrice: 299,
      extraTreesPrice: 0,
      finalPrice: 344,
      fullPrice: 499,
      vat: 68.8,
    },
  },
  // =================================================== //
  // Less than 4 - Combined Products
  {
    itemList: multipleCombinedLessThan4ItemList,
    isHomeDelivery: true,
    plantedTrees: 2,
    discount: null,
    expectedPrice: {
      deliveryPrice: 25,
      discountAmount: 0,
      discountedPrice: 798,
      extraTreesPrice: 10,
      finalPrice: 833,
      fullPrice: 798,
      vat: 166.6,
    },
  },

  {
    itemList: multipleCombinedLessThan4ItemList,
    isHomeDelivery: true,
    plantedTrees: 1,
    discount: discountAmount100,
    expectedPrice: {
      deliveryPrice: 25,
      discountAmount: 100,
      discountedPrice: 698,
      extraTreesPrice: 0,
      finalPrice: 723,
      fullPrice: 798,
      vat: 144.6,
    },
  },
  {
    itemList: multipleCombinedLessThan4ItemList,
    isHomeDelivery: true,
    plantedTrees: 1,
    discount: discountPercent10,
    expectedPrice: {
      deliveryPrice: 25,
      discountAmount: 79.8,
      discountedPrice: 718.2,
      extraTreesPrice: 0,
      finalPrice: 743.2,
      fullPrice: 798,
      vat: 148.64,
    },
  },
  // =================================================== //
  // More than 4 - Combined Products
  {
    itemList: multipleCombinedMoreThan4ItemList,
    isHomeDelivery: true,
    plantedTrees: 1,
    discount: null,
    expectedPrice: {
      deliveryPrice: 25,
      discountAmount: 0,
      discountedPrice: 5892,
      extraTreesPrice: 0,
      finalPrice: 5917,
      fullPrice: 5892,
      vat: 1183.4,
    },
  },
  {
    itemList: multipleCombinedMoreThan4ItemList,
    isHomeDelivery: true,
    plantedTrees: 1,
    discount: discountAmount100,
    expectedPrice: {
      deliveryPrice: 25,
      discountAmount: 100,
      discountedPrice: 5792,
      extraTreesPrice: 0,
      finalPrice: 5817,
      fullPrice: 5892,
      vat: 1163.4,
    },
  },
  {
    itemList: multipleCombinedMoreThan4ItemList,
    isHomeDelivery: false,
    plantedTrees: 1,
    discount: discountPercent10,
    expectedPrice: {
      deliveryPrice: 0,
      discountAmount: 589.2,
      discountedPrice: 5302.8,
      extraTreesPrice: 0,
      finalPrice: 5302.8,
      fullPrice: 5892,
      vat: 1060.56,
    },
  },
  // No items, discountPercent10
  {
    itemList: [],
    isHomeDelivery: true,
    plantedTrees: 2,
    discount: discountPercent10,
    expectedPrice: {
      deliveryPrice: 65,
      discountAmount: 0,
      discountedPrice: 0,
      extraTreesPrice: 10,
      finalPrice: 75,
      fullPrice: 0,
      vat: 15,
    },
  },
  {
    itemList: [],
    isHomeDelivery: false,
    plantedTrees: 1,
    discount: discountPercent10,
    expectedPrice: {
      deliveryPrice: 45,
      discountAmount: 0,
      discountedPrice: 0,
      extraTreesPrice: 0,
      finalPrice: 45,
      fullPrice: 0,
      vat: 9,
    },
  },
  // No items, discountAmount100
  {
    itemList: [],
    isHomeDelivery: true,
    plantedTrees: 2,
    discount: discountAmount100,
    expectedPrice: {
      deliveryPrice: 65,
      discountAmount: 0,
      discountedPrice: 0,
      extraTreesPrice: 10,
      finalPrice: 75,
      fullPrice: 0,
      vat: 15,
    },
  },
  {
    itemList: [],
    isHomeDelivery: false,
    plantedTrees: 1,
    discount: discountAmount100,
    expectedPrice: {
      deliveryPrice: 45,
      discountAmount: 0,
      discountedPrice: 0,
      extraTreesPrice: 0,
      finalPrice: 45,
      fullPrice: 0,
      vat: 9,
    },
  },
  // special impossible use case: planted trees = 0
  {
    itemList: [],
    isHomeDelivery: false,
    plantedTrees: 0,
    discount: null,
    expectedPrice: {
      deliveryPrice: 45,
      discountAmount: 0,
      discountedPrice: 0,
      extraTreesPrice: 0,
      finalPrice: 45,
      fullPrice: 0,
      vat: 9,
    },
  },
];
