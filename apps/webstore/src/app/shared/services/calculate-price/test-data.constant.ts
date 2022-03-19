import {
  DesignDimensionEnum,
  DesignTypeEnum,
  DiscountType,
  IDesign,
  IDiscount,
  IPricing,
  ITransactionItem,
} from '@interfaces';

export const calculateItemUnitPriceParams = [
  { dimension: DesignDimensionEnum.small, designType: DesignTypeEnum.familyTree, expectedPrice: 495 },
  { dimension: DesignDimensionEnum.medium, designType: DesignTypeEnum.familyTree, expectedPrice: 695 },
  { dimension: DesignDimensionEnum.large, designType: DesignTypeEnum.familyTree, expectedPrice: 995 },
  { dimension: DesignDimensionEnum.oneSize, designType: DesignTypeEnum.familyTree, expectedPrice: 99999999 },
  { dimension: DesignDimensionEnum.small, designType: DesignTypeEnum.quotable, expectedPrice: 349 },
  { dimension: DesignDimensionEnum.medium, designType: DesignTypeEnum.quotable, expectedPrice: 499 },
  { dimension: DesignDimensionEnum.large, designType: DesignTypeEnum.quotable, expectedPrice: 599 },
  { dimension: DesignDimensionEnum.oneSize, designType: DesignTypeEnum.quotable, expectedPrice: 88888888 },
];

