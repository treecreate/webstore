import { IOrder } from '@interfaces';
import { DesignDimensionEnum, IDesign } from '../design';

export interface ITransactionItem {
  transactionItemId: string;
  order: IOrder;
  dimension: DesignDimensionEnum;
  quantity: number;
  design: IDesign;
}
