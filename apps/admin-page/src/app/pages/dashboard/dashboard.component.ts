import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  CurrencyEnum,
  DesignDimensionEnum,
  DiscountType,
  INewsletter,
  IOrder,
  OrderStatusEnum,
  ShippingMethodEnum,
} from '@interfaces';
import { NewsletterService } from '../../services/newsletter/newsletter.service';
import { OrdersService } from '../../services/orders/orders.service';

@Component({
  selector: 'webstore-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private ordersService: OrdersService, private newsLetterService: NewsletterService) {}

  displayedColumns: string[] = ['category', '2-week', 'month', '3-month', '6-month'];

  today = new Date();

  fullOrdersList!: IOrder[];
  fullNewsletterList!: INewsletter[];

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
        console.log(this.fullOrdersList);

        this.calculateThreeMonthRevenueDifference();
      },
    });
    this.newsLetterService.getNewsletters().subscribe({
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
      next: (newsletterList: INewsletter[]) => {
        this.fullNewsletterList = newsletterList;
        console.log(this.fullNewsletterList);
        
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
    return periodOrders;
  }

  getPreviousPeriodRevenue(dayStart: number, dayEnd: number): number {
    let previousPeriodRevenue = 0;
    const previousPeriodOrders = this.getPreviousPeriodOrders(dayStart, dayEnd);
    previousPeriodOrders.forEach((order) => {
      previousPeriodRevenue += order.total;
    });
    return previousPeriodRevenue;
  }

  getPeriodNewsletterSignups(days: number): INewsletter[] {
    const pastDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const periodNewsletters = this.fullNewsletterList.filter((newsletter) => new Date(newsletter.createdAt) >= pastDate)

    return periodNewsletters;
  }

  getPreviousPeriodNewsletters(dayStart: number, dayEnd: number): INewsletter[] {
    const startDate = new Date(Date.now() - dayStart * 24 * 60 * 60 * 1000);
    const endDate = new Date(Date.now() - dayEnd * 24 * 60 * 60 * 1000);

    const periodNewsletters = this.fullNewsletterList.filter(
      (newsletter) => new Date(newsletter.createdAt) >= endDate && new Date(newsletter.createdAt) < startDate
    );
    return periodNewsletters;
  };

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

  past = 1;
  current = 2;

  // Methods for weekly data
  getTwoWeekOrders() {
    const currentPeriodOrders = this.getPeriodOrders(14).length;
    const previousPeriodOrders = this.getPreviousPeriodOrders(14, 28).length;
    return currentPeriodOrders;
  }

  calculateTwoWeekOrderDifference() {
    const currentPeriodOrders = this.getPeriodOrders(14).length;
    const previousPeriodOrders = this.getPreviousPeriodOrders(14, 28).length;
    const percentageDiff = ((currentPeriodOrders - previousPeriodOrders) / currentPeriodOrders) * 100;
    return percentageDiff;
  }

  getTwoWeekRevenue() {
    const thisPeriodOrders = this.getPeriodOrders(14);
    let revenue = 0;
    thisPeriodOrders.forEach((order) => {
      revenue += order.total;
    });
    return revenue;
  }

  calculateTwoWeekRevenueDifference() {
    const thisPeriodOrders = this.getPeriodOrders(14);
    const lastPeriodOrders = this.getPreviousPeriodOrders(14, 28);
    let thisPeriodRevenue = 0;
    let lastPeriodRevenue = 0;
    thisPeriodOrders.forEach((order) => {
      thisPeriodRevenue += order.total;
    });
    lastPeriodOrders.forEach((order) => {
      lastPeriodRevenue += order.total;
    });

    return ((thisPeriodRevenue - lastPeriodRevenue) / thisPeriodRevenue) * 100;
  }

  //TODO: Implement the logic
  // Surplus = Total - production cost - (trees planted > 1) - shipping
  getTwoWeekSurplus() {
    const thisPeriodOrders = this.getPeriodOrders(14);
    let surplus = this.getTwoWeekRevenue();

    thisPeriodOrders.forEach((order) => {
      order.transactionItems.forEach((item) => {
        if (item.dimension === DesignDimensionEnum.small) {
          surplus - 135;
        } else if (item.dimension === DesignDimensionEnum.medium) {
          surplus - 161;
        } else if (item.dimension === DesignDimensionEnum.large) {
          surplus - 205;
        } else if (item.dimension === DesignDimensionEnum.mini) {
          surplus - 115;
        }
      });
      if (order.transactionItems.length > 1) {
        surplus - (10 * order.transactionItems.length - 1);
      }
      if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total > 350) {
        surplus - 25;
      } else if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total <= 350) {
        surplus - 65;
      } else if (order.shippingMethod === ShippingMethodEnum.pickUpPoint && order.total <= 350) {
        surplus - 45;
      }
    });
  }

  //TODO: Implement the logic
  // Surplus = Total - production cost - (trees planted > 1) - shipping
  calculateTwoWeekSurplusDifference() {
    const thisPeriodOrders = this.getPeriodOrders(14);
    let thisPeriodSurplus = this.getTwoWeekRevenue();

    thisPeriodOrders.forEach((order) => {
      order.transactionItems.forEach((item) => {
        if (item.dimension === DesignDimensionEnum.small) {
          thisPeriodSurplus - 135;
        } else if (item.dimension === DesignDimensionEnum.medium) {
          thisPeriodSurplus - 161;
        } else if (item.dimension === DesignDimensionEnum.large) {
          thisPeriodSurplus - 205;
        } else if (item.dimension === DesignDimensionEnum.mini) {
          thisPeriodSurplus - 115;
        }
      });
      if (order.transactionItems.length > 1) {
        thisPeriodSurplus - (10 * order.transactionItems.length - 1);
      }
      if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total > 350) {
        thisPeriodSurplus - 25;
      } else if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total <= 350) {
        thisPeriodSurplus - 65;
      } else if (order.shippingMethod === ShippingMethodEnum.pickUpPoint && order.total <= 350) {
        thisPeriodSurplus - 45;
      }
    });

    const lastPeriodOrders = this.getPreviousPeriodOrders(14, 28);
    let lastPeriodSurplus = this.getPreviousPeriodRevenue(14, 28);

    lastPeriodOrders.forEach((order) => {
      order.transactionItems.forEach((item) => {
        if (item.dimension === DesignDimensionEnum.small) {
          lastPeriodSurplus - 135;
        } else if (item.dimension === DesignDimensionEnum.medium) {
          lastPeriodSurplus - 161;
        } else if (item.dimension === DesignDimensionEnum.large) {
          lastPeriodSurplus - 205;
        } else if (item.dimension === DesignDimensionEnum.mini) {
          lastPeriodSurplus - 115;
        }
      });
      if (order.transactionItems.length > 1) {
        lastPeriodSurplus - (10 * order.transactionItems.length - 1);
      }
      if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total > 350) {
        lastPeriodSurplus - 25;
      } else if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total <= 350) {
        lastPeriodSurplus - 65;
      } else if (order.shippingMethod === ShippingMethodEnum.pickUpPoint && order.total <= 350) {
        lastPeriodSurplus - 45;
      }
    });

    return ((thisPeriodSurplus - lastPeriodSurplus) / thisPeriodSurplus) * 100;
  }

  //TODO: Implement the logic
  getTwoWeekSubscribers() {}

  //TODO: Implement the logic
  calculateTwoWeekSubscriberDifference() {}

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

  calculateMonthRevenueDifference() {
    const thisPeriodOrders = this.getPeriodOrders(30);
    const lastPeriodOrders = this.getPreviousPeriodOrders(30, 60);
    let thisPeriodRevenue = 0;
    let lastPeriodRevenue = 0;
    thisPeriodOrders.forEach((order) => {
      thisPeriodRevenue += order.total;
    });
    lastPeriodOrders.forEach((order) => {
      lastPeriodRevenue += order.total;
    });

    return ((thisPeriodRevenue - lastPeriodRevenue) / thisPeriodRevenue) * 100;
  }

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

  // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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

  calculateThreeMonthRevenueDifference() {
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

    return ((thisPeriodRevenue - lastPeriodRevenue) / thisPeriodRevenue) * 100;
  }

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

  // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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
  calculateSixMonthRevenueDifference() {
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

    return ((thisPeriodRevenue - lastPeriodRevenue) / thisPeriodRevenue) * 100;
  }

  //TODO: Implement the logic
  // Surplus = Total - production cost - (trees planted > 1) - shipping
  getSixMonthSurplus() {}

  //TODO: Implement the logic
  // Surplus = Total - production cost - (trees planted > 1) - shipping
  calculateSixMonthSurplusDifference() {
    // Testing portion of the function. TODO: Delete after testing.
    const thisTestPeriodOrders: IOrder[] = [];
    const lastTestPeriodOrders: IOrder[] = [];
    let thisTestPeriodRevenue = 0;
    let lastTestPeriodRevenue = 0;

    const mockOrderOne = mockOrder(OrderStatusEnum.initial, 89);
    thisTestPeriodOrders.push(mockOrderOne);
    const mockOrderTwo = mockOrder(OrderStatusEnum.initial, 90);
    thisTestPeriodOrders.push(mockOrderTwo);
    const mockOrderThree = mockOrder(OrderStatusEnum.initial, 7);
    thisTestPeriodOrders.push(mockOrderThree);
    thisTestPeriodOrders.forEach((order) => {
      thisTestPeriodRevenue += order.total;
    });

    const mockOrderFour = mockOrder(OrderStatusEnum.initial, 91);
    lastTestPeriodOrders.push(mockOrderFour);
    const mockOrderFive = mockOrder(OrderStatusEnum.initial, 120);
    lastTestPeriodOrders.push(mockOrderFive);
    const mockOrderSix = mockOrder(OrderStatusEnum.initial, 175);
    lastTestPeriodOrders.push(mockOrderSix);
    const mockOrderSeven = mockOrder(OrderStatusEnum.initial, 177);
    lastTestPeriodOrders.push(mockOrderSeven);
    lastTestPeriodOrders.forEach((order) => {
      lastTestPeriodRevenue += order.total;
    });
    console.log(((thisTestPeriodRevenue - lastTestPeriodRevenue) / thisTestPeriodRevenue) * 100);
  }

  //TODO: Implement the logic
  getSixMonthSubscribers() {}

  //TODO: Implement the logic
  calculateSixMonthSubscriberDifference() {}
}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function createdAt(days: number): Date {
  const creationDate = new Date();
  creationDate.setDate(creationDate.getDate() - days * 24 * 60 * 60 * 1000);

  return creationDate;
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
    subtotal: 399,
    total: 424,
    transactionItems: [],
    userId: 'c0a80121-7ac0-190b-812a1-c08ab0a12345',
  };
}
