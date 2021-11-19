import { DesignDimensionEnum } from '../design';

export interface UpdateTransactionItemRequest {
  dimension: DesignDimensionEnum;
  quantity: number;
}

export interface CreateTransactionItemRequest {
  designId: string;
  dimension: DesignDimensionEnum;
  quantity: number;
}
