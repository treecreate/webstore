import { DesignDimensionEnum, IBase, IDesign, IFamilyTree } from '..';

export interface ITransactionItem extends IBase {
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
