import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IOrder } from '@interfaces';
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

  ngOnInit(): void {
    console.log(this.getWeekOrderTotal());
  }

  fetchAllData() {
    this.getSixMonthOrders(this.today);
  }

  //TODO: Implement this logic so that it can be called in methods to provide a date
  // Will give a date in the past, which can then be compared to todays date
  // For the purpose of filtering orders
  getDateDiff(days: number) {
    const previousDate = new Date(this.today);
    previousDate.setDate(previousDate.getDate() - days);
    return previousDate;
  }

  //TODO:
  // Methods for weekly data
  getWeekOrderTotal() {
    let currentPeriodCount = 0;
    let previousPeriodCount = 0;
    this.ordersService.getOrders().subscribe({
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
      next: (orders: IOrder[]) => {
        orders.forEach((order) => {
          if (order.createdAt >= this.getDateDiff(7)) {
            console.log('skrrr');
            currentPeriodCount++;
          } else if (order.createdAt < this.getDateDiff(7) && order.createdAt >= this.getDateDiff(14)) {
            previousPeriodCount++;
          }
        });
      },
    });
    return currentPeriodCount;
  }

  //TODO: Implement the logic
  calculateWeekOrderDifference() {}

  //TODO: Implement the logic
  getWeekRevenue() {}

  //TODO: Implement the logic
  calculateWeekRevenueDifference() {}

  //TODO: Implement the logic
  // Surplus = Order Revenue - Full production price (115kr - Mini | 135kr - Small | 161kr - Med | 205kr - Large)
  getWeekSurplus() {}

  //TODO: Implement the logic
  // Surplus = Order Revenue - Full production price (115kr - Mini | 135kr - Small | 161kr - Med | 205kr - Large)
  calculateWeekSurplusDifference() {}

  //TODO: Implement the logic
  getWeekSubscribers() {}

  //TODO: Implement the logic
  calculateWeekSubscriberDifference() {}

  //TODO: Implement the logic
  // Methods for monthly data
  getMonthOrders(today: Date): number {
    let count = 0;
    const todaysDate = new Date(today);
    todaysDate.setDate(today.getDate() - 30);
    this.ordersService.getOrders().forEach((order) => {
      order.forEach((single) => {
        if (single.createdAt <= todaysDate) {
          count++;
        }
      });
    });
    return count;
  }

  //TODO: Implement the logic
  calculateMonthOrderDifference() {}

  //TODO: Implement the logic
  getMonthRevenue() {}

  //TODO: Implement the logic
  calculateMonthRevenueDifference() {}

  //TODO: Implement the logic
  // Surplus = Order Revenue - Full production price (115kr - Mini | 135kr - Small | 161kr - Med | 205kr - Large)
  getMonthSurplus() {}

  //TODO: Implement the logic
  // Surplus = Order Revenue - Full production price (115kr - Mini | 135kr - Small | 161kr - Med | 205kr - Large)
  calculateMonthSurplusDifference() {}

  //TODO: Implement the logic
  getMonthSubscribers() {}

  //TODO: Implement the logic
  calculateMonthSubscriberDifference() {}

  //TODO: Implement the logic
  // Methods for 3 month data
  getThreeMonthOrders(today: Date): number {
    let count = 0;
    const todaysDate = new Date(today);
    todaysDate.setDate(today.getDate() - 90);
    this.ordersService.getOrders().forEach((order) => {
      order.forEach((single) => {
        if (single.createdAt <= todaysDate) {
          count++;
        }
      });
    });
    return count;
  }

  //TODO: Implement the logic
  calculateThreeMonthOrderDifference() {}

  //TODO: Implement the logic
  getThreeMonthRevenue() {}

  //TODO: Implement the logic
  calculateThreeMonthRevenueDifference() {}

  //TODO: Implement the logic
  // Surplus = Order Revenue - Full production price (115kr - Mini | 135kr - Small | 161kr - Med | 205kr - Large)
  getThreeMonthSurplus() {}

  //TODO: Implement the logic
  // Surplus = Order Revenue - Full production price (115kr - Mini | 135kr - Small | 161kr - Med | 205kr - Large)
  calculateThreeMonthSurplusDifference() {}

  //TODO: Implement the logic
  getThreeMonthSubscribers() {}

  //TODO: Implement the logic
  calculateThreeMonthSubscriberDifference() {}

  //TODO: Implement the logic
  // Methods for 6 month data
  getSixMonthOrders(today: Date): number {
    let count = 0;
    const todaysDate = new Date(today);
    console.log(todaysDate);
    todaysDate.setDate(today.getDate() - 180);
    console.log(todaysDate);
    this.ordersService.getOrders().subscribe({
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
      next: (orders: IOrder[]) => {
        console.log(orders);

        orders.forEach((order) => {
          if (order.createdAt.getDate() - todaysDate.getDate() >= todaysDate.getDate() - 180) {
            count++;
          }
        });
      },
    });
    //alert(count);
    return count;
  }

  //TODO: Implement the logic
  calculateSixMonthOrderDifference() {}

  //TODO: Implement the logic
  getSixMonthRevenue() {}

  //TODO: Implement the logic
  calculateSixMonthRevenueDifference() {}

  //TODO: Implement the logic
  // Surplus = Order Revenue - Full production price (115kr - Mini | 135kr - Small | 161kr - Med | 205kr - Large)
  getSixMonthSurplus() {}

  //TODO: Implement the logic
  // Surplus = Order Revenue - Full production price (115kr - Mini | 135kr - Small | 161kr - Med | 205kr - Large)
  calculateSixMonthSurplusDifference() {}

  //TODO: Implement the logic
  getSixMonthSubscribers() {}

  //TODO: Implement the logic
  calculateSixMonthSubscriberDifference() {}
}
