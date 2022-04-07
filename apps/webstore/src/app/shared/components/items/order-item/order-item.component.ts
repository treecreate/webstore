import { Component, Input, OnInit } from '@angular/core';
import { DesignTypeEnum, IOrder, ITransactionItem, OrderStatusDisplayNameEnum, OrderStatusEnum } from '@interfaces';
import { CalculatePriceService } from '../../../services/calculate-price/calculate-price.service';

@Component({
  selector: 'webstore-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css'],
})
export class OrderItemComponent implements OnInit {
  @Input() order: IOrder;
  @Input() orderNumber: number;
  isLoading = false;
  public designTypeEnum = DesignTypeEnum;

  constructor(private calculePriceService: CalculatePriceService) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  getPrice(transactionItem: ITransactionItem): number {
    return this.calculePriceService.calculateItemPrice(transactionItem);
  }

  /**
   * Returns corresponding order status display text
   * @param status order status
   * @returns user-friendly order status text
   */
  getStatusDisplayName(status: OrderStatusEnum): OrderStatusDisplayNameEnum {
    switch (status) {
      case OrderStatusEnum.initial:
        return OrderStatusDisplayNameEnum.initial;
      case OrderStatusEnum.pending:
        return OrderStatusDisplayNameEnum.pending;
      case OrderStatusEnum.new:
        return OrderStatusDisplayNameEnum.new;
      case OrderStatusEnum.rejected:
        return OrderStatusDisplayNameEnum.rejected;
      case OrderStatusEnum.processed:
        return OrderStatusDisplayNameEnum.processed;
      case OrderStatusEnum.assembling:
        return OrderStatusDisplayNameEnum.assembling;
      case OrderStatusEnum.shipped:
        return OrderStatusDisplayNameEnum.shipped;
      case OrderStatusEnum.delivered:
        return OrderStatusDisplayNameEnum.delivered;
    }
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }

  /**
   * Get the edit link for the given product based on designType
   * @returns absolute path to the design page
   */
  getEditLink(designType: DesignTypeEnum): string {
    switch (designType) {
      case DesignTypeEnum.familyTree: {
        return '/catalog/family-tree';
      }
      case DesignTypeEnum.quotable: {
        return '/catalog/quotable';
      }
    }
  }
}
