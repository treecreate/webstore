import { DesignDimensionEnum, IDesign, IFamilyTree } from '../design';

export interface ITransactionItem {
  transactionItemId: string;
  orderId: string;
  dimension: DesignDimensionEnum;
  quantity: number;
  design: IDesign;
}

export class CreateLocalStorageTransactionItem {
  designProperties: IFamilyTree;
  dimension: DesignDimensionEnum;
  quantity: number;
}
