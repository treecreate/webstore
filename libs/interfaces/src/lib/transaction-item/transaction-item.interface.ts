import { DesignDimensionEnum, IDesign } from '../design';

export interface ITransactionItem {
  transactionItemId: string;
  orderId: string;
  dimension: DesignDimensionEnum;
  quantity: number;
  design: IDesign;
}
