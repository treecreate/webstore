import { Clipboard } from '@angular/cdk/clipboard';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import {
  CreateUpdateOrderRequest,
  DesignDimensionEnum,
  DesignTypeEnum,
  IOrder,
  ITransactionItem,
  OrderStatusEnum,
  ShippingMethodEnum,
} from '@interfaces';
import { environment as env } from '../../../environments/environment';
import { OrdersService } from '../../services/orders/orders.service';
import { ShipmondoService } from '../../services/shipmondo/shipmondo.service';

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

  statusControl!: UntypedFormControl;
  // Customer information
  emailControl!: UntypedFormControl;
  phoneNumberControl!: UntypedFormControl;
  // Contact information
  nameControl!: UntypedFormControl;
  cityControl!: UntypedFormControl;
  postcodeControl!: UntypedFormControl;
  addressOneControl!: UntypedFormControl;
  addressTwoControl!: UntypedFormControl;
  // Billing information
  billingNameControl!: UntypedFormControl;
  billingCityControl!: UntypedFormControl;
  billingPostcodeControl!: UntypedFormControl;
  billingAddressOneControl!: UntypedFormControl;
  billingAddressTwoControl!: UntypedFormControl;

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

  constructor(
    public ordersService: OrdersService,
    public shipmondoService: ShipmondoService,
    private route: ActivatedRoute,
    private location: Location,
    private snackbar: MatSnackBar,
    public clipboard: Clipboard
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
        this.statusControl = new UntypedFormControl(this.order?.status);
        // Customer Information
        this.emailControl = new UntypedFormControl(this.order?.contactInfo.email, [
          Validators.email,
          Validators.required,
        ]);
        this.phoneNumberControl = new UntypedFormControl(this.order?.contactInfo.phoneNumber, [
          Validators.minLength(3),
          Validators.maxLength(15),
          Validators.pattern('^[0-9+ ]*$'),
        ]);
        // Contact Information
        this.nameControl = new UntypedFormControl(this.order?.contactInfo.name, [
          Validators.maxLength(50),
          Validators.pattern('^[^0-9]+$'),
        ]);
        this.cityControl = new UntypedFormControl(this.order?.contactInfo.city, [
          Validators.maxLength(50),
          Validators.minLength(3),
          Validators.pattern('^[^0-9]+$'),
        ]);
        this.postcodeControl = new UntypedFormControl(this.order?.contactInfo.postcode, [
          Validators.minLength(3),
          Validators.maxLength(15),
          Validators.pattern('^[0-9]*$'),
        ]);
        this.addressOneControl = new UntypedFormControl(this.order?.contactInfo.streetAddress, [
          Validators.maxLength(50),
          Validators.minLength(3),
        ]);
        this.addressTwoControl = new UntypedFormControl(this.order?.contactInfo.streetAddress2, [
          Validators.maxLength(50),
          Validators.minLength(3),
        ]);
        // Billing Information
        this.billingNameControl = new UntypedFormControl({ value: this.order?.billingInfo.name, disabled: true });
        this.billingCityControl = new UntypedFormControl({ value: this.order?.billingInfo.city, disabled: true });
        this.billingPostcodeControl = new UntypedFormControl({
          value: this.order?.billingInfo.postcode,
          disabled: true,
        });
        this.billingAddressOneControl = new UntypedFormControl({
          value: this.order?.billingInfo.streetAddress,
          disabled: true,
        });
        this.billingAddressTwoControl = new UntypedFormControl({
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
  getItemPrice(quantity: number, dimension: DesignDimensionEnum, designType: DesignTypeEnum): number {
    switch (designType) {
      case DesignTypeEnum.familyTree:
        switch (dimension) {
          case DesignDimensionEnum.small:
            return quantity * 499;
          case DesignDimensionEnum.medium:
            return quantity * 699;
          case DesignDimensionEnum.large:
            return quantity * 999;
          default:
            return 99999999;
        }
      case DesignTypeEnum.petSign:
        switch (dimension) {
          case DesignDimensionEnum.small:
            return quantity * 299;
          case DesignDimensionEnum.medium:
            return quantity * 399;
          case DesignDimensionEnum.large:
            return quantity * 499;
          default:
            return 99999999;
        }
      case DesignTypeEnum.quotable:
      default:
        switch (dimension) {
          case DesignDimensionEnum.small:
            return quantity * 299;
          case DesignDimensionEnum.medium:
            return quantity * 399;
          case DesignDimensionEnum.large:
            return quantity * 499;
          default:
            return 99999999;
        }
    }
  }

  getSavedAmount(): number {
    if (!this.order) {
      return 0;
    }
    return this.order.subtotal - (this.order.total - this.getDeliveryPrice() - this.getPlantedTreesPrice());
  }

  getDesignViewOnlyUrl(id: string): string {
    const designItem = this.order?.transactionItems.find((item) => item.design.designId === id);
    switch (designItem?.design.designType) {
      case DesignTypeEnum.familyTree:
        return `${env.webstoreUrl}/products/family-tree?designId=${id}`;
      case DesignTypeEnum.petSign:
        return `${env.webstoreUrl}/products/pet-sign?designId=${id}`;
      case DesignTypeEnum.quotable:
      default:
        return `${env.webstoreUrl}/products/quotable?designId=${id}`;
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
      if (this.order.total > 350) {
        return 25;
      } else {
        return 65;
      }
    } else if (this.order?.shippingMethod === ShippingMethodEnum.pickUpPoint) {
      if (this.order.total > 350) {
        return 0;
      } else {
        return 45;
      }
    }
    return 0;
  }

  createShipmondoOrder(): void {
    // Prepare data
    let weight = 0;
    // Calculating the total weight from quantity
    this.order?.transactionItems.forEach((item) => {
      weight += item.quantity;
    });
    // Converting weight to grams
    weight = weight * 1000;
    if (this.order === undefined) {
      console.warn('The order is not defined yet, skipping creation of the shipment object');
      return;
    }

    const orderInfo = {
      instruction: '',
      address: {
        address1: this.order.contactInfo.streetAddress,
        address2: this.order.contactInfo.streetAddress2 || '',
        zipcode: this.order.contactInfo.postcode,
        city: this.order?.contactInfo.city,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        country_code: 'DK',
      },
      contact: {
        name: this.order?.contactInfo.name,
        mobile: this.order?.contactInfo.phoneNumber,
        email: this.order?.contactInfo.email,
      },
      parcels: [
        {
          quantity: 1,
          weight,
        },
      ],
      isHomeDelivery: this.order?.shippingMethod === ShippingMethodEnum.homeDelivery,
    };
    // Send data
    // TODO - name the function etc according to the actual content and purpose
    this.shipmondoService.createOrder(orderInfo).subscribe({
      error: (error: HttpErrorResponse) => {
        console.error(error);
        // TODO - display error via snackbar
      },
      next: () => {
        this.snackbar.open('Order was created successfully!', "I'm big UwU", { duration: 1500 });
      },
    });
  }
}
