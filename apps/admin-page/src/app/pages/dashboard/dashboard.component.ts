/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-expressions */
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
import { Subscriber } from 'rxjs';
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

  twoWeekOrders = 0;
  twoPastWeekOrders = 0;
  twoWeekRevenue = 0;
  twoPastWeekRevenue = 0;
  twoWeekSurplus = 0;
  twoPastWeekSurplus = 0;
  twoWeekSubscribers = 0;
  twoPastWeekSubscribers = 0;

  monthOrders = 0;
  monthPastOrders = 0;
  monthRevenue = 0;
  monthPastRevenue = 0;
  monthSurplus = 0;
  monthPastSurplus = 0;
  monthSubscribers = 0;
  monthPastSubscribers = 0;

  threeMonthOrders = 0;
  threePastMonthOrders = 0;
  threeMonthRevenue = 0;
  threePastMonthRevenue = 0;
  threeMonthSurplus = 0;
  threePastMonthSurplus = 0;
  threeMonthSubscribers = 0;
  threePastMonthSubscribers = 0;

  sixMonthOrders = 0;
  sixPastMonthOrders = 0;
  sixMonthRevenue = 0;
  sixPastMonthRevenue = 0;
  sixMonthSurplus = 0;
  sixPastMonthSurplus = 0;
  sixMonthSubscribers = 0;
  sixPastMonthSubscribers = 0;

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
      },
    });
    this.newsLetterService.getNewsletters().subscribe({
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
      next: (newsletterList: INewsletter[]) => {
        this.fullNewsletterList = newsletterList;
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

    const periodNewsletters = this.fullNewsletterList.filter(
      (newsletter) => new Date(newsletter.createdAt) >= pastDate
    );

    return periodNewsletters;
  }

  getPreviousPeriodNewsletterSignups(dayStart: number, dayEnd: number): INewsletter[] {
    const startDate = new Date(Date.now() - dayStart * 24 * 60 * 60 * 1000);
    const endDate = new Date(Date.now() - dayEnd * 24 * 60 * 60 * 1000);

    const periodNewsletters = this.fullNewsletterList.filter(
      (newsletter) => new Date(newsletter.createdAt) >= endDate && new Date(newsletter.createdAt) < startDate
    );
    return periodNewsletters;
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
  getTwoWeekOrders() {
    const currentPeriodOrders = this.getPeriodOrders(14).length;
    this.twoWeekOrders = currentPeriodOrders;
    return currentPeriodOrders;
  }

  calculateTwoWeekOrderDifference() {
    const currentPeriodOrders = this.getPeriodOrders(14).length;
    const lastPeriodOrders = this.getPreviousPeriodOrders(14, 28).length;
    const percentageDiff = ((currentPeriodOrders - lastPeriodOrders) / currentPeriodOrders) * 100;
    this.twoPastWeekOrders = lastPeriodOrders;
    return percentageDiff;
  }

  getTwoWeekRevenue() {
    const thisPeriodOrders = this.getPeriodOrders(14);
    let revenue = 0;
    thisPeriodOrders.forEach((order) => {
      revenue += order.total;
    });
    this.twoWeekRevenue = revenue;
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
    this.twoPastWeekRevenue = lastPeriodRevenue;
    return ((thisPeriodRevenue - lastPeriodRevenue) / thisPeriodRevenue) * 100;
  }

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
      if (order.plantedTrees > 1) {
        surplus - (10 * order.plantedTrees - 1);
      }
      if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total > 350) {
        surplus - 25;
      } else if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total <= 350) {
        surplus - 65;
      } else if (order.shippingMethod === ShippingMethodEnum.pickUpPoint && order.total <= 350) {
        surplus - 45;
      }
    });
    this.twoWeekSurplus = surplus;
    return surplus;
  }

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
      if (order.plantedTrees > 1) {
        thisPeriodSurplus - (10 * order.plantedTrees - 1);
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
      if (order.plantedTrees > 1) {
        lastPeriodSurplus - (10 * order.plantedTrees - 1);
      }
      if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total > 350) {
        lastPeriodSurplus - 25;
      } else if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total <= 350) {
        lastPeriodSurplus - 65;
      } else if (order.shippingMethod === ShippingMethodEnum.pickUpPoint && order.total <= 350) {
        lastPeriodSurplus - 45;
      }
    });
    this.twoPastWeekSurplus = lastPeriodSurplus;

    return ((thisPeriodSurplus - lastPeriodSurplus) / thisPeriodSurplus) * 100;
  }

  getTwoWeekSubscribers() {
    const thisPeriodSubscribers = this.getPeriodNewsletterSignups(14).length;
    this.twoWeekSubscribers = thisPeriodSubscribers;
    return thisPeriodSubscribers;
  }

  calculateTwoWeekSubscriberDifference() {
    const thisPeriodSubscribers = this.getPeriodNewsletterSignups(14).length;
    const lastPeriodSubscribers = this.getPreviousPeriodNewsletterSignups(14, 28).length;
    this.twoPastWeekSubscribers = lastPeriodSubscribers;
    return ((thisPeriodSubscribers - lastPeriodSubscribers) / thisPeriodSubscribers) * 100;
  }

  // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  // Methods for monthly data

  getMonthOrders() {
    const currentPeriodOrders = this.getPeriodOrders(30).length;
    this.monthOrders = currentPeriodOrders;
    return currentPeriodOrders;
  }

  calculateMonthOrderDifference() {
    const currentPeriodOrders = this.getPeriodOrders(30).length;
    const lastPeriodOrders = this.getPreviousPeriodOrders(30, 60).length;

    this.monthPastOrders = lastPeriodOrders;

    const percentageDiff = ((currentPeriodOrders - lastPeriodOrders) / currentPeriodOrders) * 100;
    return percentageDiff;
  }

  getMonthRevenue() {
    const thisPeriodOrders = this.getPeriodOrders(30);
    let revenue = 0;
    thisPeriodOrders.forEach((order) => {
      revenue += order.total;
    });
    this.monthRevenue = revenue;
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
    this.monthPastRevenue = lastPeriodRevenue;
    return ((thisPeriodRevenue - lastPeriodRevenue) / thisPeriodRevenue) * 100;
  }

  // Surplus = Total - production cost - (trees planted > 1) - shipping
  getMonthSurplus() {
    const thisPeriodOrders = this.getPeriodOrders(30);
    let surplus = this.getMonthRevenue();

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
      if (order.plantedTrees > 1) {
        surplus - (10 * order.plantedTrees - 1);
      }
      if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total > 350) {
        surplus - 25;
      } else if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total <= 350) {
        surplus - 65;
      } else if (order.shippingMethod === ShippingMethodEnum.pickUpPoint && order.total <= 350) {
        surplus - 45;
      }
    });

    this.monthSurplus = surplus;

    return surplus;
  }

  // Surplus = Total - production cost - (trees planted > 1) - shipping
  calculateMonthSurplusDifference() {
    const thisPeriodOrders = this.getPeriodOrders(30);
    let thisPeriodSurplus = this.getMonthRevenue();

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
      if (order.plantedTrees > 1) {
        thisPeriodSurplus - (10 * order.plantedTrees - 1);
      }
      if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total > 350) {
        thisPeriodSurplus - 25;
      } else if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total <= 350) {
        thisPeriodSurplus - 65;
      } else if (order.shippingMethod === ShippingMethodEnum.pickUpPoint && order.total <= 350) {
        thisPeriodSurplus - 45;
      }
    });

    const lastPeriodOrders = this.getPreviousPeriodOrders(30, 60);
    let lastPeriodSurplus = this.getPreviousPeriodRevenue(30, 60);

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
      if (order.plantedTrees > 1) {
        lastPeriodSurplus - (10 * order.plantedTrees - 1);
      }
      if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total > 350) {
        lastPeriodSurplus - 25;
      } else if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total <= 350) {
        lastPeriodSurplus - 65;
      } else if (order.shippingMethod === ShippingMethodEnum.pickUpPoint && order.total <= 350) {
        lastPeriodSurplus - 45;
      }
    });
    this.monthPastSurplus = lastPeriodSurplus;

    return ((thisPeriodSurplus - lastPeriodSurplus) / thisPeriodSurplus) * 100;
  }

  getMonthSubscribers() {
    const thisPeriodSubscribers = this.getPeriodNewsletterSignups(30).length;
    this.monthSubscribers = thisPeriodSubscribers;
    return thisPeriodSubscribers;
  }

  calculateMonthSubscriberDifference() {
    const thisPeriodSubscribers = this.getPeriodNewsletterSignups(30).length;
    const lastPeriodSubscribers = this.getPreviousPeriodNewsletterSignups(30, 60).length;
    this.monthPastSubscribers = lastPeriodSubscribers;
    return ((thisPeriodSubscribers - lastPeriodSubscribers) / thisPeriodSubscribers) * 100;
  }

  // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  // Methods for 3 month data

  getThreeMonthOrders() {
    const currentPeriodOrders = this.getPeriodOrders(90).length;
    this.threeMonthOrders = currentPeriodOrders;
    return currentPeriodOrders;
  }

  calculateThreeMonthOrderDifference() {
    const currentPeriodOrders = this.getPeriodOrders(90).length;
    const lastPeriodOrders = this.getPreviousPeriodOrders(90, 180).length;
    const percentageDiff = ((currentPeriodOrders - lastPeriodOrders) / currentPeriodOrders) * 100;
    this.threePastMonthOrders = lastPeriodOrders;
    return percentageDiff;
  }

  getThreeMonthRevenue() {
    const thisPeriodOrders = this.getPeriodOrders(90);
    let revenue = 0;
    thisPeriodOrders.forEach((order) => {
      revenue += order.total;
    });
    this.threeMonthRevenue = revenue;
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
    this.threePastMonthRevenue = lastPeriodRevenue;
    return ((thisPeriodRevenue - lastPeriodRevenue) / thisPeriodRevenue) * 100;
  }

  // Surplus = Total - production cost - (trees planted > 1) - shipping
  getThreeMonthSurplus() {
    const thisPeriodOrders = this.getPeriodOrders(90);
    let surplus = this.getMonthRevenue();

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
      if (order.plantedTrees > 1) {
        surplus - (10 * order.plantedTrees - 1);
      }
      if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total > 350) {
        surplus - 25;
      } else if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total <= 350) {
        surplus - 65;
      } else if (order.shippingMethod === ShippingMethodEnum.pickUpPoint && order.total <= 350) {
        surplus - 45;
      }
    });
    this.threeMonthSurplus = surplus;
    return surplus;
  }

  // Surplus = Total - production cost - (trees planted > 1) - shipping
  calculateThreeMonthSurplusDifference() {
    const thisPeriodOrders = this.getPeriodOrders(90);
    let thisPeriodSurplus = this.getThreeMonthRevenue();

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
      if (order.plantedTrees > 1) {
        thisPeriodSurplus - (10 * order.plantedTrees - 1);
      }
      if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total > 350) {
        thisPeriodSurplus - 25;
      } else if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total <= 350) {
        thisPeriodSurplus - 65;
      } else if (order.shippingMethod === ShippingMethodEnum.pickUpPoint && order.total <= 350) {
        thisPeriodSurplus - 45;
      }
    });

    const lastPeriodOrders = this.getPreviousPeriodOrders(90, 180);
    let lastPeriodSurplus = this.getPreviousPeriodRevenue(90, 180);

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
      if (order.plantedTrees > 1) {
        lastPeriodSurplus - (10 * order.plantedTrees - 1);
      }
      if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total > 350) {
        lastPeriodSurplus - 25;
      } else if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total <= 350) {
        lastPeriodSurplus - 65;
      } else if (order.shippingMethod === ShippingMethodEnum.pickUpPoint && order.total <= 350) {
        lastPeriodSurplus - 45;
      }
    });
    this.threePastMonthSurplus = lastPeriodSurplus;
    return ((thisPeriodSurplus - lastPeriodSurplus) / thisPeriodSurplus) * 100;
  }

  getThreeMonthSubscribers() {
    const thisPeriodSubscribers = this.getPeriodNewsletterSignups(90).length;
    this.threeMonthSubscribers = thisPeriodSubscribers;
    return thisPeriodSubscribers;
  }

  calculateThreeMonthSubscriberDifference() {
    const thisPeriodSubscribers = this.getPeriodNewsletterSignups(90).length;
    const lastPeriodSubscribers = this.getPreviousPeriodNewsletterSignups(90, 180).length;
    this.threePastMonthSubscribers = lastPeriodSubscribers;
    return ((thisPeriodSubscribers - lastPeriodSubscribers) / thisPeriodSubscribers) * 100;
  }

  // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  // Methods for 6 month data

  getSixMonthOrders() {
    const currentPeriodOrders = this.getPeriodOrders(180).length;
    this.sixMonthOrders = currentPeriodOrders;
    return currentPeriodOrders;
  }

  calculateSixMonthOrderDifference() {
    const currentPeriodOrders = this.getPeriodOrders(180).length;
    const lastPeriodOrders = this.getPreviousPeriodOrders(180, 360).length;
    const percentageDiff = ((currentPeriodOrders - lastPeriodOrders) / currentPeriodOrders) * 100;
    this.sixPastMonthOrders = lastPeriodOrders;
    return percentageDiff;
  }

  getSixMonthRevenue() {
    const thisPeriodOrders = this.getPeriodOrders(180);
    let revenue = 0;
    thisPeriodOrders.forEach((order) => {
      revenue += order.total;
    });
    this.sixMonthRevenue = revenue;
    return revenue;
  }

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
    this.sixPastMonthRevenue = lastPeriodRevenue;
    return ((thisPeriodRevenue - lastPeriodRevenue) / thisPeriodRevenue) * 100;
  }

  // Surplus = Total - production cost - (trees planted > 1) - shipping
  getSixMonthSurplus() {
    const thisPeriodOrders = this.getPeriodOrders(180);
    let surplus = this.getMonthRevenue();

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
      if (order.plantedTrees > 1) {
        surplus - (10 * order.plantedTrees - 1);
      }
      if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total > 350) {
        surplus - 25;
      } else if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total <= 350) {
        surplus - 65;
      } else if (order.shippingMethod === ShippingMethodEnum.pickUpPoint && order.total <= 350) {
        surplus - 45;
      }
    });
    this.sixMonthSurplus = surplus;
    return surplus;
  }

  // Surplus = Total - production cost - (trees planted > 1) - shipping
  calculateSixMonthSurplusDifference() {
    const thisPeriodOrders = this.getPeriodOrders(180);
    let thisPeriodSurplus = this.getSixMonthRevenue();

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
      if (order.plantedTrees > 1) {
        thisPeriodSurplus - (10 * order.plantedTrees - 1);
      }
      if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total > 350) {
        thisPeriodSurplus - 25;
      } else if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total <= 350) {
        thisPeriodSurplus - 65;
      } else if (order.shippingMethod === ShippingMethodEnum.pickUpPoint && order.total <= 350) {
        thisPeriodSurplus - 45;
      }
    });

    const lastPeriodOrders = this.getPreviousPeriodOrders(180, 360);
    let lastPeriodSurplus = this.getPreviousPeriodRevenue(180, 360);

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
      if (order.plantedTrees > 1) {
        lastPeriodSurplus - (10 * order.plantedTrees - 1);
      }
      if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total > 350) {
        lastPeriodSurplus - 25;
      } else if (order.shippingMethod === ShippingMethodEnum.homeDelivery && order.total <= 350) {
        lastPeriodSurplus - 65;
      } else if (order.shippingMethod === ShippingMethodEnum.pickUpPoint && order.total <= 350) {
        lastPeriodSurplus - 45;
      }
    });
    this.sixPastMonthSurplus = lastPeriodSurplus;
    return ((thisPeriodSurplus - lastPeriodSurplus) / thisPeriodSurplus) * 100;
  }

  getSixMonthSubscribers() {
    const thisPeriodSubscribers = this.getPeriodNewsletterSignups(180).length;
    this.sixMonthSubscribers = thisPeriodSubscribers;
    return thisPeriodSubscribers;
  }

  calculateSixMonthSubscriberDifference() {
    const thisPeriodSubscribers = this.getPeriodNewsletterSignups(180).length;
    const lastPeriodSubscribers = this.getPreviousPeriodNewsletterSignups(180, 360).length;
    this.sixPastMonthSubscribers = lastPeriodSubscribers;
    return ((thisPeriodSubscribers - lastPeriodSubscribers) / thisPeriodSubscribers) * 100;
  }
}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
