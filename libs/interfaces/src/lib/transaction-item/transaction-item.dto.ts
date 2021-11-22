import { CreateDesignRequest, DesignDimensionEnum } from '../design';

export class UpdateTransactionItemRequest {
  dimension: DesignDimensionEnum;
  quantity: number;
}

export class CreateTransactionItemRequest {
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
