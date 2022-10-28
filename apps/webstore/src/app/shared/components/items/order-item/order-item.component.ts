import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  DesignTypeEnum,
  ErrorlogPriorityEnum,
  IOrder,
  ITransactionItem,
  OrderStatusDisplayNameEnum,
  OrderStatusEnum,
  ShippingMethodEnum,
} from '@interfaces';
import { CalculatePriceService } from '../../../services/calculate-price/calculate-price.service';
import { ErrorlogsService } from '../../../services/errorlog/errorlog.service';
import { EventsService } from '../../../services/events/events.service';
import { OrderService } from '../../../services/order/order.service';

@Component({
  selector: 'webstore-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css'],
})
export class OrderItemComponent implements OnInit {
  @Input() order: IOrder;
  @Input() orderNumber: number;
  isPaymentLinkLoading = false;
  paymentLink?: string;
  shouldShowPaymentLink = false;
  public designTypeEnum = DesignTypeEnum;

  constructor(
    private ordersService: OrderService,
    private calculatePriceService: CalculatePriceService,
    public eventsService: EventsService,
    private errorlogsService: ErrorlogsService
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    if (this.order.status === OrderStatusEnum.initial || this.order.status === OrderStatusEnum.rejected) {
      this.shouldShowPaymentLink = true;
    }
    this.fetchOrderLink();
  }

  fetchOrderLink(): void {
    if (this.shouldShowPaymentLink) {
      this.ordersService.getPaymentLink(this.order.orderId).subscribe({
        next: (response) => {
          this.isPaymentLinkLoading = false;
          this.paymentLink = response.url;
        },
        error: (error: HttpErrorResponse) => {
          console.error(error.error);
          this.errorlogsService.create(
            'webstore.orders.order-payment-link-load-failed',
            ErrorlogPriorityEnum.medium,
            error
          );
        },
      });
    }
  }

  getPrice(transactionItem: ITransactionItem): number {
    return this.calculatePriceService.calculateItemPrice(transactionItem);
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
      case DesignTypeEnum.petSign: {
        return '/products/pet-sign';
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
