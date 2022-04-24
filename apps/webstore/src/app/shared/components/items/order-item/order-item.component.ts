import { Component, Input, OnInit } from '@angular/core';
import {
  DesignTypeEnum,
  IOrder,
  ITransactionItem,
  OrderStatusDisplayNameEnum,
  OrderStatusEnum,
  ShippingMethodEnum,
} from '@interfaces';
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
        return '/products/family-tree';
      }
      case DesignTypeEnum.quotable: {
        return '/products/quotable';
      }
    }
  }

  /**
   * Gets the delivery price based on the shipping method.
   *
   * @returns the delivery price.
   */
  getDeliveryPrice(): number {
    if (this.order?.shippingMethod === ShippingMethodEnum.homeDelivery) {
      if (this.order.total > 350) {
        return 25;
      } else {
        return 65;
      }
    } else if (this.order?.shippingMethod === ShippingMethodEnum.pickUpPoint) {
      if (this.order.subtotal > 350) {
        return 0;
      } else {
        return 45;
      }
    }
    return 0;
  }
}
