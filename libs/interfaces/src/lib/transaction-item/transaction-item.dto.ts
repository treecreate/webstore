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

class CreateBulkTransactionItemRequest {
  design: CreateDesignRequest;
  dimension: DesignDimensionEnum;
  quantity: number;
}
export class CreateBulkTransactionItemsRequest {
  transactionItems: CreateBulkTransactionItemRequest[];
}
