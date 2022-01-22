import { CreateDesignRequest, DesignDimensionEnum } from '../design';

export interface UpdateTransactionItemRequest {
  dimension: DesignDimensionEnum;
  quantity: number;
}

export interface CreateTransactionItemRequest {
  designId: string;
  dimension: DesignDimensionEnum;
  quantity: number;
}

interface CreateBulkTransactionItemRequest {
  design: CreateDesignRequest;
  dimension: DesignDimensionEnum;
  quantity: number;
}
export interface CreateBulkTransactionItemsRequest {
  transactionItems: CreateBulkTransactionItemRequest[];
}
