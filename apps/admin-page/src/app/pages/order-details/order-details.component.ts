import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DesignDimensionEnum, IOrder, ITransactionItem, OrderStatusEnum, ShippingMethodEnum } from '@interfaces';
import { OrdersService } from '../../services/orders/orders.service';
import { ShipmondoService } from '../../services/shipmondo/shipmondo.service';
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

  constructor(public ordersService: OrdersService, public shipmondoService: ShipmondoService, private route: ActivatedRoute, private location: Location, private snackBar: MatSnackBar) {
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
   * Gets triggered when the status of an order has been changed.\
   * It will call the API to update the order with its new status.\
   * In case an error is encountered, the orders will be reloaded from the database.
   *
   * @param order - the order containing the new status.
   */
  onStatusChange(order: IOrder): void {
    this.ordersService.updateOrder(order).subscribe({
      error: (error: HttpErrorResponse) => {
        if (this.id !== undefined) {
          this.fetchOrder(this.id);
        }
        console.error(error);
      },
    });
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

  createShipmondoOrder(): void {
    // Prepare data    
    let weight = 0;
    // Calculating the total weight from quantity
    this.order?.transactionItems.forEach((item) => {
      weight += item.quantity;
    });
    // Converting weight to grams
    weight = weight * 1000;
    const orderInfo = {
      instruction: "", // TODO - Ask Teo about "instruction"
      address: {
        address1: this.order?.contactInfo.streetAddress,
        address2: this.order?.contactInfo.streetAddress2,
        zipcode: this.order?.contactInfo.postcode,
        city: this.order?.contactInfo.city,
        country_code: "DK"
      },
      contact: {
        name: this.order?.contactInfo.name,
        mobile: this.order?.contactInfo.phoneNumber,
        email: this.order?.contactInfo.email
      },
      parcels: [
        {
          quantity: 1,
          weight
        }
      ],
      isHomeDelivery: this.order?.shippingMethod === ShippingMethodEnum.homeDelivery,
    };
    // Send data
    this.shipmondoService.createOrder(orderInfo).subscribe({
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
      next: (shipmondoOrder: Object) => {
        console.log("Order Info:", shipmondoOrder);
        this.snackBar.open('Order was created successfully!', "I'm big UwU", { duration: 1500 });
      },
    });


  }
}
