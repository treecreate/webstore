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
  // DiscountedPrice - less than 350 (special delivery pricing)
  {
    itemList: singleTreeItemList,
    isHomeDelivery: true,
    plantedTrees: 1,
    discount: discountAmount200,
    expectedPrice: {
      deliveryPrice: 65,
      discountAmount: 200,
      discountedPrice: 295,
      extraTreesPrice: 0,
      finalPrice: 360,
      fullPrice: 495,
      vat: 72,
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
      discountedPrice: 295,
      extraTreesPrice: 0,
      finalPrice: 340,
      fullPrice: 495,
      vat: 68,
    },
  },
  {
    itemList: singleQuoteItemList,
    isHomeDelivery: true,
    plantedTrees: 1,
    discount: discountAmount100,
    expectedPrice: {
      deliveryPrice: 65,
      discountAmount: 100,
      discountedPrice: 249,
      extraTreesPrice: 0,
      finalPrice: 314,
      fullPrice: 349,
      vat: 62.8,
    },
  },
  {
    itemList: singleQuoteItemList,
    isHomeDelivery: false,
    plantedTrees: 1,
    discount: discountAmount100,
    expectedPrice: {
      deliveryPrice: 45,
      discountAmount: 100,
      discountedPrice: 249,
      extraTreesPrice: 0,
      finalPrice: 294,
      fullPrice: 349,
      vat: 58.8,
    },
  },
  // =================================================== //
  // Less than 4 - Combined Products
  {
    itemList: multipleCombinedLessThan4ItemList,
    isHomeDelivery: true,
    plantedTrees: 1,
    discount: null,
    expectedPrice: {
      deliveryPrice: 25,
      discountAmount: 0,
      discountedPrice: 844,
      extraTreesPrice: 0,
      finalPrice: 869,
      fullPrice: 844,
      vat: 173.8,
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
      deliveryPrice: 25,
      discountAmount: 0,
      discountedPrice: 844,
      extraTreesPrice: 10,
      finalPrice: 879,
      fullPrice: 844,
      vat: 175.8,
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
      deliveryPrice: 25,
      discountAmount: 100,
      discountedPrice: 744,
      extraTreesPrice: 0,
      finalPrice: 769,
      fullPrice: 844,
      vat: 153.8,
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
      deliveryPrice: 25,
      discountAmount: 100,
      discountedPrice: 744,
      extraTreesPrice: 10,
      finalPrice: 779,
      fullPrice: 844,
      vat: 155.8,
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
      deliveryPrice: 25,
      discountAmount: 84.4,
      discountedPrice: 759.6,
      extraTreesPrice: 0,
      finalPrice: 784.6,
      fullPrice: 844,
      vat: 156.92,
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
      deliveryPrice: 25,
      discountAmount: 84.4,
      discountedPrice: 759.6,
      extraTreesPrice: 10,
      finalPrice: 794.6,
      fullPrice: 844,
      vat: 158.92,
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
      deliveryPrice: 25,
      discountAmount: 0,
      discountedPrice: 6018,
      extraTreesPrice: 0,
      finalPrice: 6043,
      fullPrice: 6018,
      vat: 1208.6,
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
      deliveryPrice: 25,
      discountAmount: 0,
      discountedPrice: 6018,
      extraTreesPrice: 10,
      finalPrice: 6053,
      fullPrice: 6018,
      vat: 1210.6,
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
      deliveryPrice: 25,
      discountAmount: 100,
      discountedPrice: 5918,
      extraTreesPrice: 0,
      finalPrice: 5943,
      fullPrice: 6018,
      vat: 1188.6,
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
      deliveryPrice: 25,
      discountAmount: 100,
      discountedPrice: 5918,
      extraTreesPrice: 10,
      finalPrice: 5953,
      fullPrice: 6018,
      vat: 1190.6,
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
      deliveryPrice: 25,
      discountAmount: 601.8,
      discountedPrice: 5416.2,
      extraTreesPrice: 0,
      finalPrice: 5441.2,
      fullPrice: 6018,
      vat: 1088.24,
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
      deliveryPrice: 25,
      discountAmount: 601.8,
      discountedPrice: 5416.2,
      extraTreesPrice: 10,
      finalPrice: 5451.2,
      fullPrice: 6018,
      vat: 1090.24,
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
