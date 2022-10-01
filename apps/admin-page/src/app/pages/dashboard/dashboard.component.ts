import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CurrencyEnum, DiscountType, IOrder, OrderStatusEnum, ShippingMethodEnum } from '@interfaces';
import { OrdersService } from '../../services/orders/orders.service';

@Component({
  selector: 'webstore-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private ordersService: OrdersService) {}

  displayedColumns: string[] = ['category', 'week', 'month', '3-month', '6-month'];

  today = new Date();

  fullOrdersList!: IOrder[];

  ngOnInit(): void {
    this.fetchAllData();
  }

  fetchAllData() {
    this.ordersService.getOrders().subscribe({
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
      next: (ordersList: IOrder[]) => {
        this.fullOrdersList = ordersList;
        this.getPeriodOrders(7);
        this.getWeekRevenue();
      },
    });
  }

  /*
  Will return an array of orders that were created between today 
  and a user-defined day in the past 
  7 days - Week, 30 days - Month, 90 days - 3 months, 180 days - 6 months.
  */
  getPeriodOrders(days: number): IOrder[] {
    const pastDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const periodOrders = this.fullOrdersList.filter((order) => new Date(order.createdAt) >= pastDate);

    return periodOrders;
  }

  /*
  Will return an array of orders that were created between two user-defined dates.
  The first date is the start of the period (the end of the period chronologically)
  The second date is the end of the period (the start of the period chronologically)
  E.g. to select 2 weeks ago: (7, 14) would be the provided numbers
  */
  getPreviousPeriodOrders(dayStart: number, dayEnd: number): IOrder[] {
    const startDate = new Date(Date.now() - dayStart * 24 * 60 * 60 * 1000);
    const endDate = new Date(Date.now() - dayEnd * 24 * 60 * 60 * 1000);

    const periodOrders = this.fullOrdersList.filter(
      (order) => new Date(order.createdAt) >= endDate && new Date(order.createdAt) < startDate
    );
    console.log(periodOrders);

    return periodOrders;
  }

  /**
   * Gets the delivery price based on the shipping method.
   *
   * @returns the delivery price.
   */
  getDeliveryPrice(order: IOrder): number {
    if (order.shippingMethod === ShippingMethodEnum.homeDelivery) {
      if (order.total > 350) {
        return 25;
      } else {
        return 65;
      }
    } else if (order.shippingMethod === ShippingMethodEnum.pickUpPoint) {
      if (order.total > 350) {
        return 0;
      } else {
        return 45;
      }
    }
    return 0;
  }

  // Methods for weekly data
  getWeekOrders() {
    const currentPeriodOrders = this.getPeriodOrders(7).length;
    return currentPeriodOrders;
  }

  calculateWeekOrderDifference() {
    const currentPeriodOrders = this.getPeriodOrders(7).length;
    const previousPeriodOrders = this.getPreviousPeriodOrders(7, 14).length;
    const percentageDiff = ((currentPeriodOrders - previousPeriodOrders) / currentPeriodOrders) * 100;
    return percentageDiff;
  }

  getWeekRevenue() {
    const thisPeriodOrders = this.getPeriodOrders(7);
    let revenue = 0;
    thisPeriodOrders.forEach((order) => {
      revenue += order.total;
    });
    return revenue;
  }

  //TODO: Add test orders to array to test everything.
  calculateWeekRevenueDifference() {
    const thisPeriodOrders = this.getPeriodOrders(7);
    const lastPeriodOrders = this.getPreviousPeriodOrders(7, 14);
    let thisPeriodRevenue = 0;
    let lastPeriodRevenue = 0;
    thisPeriodOrders.forEach((order) => {
      thisPeriodRevenue += order.total;
    });
    lastPeriodOrders.forEach((order) => {
      lastPeriodRevenue += order.total;
    });

    const thisTestPeriodOrders = this.getPeriodOrders(7);
    const lastTestPeriodOrders = this.getPreviousPeriodOrders(7, 14);
    let thisTestPeriodRevenue = 0;
    let lastTestPeriodRevenue = 0;
    thisTestPeriodOrders.forEach((order) => {
      thisTestPeriodRevenue += order.total;
    });
    lastTestPeriodOrders.forEach((order) => {
      lastTestPeriodRevenue += order.total;
    });
    return ((thisPeriodRevenue - lastPeriodRevenue) / thisPeriodRevenue) * 100;
  }

  //TODO: Implement the logic
  // Surplus = Total - production cost - (trees planted > 1) - shipping
  getWeekSurplus() {}

  //TODO: Implement the logic
  // Surplus = Total - production cost - (trees planted > 1) - shipping
  calculateWeekSurplusDifference() {}

  //TODO: Implement the logic
  getWeekSubscribers() {}

  //TODO: Implement the logic
  calculateWeekSubscriberDifference() {}

  // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  //TODO: Implement the logic
  // Methods for monthly data
  getMonthOrders() {
    const currentPeriodOrders = this.getPeriodOrders(30).length;
    return currentPeriodOrders;
  }

  //TODO: Implement the logic
  calculateMonthOrderDifference() {
    const currentPeriodOrders = this.getPeriodOrders(30).length;
    const previousPeriodOrders = this.getPreviousPeriodOrders(30, 60).length;
    const percentageDiff = ((currentPeriodOrders - previousPeriodOrders) / currentPeriodOrders) * 100;
    return percentageDiff;
  }

  //TODO: Implement the logic
  getMonthRevenue() {
    const thisPeriodOrders = this.getPeriodOrders(30);
    let revenue = 0;
    thisPeriodOrders.forEach((order) => {
      revenue += order.total;
    });
    return revenue;
  }

  //TODO: Implement the logic
  calculateMonthRevenueDifference() {}

  //TODO: Implement the logic
  // Surplus = Total - production cost - (trees planted > 1) - shipping
  getMonthSurplus() {}

  //TODO: Implement the logic
  // Surplus = Total - production cost - (trees planted > 1) - shipping
  calculateMonthSurplusDifference() {}

  //TODO: Implement the logic
  getMonthSubscribers() {}

  //TODO: Implement the logic
  calculateMonthSubscriberDifference() {}

  //TODO: Implement the logic
  // Methods for 3 month data
  getThreeMonthOrders() {
    const currentPeriodOrders = this.getPeriodOrders(90).length;

    return currentPeriodOrders;
  }

  //TODO: Implement the logic
  calculateThreeMonthOrderDifference() {
    const currentPeriodOrders = this.getPeriodOrders(90).length;
    const previousPeriodOrders = this.getPreviousPeriodOrders(90, 180).length;
    const percentageDiff = ((currentPeriodOrders - previousPeriodOrders) / currentPeriodOrders) * 100;
    return percentageDiff;
  }

  //TODO: Implement the logic
  getThreeMonthRevenue() {
    const thisPeriodOrders = this.getPeriodOrders(90);
    let revenue = 0;
    thisPeriodOrders.forEach((order) => {
      revenue += order.total;
    });
    return revenue;
  }

  //TODO: Implement the logic
  calculateThreeMonthRevenueDifference() {}

  //TODO: Implement the logic
  // Surplus = Total - production cost - (trees planted > 1) - shipping
  getThreeMonthSurplus() {}

  //TODO: Implement the logic
  // Surplus = Total - production cost - (trees planted > 1) - shipping
  calculateThreeMonthSurplusDifference() {}

  //TODO: Implement the logic
  getThreeMonthSubscribers() {}

  //TODO: Implement the logic
  calculateThreeMonthSubscriberDifference() {}

  //TODO: Implement the logic
  // Methods for 6 month data
  getSixMonthOrders() {
    const currentPeriodOrders = this.getPeriodOrders(180).length;
    return currentPeriodOrders;
  }

  //TODO: Implement the logic
  calculateSixMonthOrderDifference() {
    const currentPeriodOrders = this.getPeriodOrders(180).length;
    const previousPeriodOrders = this.getPreviousPeriodOrders(180, 360).length;
    const percentageDiff = ((currentPeriodOrders - previousPeriodOrders) / currentPeriodOrders) * 100;
    return percentageDiff;
  }

  //TODO: Implement the logic
  getSixMonthRevenue() {
    const thisPeriodOrders = this.getPeriodOrders(180);
    let revenue = 0;
    thisPeriodOrders.forEach((order) => {
      revenue += order.total;
    });
    return revenue;
  }

  //TODO: Implement the logic
  calculateSixMonthRevenueDifference() {}

  //TODO: Implement the logic
  // Surplus = Total - production cost - (trees planted > 1) - shipping
  getSixMonthSurplus() {}

  //TODO: Implement the logic
  // Surplus = Total - production cost - (trees planted > 1) - shipping
  calculateSixMonthSurplusDifference() {}

  //TODO: Implement the logic
  getSixMonthSubscribers() {}

  //TODO: Implement the logic
  calculateSixMonthSubscriberDifference() {}
}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function createdAt(days: number): Date {
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - days * 24 * 60 * 60 * 1000);

  return createdAt;
}

function mockOrder(status: OrderStatusEnum, days: number): IOrder {
  return {
    status: status,
    billingInfo: {
      city: 'cph',
      country: 'Denmark',
      email: 'example@hotdeals.dev',
      name: 'John Doe',
      phoneNumber: '+4512345678',
      postcode: '9999',
      streetAddress: 'StreetGade 123',
    },
    contactInfo: {
      city: 'cph',
      country: 'Denmark',
      email: 'example@hotdeals.dev',
      name: 'John Doe',
      phoneNumber: '+4512345678',
      postcode: '9999',
      streetAddress: 'StreetGade 123',
    },
    createdAt: createdAt(days),
    currency: CurrencyEnum.dkk,
    discount: {
      discountCode: 'suck it',
      type: DiscountType.amount,
      amount: 0,
      remainingUses: 1,
      totalUses: 2,
      isEnabled: true,
    },
    orderId: 'MakeMeWantIt',
    paymentId: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
    plantedTrees: 1,
    shippingMethod: ShippingMethodEnum.homeDelivery,
    //State    -- not implemented
    subtotal: 424,
    total: 399,
    transactionItems: [],
    userId: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
  };
}