export const calculateItemPriceAlternativeParams = [
  { quantity: 1, dimension: DesignDimensionEnum.small, designType: DesignTypeEnum.familyTree, expectedPrice: 495 },
  { quantity: 1, dimension: DesignDimensionEnum.medium, designType: DesignTypeEnum.familyTree, expectedPrice: 695 },
  { quantity: 1, dimension: DesignDimensionEnum.large, designType: DesignTypeEnum.familyTree, expectedPrice: 995 },
  {
    quantity: 1,
    dimension: DesignDimensionEnum.oneSize,
    designType: DesignTypeEnum.familyTree,
    expectedPrice: 99999999,
  },
  { quantity: 1, dimension: DesignDimensionEnum.small, designType: DesignTypeEnum.quotable, expectedPrice: 349 },
  { quantity: 1, dimension: DesignDimensionEnum.medium, designType: DesignTypeEnum.quotable, expectedPrice: 499 },
  { quantity: 1, dimension: DesignDimensionEnum.large, designType: DesignTypeEnum.quotable, expectedPrice: 599 },
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
    expectedPrice: 495 * 2,
  },
  {
    quantity: 2,
    dimension: DesignDimensionEnum.medium,
    designType: DesignTypeEnum.familyTree,
    expectedPrice: 695 * 2,
  },
  {
    quantity: 2,
    dimension: DesignDimensionEnum.large,
    designType: DesignTypeEnum.familyTree,
    expectedPrice: 995 * 2,
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
    expectedPrice: 349 * 2,
  },
  {
    quantity: 2,
    dimension: DesignDimensionEnum.medium,
    designType: DesignTypeEnum.quotable,
    expectedPrice: 499 * 2,
  },
  {
    quantity: 2,
    dimension: DesignDimensionEnum.large,
    designType: DesignTypeEnum.quotable,
    expectedPrice: 599 * 2,
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

const multipleCombinedLessThan4ItemList: ITransactionItem[] = [...singleTreeItemList, ...singleQuoteItemList];
const multipleCombinedMoreThan4ItemList: ITransactionItem[] = [...multipleTreeItemList, ...multipleQuoteItemList];

export const getFullPriceParams: { itemList: ITransactionItem[]; expectedPrice: number }[] = [
  {
    itemList: singleTreeItemList,
    expectedPrice: 495,
  },
  {
    itemList: singleQuoteItemList,
    expectedPrice: 349,
  },
  {
    itemList: multipleTreeItemList,
    expectedPrice: 3180,
  },
  {
    itemList: multipleQuoteItemList,
    expectedPrice: 2838,
  },
  {
    itemList: multipleCombinedLessThan4ItemList,
    expectedPrice: 844,
  },
  {
    itemList: multipleCombinedMoreThan4ItemList,
    expectedPrice: 6018,
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
  // Less than 4 - Combined Products
  {
    itemList: multipleCombinedLessThan4ItemList,
    isHomeDelivery: true,
    plantedTrees: 1,
    discount: null,
    expectedPrice: {
      deliveryPrice: 29,
      discountAmount: 0,
      discountedPrice: 844,
      extraTreesPrice: 0,
      finalPrice: 873,
      fullPrice: 844,
      vat: 174.6,
    },
  },
  {
    itemList: multipleCombinedLessThan4ItemList,
    isHomeDelivery: false,
    plantedTrees: 1,
    discount: null,
    expectedPrice: {
      deliveryPrice: 0,
      discountAmount: 0,
      discountedPrice: 844,
      extraTreesPrice: 0,
      finalPrice: 844,
      fullPrice: 844,
      vat: 168.8,
    },
  },
  {
    itemList: multipleCombinedLessThan4ItemList,
    isHomeDelivery: true,
    plantedTrees: 2,
    discount: null,
    expectedPrice: {
      deliveryPrice: 29,
      discountAmount: 0,
      discountedPrice: 844,
      extraTreesPrice: 10,
      finalPrice: 883,
      fullPrice: 844,
      vat: 176.6,
    },
  },
  {
    itemList: multipleCombinedLessThan4ItemList,
    isHomeDelivery: false,
    plantedTrees: 2,
    discount: null,
    expectedPrice: {
      deliveryPrice: 0,
      discountAmount: 0,
      discountedPrice: 844,
      extraTreesPrice: 10,
      finalPrice: 854,
      fullPrice: 844,
      vat: 170.8,
    },
  },
  {
    itemList: multipleCombinedLessThan4ItemList,
    isHomeDelivery: true,
    plantedTrees: 1,
    discount: discountAmount100,
    expectedPrice: {
      deliveryPrice: 29,
      discountAmount: 100,
      discountedPrice: 744,
      extraTreesPrice: 0,
      finalPrice: 773,
      fullPrice: 844,
      vat: 154.6,
    },
  },
  {
    itemList: multipleCombinedLessThan4ItemList,
    isHomeDelivery: false,
    plantedTrees: 1,
    discount: discountAmount100,
    expectedPrice: {
      deliveryPrice: 0,
      discountAmount: 100,
      discountedPrice: 744,
      extraTreesPrice: 0,
      finalPrice: 744,
      fullPrice: 844,
      vat: 148.8,
    },
  },
  {
    itemList: multipleCombinedLessThan4ItemList,
    isHomeDelivery: true,
    plantedTrees: 2,
    discount: discountAmount100,
    expectedPrice: {
      deliveryPrice: 29,
      discountAmount: 100,
      discountedPrice: 744,
      extraTreesPrice: 10,
      finalPrice: 783,
      fullPrice: 844,
      vat: 156.6,
    },
  },
  {
    itemList: multipleCombinedLessThan4ItemList,
    isHomeDelivery: false,
    plantedTrees: 2,
    discount: discountAmount100,
    expectedPrice: {
      deliveryPrice: 0,
      discountAmount: 100,
      discountedPrice: 744,
      extraTreesPrice: 10,
      finalPrice: 754,
      fullPrice: 844,
      vat: 150.8,
    },
  },
  {
    itemList: multipleCombinedLessThan4ItemList,
    isHomeDelivery: true,
    plantedTrees: 1,
    discount: discountPercent10,
    expectedPrice: {
      deliveryPrice: 29,
      discountAmount: 84.4,
      discountedPrice: 759.6,
      extraTreesPrice: 0,
      finalPrice: 788.6,
      fullPrice: 844,
      vat: 157.72,
    },
  },
  {
    itemList: multipleCombinedLessThan4ItemList,
    isHomeDelivery: false,
    plantedTrees: 1,
    discount: discountPercent10,
    expectedPrice: {
      deliveryPrice: 0,
      discountAmount: 84.4,
      discountedPrice: 759.6,
      extraTreesPrice: 0,
      finalPrice: 759.6,
      fullPrice: 844,
      vat: 151.92,
    },
  },
  {
    itemList: multipleCombinedLessThan4ItemList,
    isHomeDelivery: true,
    plantedTrees: 2,
    discount: discountPercent10,
    expectedPrice: {
      deliveryPrice: 29,
      discountAmount: 84.4,
      discountedPrice: 759.6,
      extraTreesPrice: 10,
      finalPrice: 798.6,
      fullPrice: 844,
      vat: 159.72,
    },
  },
  {
    itemList: multipleCombinedLessThan4ItemList,
    isHomeDelivery: false,
    plantedTrees: 2,
    discount: discountPercent10,
    expectedPrice: {
      deliveryPrice: 0,
      discountAmount: 84.4,
      discountedPrice: 759.6,
      extraTreesPrice: 10,
      finalPrice: 769.6,
      fullPrice: 844,
      vat: 153.92,
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
      deliveryPrice: 29,
      discountAmount: 0,
      discountedPrice: 6018,
      extraTreesPrice: 0,
      finalPrice: 6047,
      fullPrice: 6018,
      vat: 1209.4,
    },
  },
  {
    itemList: multipleCombinedMoreThan4ItemList,
    isHomeDelivery: false,
    plantedTrees: 1,
    discount: null,
    expectedPrice: {
      deliveryPrice: 0,
      discountAmount: 0,
      discountedPrice: 6018,
      extraTreesPrice: 0,
      finalPrice: 6018,
      fullPrice: 6018,
      vat: 1203.6,
    },
  },
  {
    itemList: multipleCombinedMoreThan4ItemList,
    isHomeDelivery: true,
    plantedTrees: 2,
    discount: null,
    expectedPrice: {
      deliveryPrice: 29,
      discountAmount: 0,
      discountedPrice: 6018,
      extraTreesPrice: 10,
      finalPrice: 6057,
      fullPrice: 6018,
      vat: 1211.4,
    },
  },
  {
    itemList: multipleCombinedMoreThan4ItemList,
    isHomeDelivery: false,
    plantedTrees: 2,
    discount: null,
    expectedPrice: {
      deliveryPrice: 0,
      discountAmount: 0,
      discountedPrice: 6018,
      extraTreesPrice: 10,
      finalPrice: 6028,
      fullPrice: 6018,
      vat: 1205.6,
    },
  },
  {
    itemList: multipleCombinedMoreThan4ItemList,
    isHomeDelivery: true,
    plantedTrees: 1,
    discount: discountAmount100,
    expectedPrice: {
      deliveryPrice: 29,
      discountAmount: 100,
      discountedPrice: 5918,
      extraTreesPrice: 0,
      finalPrice: 5947,
      fullPrice: 6018,
      vat: 1189.4,
    },
  },
  {
    itemList: multipleCombinedMoreThan4ItemList,
    isHomeDelivery: false,
    plantedTrees: 1,
    discount: discountAmount100,
    expectedPrice: {
      deliveryPrice: 0,
      discountAmount: 100,
      discountedPrice: 5918,
      extraTreesPrice: 0,
      finalPrice: 5918,
      fullPrice: 6018,
      vat: 1183.6,
    },
  },
  {
    itemList: multipleCombinedMoreThan4ItemList,
    isHomeDelivery: true,
    plantedTrees: 2,
    discount: discountAmount100,
    expectedPrice: {
      deliveryPrice: 29,
      discountAmount: 100,
      discountedPrice: 5918,
      extraTreesPrice: 10,
      finalPrice: 5957,
      fullPrice: 6018,
      vat: 1191.4,
    },
  },
  {
    itemList: multipleCombinedMoreThan4ItemList,
    isHomeDelivery: false,
    plantedTrees: 2,
    discount: discountAmount100,
    expectedPrice: {
      deliveryPrice: 0,
      discountAmount: 100,
      discountedPrice: 5918,
      extraTreesPrice: 10,
      finalPrice: 5928,
      fullPrice: 6018,
      vat: 1185.6,
    },
  },
  {
    itemList: multipleCombinedMoreThan4ItemList,
    isHomeDelivery: true,
    plantedTrees: 1,
    discount: discountPercent10,
    expectedPrice: {
      deliveryPrice: 29,
      discountAmount: 601.8,
      discountedPrice: 5416.2,
      extraTreesPrice: 0,
      finalPrice: 5445.2,
      fullPrice: 6018,
      vat: 1089.04,
    },
  },
  {
    itemList: multipleCombinedMoreThan4ItemList,
    isHomeDelivery: false,
    plantedTrees: 1,
    discount: discountPercent10,
    expectedPrice: {
      deliveryPrice: 0,
      discountAmount: 601.8,
      discountedPrice: 5416.2,
      extraTreesPrice: 0,
      finalPrice: 5416.2,
      fullPrice: 6018,
      vat: 1083.24,
    },
  },
  {
    itemList: multipleCombinedMoreThan4ItemList,
    isHomeDelivery: true,
    plantedTrees: 2,
    discount: discountPercent10,
    expectedPrice: {
      deliveryPrice: 29,
      discountAmount: 601.8,
      discountedPrice: 5416.2,
      extraTreesPrice: 10,
      finalPrice: 5455.2,
      fullPrice: 6018,
      vat: 1091.04,
    },
  },
  {
    itemList: multipleCombinedMoreThan4ItemList,
    isHomeDelivery: false,
    plantedTrees: 2,
    discount: discountPercent10,
    expectedPrice: {
      deliveryPrice: 0,
      discountAmount: 601.8,
      discountedPrice: 5416.2,
      extraTreesPrice: 10,
      finalPrice: 5426.2,
      fullPrice: 6018,
      vat: 1085.24,
    },
  },
  // No items, discountPercent10
  {
    itemList: [],
    isHomeDelivery: true,
    plantedTrees: 2,
    discount: discountPercent10,
    expectedPrice: {
      deliveryPrice: 29,
      discountAmount: 0,
      discountedPrice: 0,
      extraTreesPrice: 10,
      finalPrice: 39,
      fullPrice: 0,
      vat: 7.8,
    },
  },
  {
    itemList: [],
    isHomeDelivery: false,
    plantedTrees: 1,
    discount: discountPercent10,
    expectedPrice: {
      deliveryPrice: 0,
      discountAmount: 0,
      discountedPrice: 0,
      extraTreesPrice: 0,
      finalPrice: 0,
      fullPrice: 0,
      vat: 0,
    },
  },
  // No items, discountAmount100
  {
    itemList: [],
    isHomeDelivery: true,
    plantedTrees: 2,
    discount: discountAmount100,
    expectedPrice: {
      deliveryPrice: 29,
      discountAmount: 0,
      discountedPrice: 0,
      extraTreesPrice: 10,
      finalPrice: 39,
      fullPrice: 0,
      vat: 7.8,
    },
  },
  {
    itemList: [],
    isHomeDelivery: false,
    plantedTrees: 1,
    discount: discountAmount100,
    expectedPrice: {
      deliveryPrice: 0,
      discountAmount: 0,
      discountedPrice: 0,
      extraTreesPrice: 0,
      finalPrice: 0,
      fullPrice: 0,
      vat: 0,
    },
  },
  // special impossible use case: planted trees = 0
  {
    itemList: [],
    isHomeDelivery: false,
    plantedTrees: 0,
    discount: null,
    expectedPrice: {
      deliveryPrice: 0,
      discountAmount: 0,
      discountedPrice: 0,
      extraTreesPrice: 0,
      finalPrice: 0,
      fullPrice: 0,
      vat: 0,
    },
  },
];
