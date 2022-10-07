import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DesignDimensionEnum, INewsletter, IOrder, ShippingMethodEnum } from '@interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewsletterService } from '../../services/newsletter/newsletter.service';
import { OrdersService } from '../../services/orders/orders.service';

@Component({
  selector: 'webstore-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  /**
   * @param snackBar
   */
  constructor(
    private ordersService: OrdersService,
    private newsLetterService: NewsletterService,
    private snackBar: MatSnackBar
  ) {}

  ordersIsLoading = true;
  newslettersIsLoading = true;

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
        this.snackBar.open('Failed to get orders', 'You should try again', { duration: 5000 });
      },
      next: (ordersList: IOrder[]) => {
        this.fullOrdersList = ordersList;
        this.ordersIsLoading = false;
        this.setOrderTableData();
      },
    });
    this.newsLetterService.getNewsletters().subscribe({
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.snackBar.open('Failed to get newletters', 'You should try again', { duration: 5000 });
      },
      next: (newsletterList: INewsletter[]) => {
        this.fullNewsletterList = newsletterList;
        this.newslettersIsLoading = false;
        this.setNewsletterTableData();
      },
    });
  }

  setOrderTableData() {
    this.getPeriodOrderCount(14);
    this.getPeriodOrderCount(30);
    this.getPeriodOrderCount(90);
    this.getPeriodOrderCount(180);
    this.calculatePeriodOrderCountDifference(14, 28);
    this.calculatePeriodOrderCountDifference(30, 60);
    this.calculatePeriodOrderCountDifference(90, 180);
    this.calculatePeriodOrderCountDifference(180, 360);
    this.getPeriodRevenue(14);
    this.getPeriodRevenue(30);
    this.getPeriodRevenue(90);
    this.getPeriodRevenue(180);
    this.calculatePeriodRevenueDifference(14, 28);
    this.calculatePeriodRevenueDifference(30, 60);
    this.calculatePeriodRevenueDifference(90, 180);
    this.calculatePeriodRevenueDifference(180, 360);
    this.getPeriodSurplus(14);
    this.getPeriodSurplus(30);
    this.getPeriodSurplus(90);
    this.getPeriodSurplus(180);
    this.calculatePeriodSurplusDifference(14, 28);
    this.calculatePeriodSurplusDifference(30, 60);
    this.calculatePeriodSurplusDifference(90, 180);
    this.calculatePeriodSurplusDifference(180, 360);
  }

  setNewsletterTableData() {
    this.getPeriodSubscriberCount(14);
    this.getPeriodSubscriberCount(30);
    this.getPeriodSubscriberCount(90);
    this.getPeriodSubscriberCount(180);
    this.calculatePeriodSubscriberCountDifference(14, 28);
    this.calculatePeriodSubscriberCountDifference(30, 60);
    this.calculatePeriodSubscriberCountDifference(90, 180);
    this.calculatePeriodSubscriberCountDifference(180, 360);
  }

  getPeriodOrders(days: number): IOrder[] {
    const pastDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const periodOrders = this.fullOrdersList.filter((order) => new Date(order.createdAt) >= pastDate);

    return periodOrders;
  }

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

  getPercentDiff(thisPeriod: number, lastPeriod: number): string {
    return (((thisPeriod - lastPeriod) / lastPeriod) * 100).toFixed(1);
  }

  subtractDimensionSize(itemDimension: DesignDimensionEnum): number {
    if (itemDimension === DesignDimensionEnum.small) {
      return 135;
    } else if (itemDimension === DesignDimensionEnum.medium) {
      return 161;
    } else if (itemDimension === DesignDimensionEnum.large) {
      return 205;
    } else {
      return 115;
    }
  }

  subtractPlantedTrees(order: IOrder): number {
    if (order.plantedTrees > 1) {
      return (order.plantedTrees - 1) * 10;
    } else {
      return 0;
    }
  }

  subtractShippingCost(shippingMethod: ShippingMethodEnum, orderTotal: number): number {
    if (shippingMethod === ShippingMethodEnum.homeDelivery && orderTotal > 350) {
      return 25;
    } else if (shippingMethod === ShippingMethodEnum.homeDelivery && orderTotal <= 350) {
      return 65;
    } else if (shippingMethod === ShippingMethodEnum.pickUpPoint && orderTotal <= 350) {
      return 45;
    } else {
      return 0;
    }
  }

  getPeriodOrderCount(period: number): number {
    const thisPeriodOrderCount = this.getPeriodOrders(period).length;
    switch (period) {
      case 14:
        this.twoWeekOrders = thisPeriodOrderCount;
        break;
      case 30:
        this.monthOrders = thisPeriodOrderCount;
        break;
      case 90:
        this.threeMonthOrders = thisPeriodOrderCount;
        break;
      case 180:
      default:
        this.sixMonthOrders = thisPeriodOrderCount;
        break;
    }
    return thisPeriodOrderCount;
  }

  calculatePeriodOrderCountDifference(periodStart: number, periodEnd: number): string {
    const thisPeriodOrderCount = this.getPeriodOrders(periodStart).length;
    const lastPeriodOrderCount = this.getPreviousPeriodOrders(periodStart, periodEnd).length;
    if (periodStart === 14 && periodEnd === 28) {
      this.twoPastWeekOrders = lastPeriodOrderCount;
    } else if (periodStart === 30 && periodEnd === 60) {
      this.monthPastOrders = lastPeriodOrderCount;
    } else if (periodStart === 90 && periodEnd === 180) {
      this.threePastMonthOrders = lastPeriodOrderCount;
    } else {
      this.sixPastMonthOrders = lastPeriodOrderCount;
    }
    return this.getPercentDiff(thisPeriodOrderCount, lastPeriodOrderCount);
  }

  getPeriodRevenue(period: number): number {
    const thisPeriodOrders = this.getPeriodOrders(period);
    let thisPeriodRevenue = 0;
    thisPeriodOrders.forEach((order) => {
      thisPeriodRevenue += order.total;
    });
    switch (period) {
      case 14:
        this.twoWeekRevenue = thisPeriodRevenue;
        break;
      case 30:
        this.monthRevenue = thisPeriodRevenue;
        break;
      case 90:
        this.threeMonthRevenue = thisPeriodRevenue;
        break;
      case 180:
      default:
        this.sixMonthRevenue = thisPeriodRevenue;
    }
    return thisPeriodRevenue;
  }

  calculatePeriodRevenueDifference(periodStart: number, periodEnd: number): string {
    const thisPeriodOrders = this.getPeriodOrders(periodStart);
    const lastPeriodOrders = this.getPreviousPeriodOrders(periodStart, periodEnd);
    let thisPeriodRevenue = 0;
    let lastPeriodRevenue = 0;

    thisPeriodOrders.forEach((order) => {
      thisPeriodRevenue += order.total;
    });
    lastPeriodOrders.forEach((order) => {
      lastPeriodRevenue += order.total;
    });

    if (periodStart === 14 && periodEnd === 28) {
      this.twoPastWeekRevenue = lastPeriodRevenue;
    } else if (periodStart === 30 && periodEnd === 60) {
      this.monthPastRevenue = lastPeriodRevenue;
    } else if (periodStart === 90 && periodEnd === 180) {
      this.threePastMonthRevenue = lastPeriodRevenue;
    } else {
      this.sixPastMonthRevenue = lastPeriodRevenue;
    }
    return this.getPercentDiff(thisPeriodRevenue, lastPeriodRevenue);
  }

  getPeriodSurplus(period: number): number {
    const thisPeriodOrders = this.getPeriodOrders(period);
    let surplus = this.getPeriodRevenue(period);

    thisPeriodOrders.forEach((order) => {
      order.transactionItems.forEach((item) => {
        surplus -= this.subtractDimensionSize(item.dimension);
      });
      surplus -= this.subtractPlantedTrees(order);
      surplus -= this.subtractShippingCost(order.shippingMethod, order.total);
    });
    switch (period) {
      case 14:
        this.twoWeekSurplus = surplus;
        break;
      case 30:
        this.monthSurplus = surplus;
        break;
      case 90:
        this.threeMonthSurplus = surplus;
        break;
      case 180:
      default:
        this.sixMonthSurplus = surplus;
        break;
    }
    return surplus;
  }

  calculatePeriodSurplusDifference(periodStart: number, periodEnd: number): string {
    const thisPeriodOrders = this.getPeriodOrders(periodStart);
    const lastPeriodOrders = this.getPreviousPeriodOrders(periodStart, periodEnd);
    let thisPeriodSurplus = 0;
    let lastPeriodSurplus = 0;

    thisPeriodOrders.forEach((order) => {
      order.transactionItems.forEach((item) => {
        thisPeriodSurplus -= this.subtractDimensionSize(item.dimension);
      });
      thisPeriodSurplus -= this.subtractPlantedTrees(order);
      thisPeriodSurplus -= this.subtractShippingCost(order.shippingMethod, order.total);
    });
    lastPeriodOrders.forEach((order) => {
      order.transactionItems.forEach((item) => {
        lastPeriodSurplus -= this.subtractDimensionSize(item.dimension);
      });
      lastPeriodSurplus -= this.subtractPlantedTrees(order);
      lastPeriodSurplus -= this.subtractShippingCost(order.shippingMethod, order.total);
    });
    if (periodStart === 14 && periodEnd === 28) {
      this.twoPastWeekSurplus = lastPeriodSurplus;
    } else if (periodStart === 30 && periodEnd === 60) {
      this.monthPastSurplus = lastPeriodSurplus;
    } else if (periodStart === 90 && periodEnd === 180) {
      this.threePastMonthSurplus = lastPeriodSurplus;
    } else {
      this.sixPastMonthSurplus = lastPeriodSurplus;
    }
    return this.getPercentDiff(thisPeriodSurplus, lastPeriodSurplus);
  }

  getPeriodSubscriberCount(period: number): number {
    const subscribers = this.getPeriodNewsletterSignups(period).length;
    switch (period) {
      case 14:
        this.twoWeekSubscribers = subscribers;
        break;
      case 30:
        this.monthSubscribers = subscribers;
        break;
      case 90:
        this.threeMonthSubscribers = subscribers;
        break;
      case 180:
      default:
        this.sixMonthSubscribers = subscribers;
        break;
    }
    return subscribers;
  }

  calculatePeriodSubscriberCountDifference(periodStart: number, periodEnd: number): string {
    const thisPeriodSubscribers = this.getPeriodNewsletterSignups(periodStart).length;
    const lastPeriodSubscribers = this.getPreviousPeriodNewsletterSignups(periodStart, periodEnd).length;

    if (periodStart === 14 && periodEnd === 28) {
      this.twoPastWeekSubscribers = lastPeriodSubscribers;
    } else if (periodStart === 30) {
      this.monthPastSubscribers = lastPeriodSubscribers;
    } else if (periodStart === 90) {
      this.threePastMonthSubscribers = lastPeriodSubscribers;
    } else {
      this.sixPastMonthSubscribers = lastPeriodSubscribers;
    }

    return this.getPercentDiff(thisPeriodSubscribers, lastPeriodSubscribers);
  }
}
