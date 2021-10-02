import { DesignDimensionEnum } from '../design';

export class UpdateTransactionItemRequest {
  transactionItemId: string;
  dimension: DesignDimensionEnum;
  quantity: number;
}

export class CreateTransactionItemRequest {
  dimension: DesignDimensionEnum;
  quantity: number;
}
