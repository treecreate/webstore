import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {
  CreateUpdateOrderRequest,
  DesignDimensionEnum,
  IOrder,
  ITransactionItem,
  OrderStatusEnum,
  ShippingMethodEnum,
} from '@interfaces';
import { OrdersService } from '../../services/orders/orders.service';
import { environment as env } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  isUpdating = false;

  statusControl!: FormControl;
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
  orderStatusOptions: OrderStatusEnum[] = [
    OrderStatusEnum.delivered,
    OrderStatusEnum.assembling,
    OrderStatusEnum.shipped,
    OrderStatusEnum.pending,
    OrderStatusEnum.initial,
    OrderStatusEnum.processed,
    OrderStatusEnum.new,
    OrderStatusEnum.rejected,
  ];

  /**
   * @param ordersService
   * @param route
   * @param location
   * @param snackbar
   */
  constructor(
    public ordersService: OrdersService,
    private route: ActivatedRoute,
    private location: Location,
    private snackbar: MatSnackBar
  ) {
    this.title = 'Loading...';
  }

  /**
   * Checks the the param id in the url and uses it to fetch the order.
   */
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
   * Gets triggered when the status of an order has been changed.\
   * It will call the API to update the order with its new status.\
   * In case an error is encountered, the orders will be reloaded from the database.
   *
   * @param order - the order containing the new status.
   * @param updatedForm - the information that is updated. (status, contact info, delivery address)
   */
  updateOrder(updatedForm: string): void {
    if (this.order !== undefined) {
      const updateOrderRequest: CreateUpdateOrderRequest = {
        contactInfo: {
          city: this.billingCityControl.value,
          country: 'Denmark',
          email: this.emailControl.value,
          name: this.nameControl.value,
          phoneNumber: this.phoneNumberControl.value,
          postcode: this.postcodeControl.value,
          streetAddress: this.addressOneControl.value,
          streetAddress2: this.addressTwoControl.value,
        },
        status: OrderStatusEnum.assembling,
      };

      this.isUpdating = true;
      this.ordersService.updateOrder(updateOrderRequest, this.order?.orderId).subscribe({
        error: (error: HttpErrorResponse) => {
          if (this.id !== undefined) {
            this.fetchOrder(this.id);
          }
          this.snackbar.open('Order has failed to update', 'like, how even?..', { duration: 5000 });
          console.error(error);
          this.isUpdating = false;
        },
        next: () => {
          this.snackbar.open('Orders ' + updatedForm + ' has been updated!', 'Nice!', { duration: 2500 });
          this.isUpdating = false;
        },
      });
    } else {
      this.snackbar.open('Order is undefined', 'like, how even?..', { duration: 5000 });
    }
  }

  /**
   * @returns whether or not the delivery address fields are valid.
   */
  isDeliveryAddressValid(): boolean {
    return (
      this.nameControl.valid &&
      this.cityControl.valid &&
      this.postcodeControl.valid &&
      this.addressOneControl.valid &&
      this.addressTwoControl.valid &&
      (this.nameControl.dirty ||
        this.cityControl.dirty ||
        this.postcodeControl.dirty ||
        this.addressOneControl.dirty ||
        this.addressTwoControl.dirty)
    );
  }

  /**
   * @returns whether or not the contact info fields are valid.
   */
  isContactInfoValid(): boolean {
    return (
      !this.isLoading &&
      this.emailControl.valid &&
      this.phoneNumberControl.valid &&
      (this.emailControl.dirty || this.phoneNumberControl.dirty)
    );
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
        this.statusControl = new FormControl(this.order?.status);
        // Customer Information
        this.emailControl = new FormControl(this.order?.contactInfo.email, [Validators.email, Validators.required]);
        this.phoneNumberControl = new FormControl(this.order?.contactInfo.phoneNumber, [
          Validators.minLength(3),
          Validators.maxLength(15),
          Validators.pattern('^[0-9+ ]*$'),
        ]);
        // Contact Information
        this.nameControl = new FormControl(this.order?.contactInfo.name, [
          Validators.maxLength(50),
          Validators.pattern('^[^0-9]+$'),
        ]);
        this.cityControl = new FormControl(this.order?.contactInfo.city, [
          Validators.maxLength(50),
          Validators.minLength(3),
          Validators.pattern('^[^0-9]+$'),
        ]);
        this.postcodeControl = new FormControl(this.order?.contactInfo.postcode, [
          Validators.minLength(3),
          Validators.maxLength(15),
          Validators.pattern('^[0-9]*$'),
        ]);
        this.addressOneControl = new FormControl(this.order?.contactInfo.streetAddress, [
          Validators.maxLength(50),
          Validators.minLength(3),
        ]);
        this.addressTwoControl = new FormControl(this.order?.contactInfo.streetAddress2, [
          Validators.maxLength(50),
          Validators.minLength(3),
        ]);
        // Billing Information
        this.billingNameControl = new FormControl({ value: this.order?.billingInfo.name, disabled: true });
        this.billingCityControl = new FormControl({ value: this.order?.billingInfo.city, disabled: true });
        this.billingPostcodeControl = new FormControl({ value: this.order?.billingInfo.postcode, disabled: true });
        this.billingAddressOneControl = new FormControl({
          value: this.order?.billingInfo.streetAddress,
          disabled: true,
        });
        this.billingAddressTwoControl = new FormControl({
          value: this.order?.billingInfo.streetAddress2,
          disabled: true,
        });

        if (this.order?.transactionItems) {
          this.items = this.order?.transactionItems;
        }
        if (this.order) {
          this.daysLeft = this.ordersService.getDaysLeft(this.order?.createdAt);
        }
      },
    });
  }

  /**
   * Calculates the price of a transaction item based on the quantity and its size.
   *
   * @param quantity - amount of transaction items.
   * @param dimension - the dimension of the transaction item.
   * @returns the price of the item.
   */
  getItemPrice(quantity: number, dimension: DesignDimensionEnum): number {
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

  getDesignViewOnlyUrl(id: string): string {
    return `${env.webstoreUrl}/product?designId=${id}`;
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
}
