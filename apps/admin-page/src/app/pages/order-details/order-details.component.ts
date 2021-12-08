import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DesignDimensionEnum, IOrder, ITransactionItem, OrderStatusEnum, ShippingMethodEnum } from '@interfaces';
import { OrdersService } from '../../services/orders/orders.service';

@Component({
  selector: 'webstore-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit {
  order?: IOrder;
  id?: string;
  title!: string;
  daysLeft!: number;
  isLoading = true;

  // Customer information
  emailControl!: FormControl;
  phoneNumberControl!: FormControl;
  // Contact information
  nameControl!: FormControl;
  cityControl!: FormControl;
  postcodeControl!: FormControl;
  addressOneControl!: FormControl;
  addressTwoControl!: FormControl;
  // Billing information
  billingNameControl!: FormControl;
  billingCityControl!: FormControl;
  billingPostcodeControl!: FormControl;
  billingAddressOneControl!: FormControl;
  billingAddressTwoControl!: FormControl;

  items!: ITransactionItem[];
  itemsColumns: string[] = ['title', 'quantity', 'dimensions', 'price', 'actions'];

  constructor(private ordersService: OrdersService, private route: ActivatedRoute, private location: Location) {
    this.title = 'Loading...';
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    // Fetching the order.
    if (this.id !== undefined) {
      this.fetchOrder(this.id);
    }
  }

  /**
   * Redirects to the previous page.
   */
  historyBack(): void {
    this.location.back();
  }

  /**
   * Fetches an order from the API.\
   * \
   * Will toggle `isLoading` to `true` while the order is being fetched
   * and revert it to `false` when it has been fetched.\
   * Initializes all of the order related values.\
   * \
   * **Uses**: `ordersService` -> to call the API.
   */
  fetchOrder(id: string): void {
    this.isLoading = true;
    this.ordersService.getOrders().subscribe({
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
      next: (orders: IOrder[]) => {
        this.isLoading = false;
        this.order = orders.find((order) => order.orderId === id);
        // Setting the page title.
        this.title = `Order by: ${this.order?.contactInfo.name}`;

        // Customer Information
        this.emailControl = new FormControl(this.order?.contactInfo.email);
        this.phoneNumberControl = new FormControl(this.order?.contactInfo.phoneNumber);
        // Contact Information
        this.nameControl = new FormControl(this.order?.contactInfo.name);
        this.cityControl = new FormControl(this.order?.contactInfo.city);
        this.postcodeControl = new FormControl(this.order?.contactInfo.postcode);
        this.addressOneControl = new FormControl(this.order?.contactInfo.streetAddress);
        this.addressTwoControl = new FormControl(this.order?.contactInfo.streetAddress2);
        // Billing Information
        this.billingNameControl = new FormControl(this.order?.billingInfo.name);
        this.billingCityControl = new FormControl(this.order?.billingInfo.city);
        this.billingPostcodeControl = new FormControl(this.order?.billingInfo.postcode);
        this.billingAddressOneControl = new FormControl(this.order?.billingInfo.streetAddress);
        this.billingAddressTwoControl = new FormControl(this.order?.billingInfo.streetAddress2);

        if (this.order?.transactionItems) {
          this.items = this.order?.transactionItems;
        }
        if (this.order) {
          this.daysLeft = this.getDaysLeft(this.order?.createdAt);
        }
      },
    });
  }

  /**
   * Calculates how many days there are left until the delivery date.
   *
   * @param orderDate The date when the order has been placed.
   * @returns amount of days left until delivery date.
   */
  getDaysLeft(orderDate: Date): number {
    // Calculate delivery date. (can take at most 14 days after the order was placed)
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 14);

    // Calculate how many days are left
    return Number(((deliveryDate.getTime() - Date.now()) / (1000 * 3600 * 24)).toFixed(0));
  }

  /**
   * Gets the Label color for the 'Days Left' column in the table based on the days left until
   * delivery and the status of the order.
   *
   * @param daysLeft days left until delivery.
   * @param orderStatus the status of the order.
   * @returns the color of the label.
   */
  getDaysLeftColor(daysLeft: number, orderStatus: OrderStatusEnum): LabelColorsEnum {
    // Order status is NOT: Delivered, Shipped or Rejected.
    if (
      orderStatus !== OrderStatusEnum.delivered &&
      orderStatus !== OrderStatusEnum.shipped &&
      orderStatus !== OrderStatusEnum.rejected
    ) {
      if (daysLeft >= 9) {
        return LabelColorsEnum.green;
      }
      if (daysLeft >= 5) {
        return LabelColorsEnum.yellow;
      }
      return LabelColorsEnum.red;
    }
    return LabelColorsEnum.lightGrey;
  }

  /**
   * Calculates the price of a transaction item based on the quantity and its size.
   *
   * @param quantity - amount of transaction items.
   * @param dimension - the dimension of the transaction item.
   * @returns the price of the item.
   */
  calculateItemPrice(quantity: number, dimension: DesignDimensionEnum): number {
    switch (dimension) {
      case DesignDimensionEnum.small:
        return quantity * 495;
      case DesignDimensionEnum.medium:
        return quantity * 695;
      case DesignDimensionEnum.large:
        return quantity * 995;
      default:
        return 99999999;
    }
  }

  /**
   * Gets the VAT price.
   *
   * @returns the VAT price.
   */
  getVAT(): number {
    if (this.order) {
      return this.order.total * 0.2;
    }
    return 0;
  }

  /**
   * Gets the price of the extra planted trees.
   *
   * @returns the price of the planted trees.
   */
  getPlantedTreesPrice(): number {
    if (this.order) {
      return (this.order.plantedTrees - 1) * 10;
    }
    return 0;
  }

  /**
   * Gets the delivery price based on the shipping method.
   *
   * @returns the delivery price.
   */
  getDeliveryPrice(): number {
    if (this.order?.shippingMethod === ShippingMethodEnum.homeDelivery) {
      return 25;
    }
    return 0;
  }

  // TODO: extract the status color related functions to a helper/util function.
  /**
   * Gets the Label color of the Order Status based on the status.
   *
   * @param orderStatus the status of the order.
   * @returns the color of the label.
   */
  getOrderStatusColor(orderStatus: OrderStatusEnum): LabelColorsEnum {
    switch (orderStatus) {
      case OrderStatusEnum.initial:
        return LabelColorsEnum.blue;
      case OrderStatusEnum.pending:
        return LabelColorsEnum.blue;
      case OrderStatusEnum.new:
        return LabelColorsEnum.red;
      case OrderStatusEnum.rejected:
        return LabelColorsEnum.grey;
      case OrderStatusEnum.processed:
        return LabelColorsEnum.red;
      case OrderStatusEnum.assembling:
        return LabelColorsEnum.yellow;
      case OrderStatusEnum.shipped:
        return LabelColorsEnum.blue;
      case OrderStatusEnum.delivered:
        return LabelColorsEnum.green;
      default:
        return LabelColorsEnum.lightGrey;
    }
  }
}

enum LabelColorsEnum {
  red = '#FF0000',
  green = '#00B207',
  blue = '#6D7CFF',
  yellow = '#F4DC00',
  grey = '#ABABAB',
  lightGrey = '#F1F1F1',
}
