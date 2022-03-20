import { DesignDimensionEnum, IBase, IDesign, IFamilyTree, IQoutable } from '..';

export interface ITransactionItem extends IBase {
  transactionItemId: string;
  orderId: string;
  dimension: DesignDimensionEnum;
  quantity: number;
  design: IDesign;
}

export interface CreateLocalStorageTransactionItem {
  designProperties: IFamilyTree | IQoutable;
  dimension: DesignDimensionEnum;
  quantity: number;
}
