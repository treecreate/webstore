import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IEvent } from '@interfaces';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';
import { EventsService } from '../../services/events/events.service';

@Component({
  selector: 'webstore-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css', '../../../assets/styling/table.css'],
})
export class EventsComponent implements OnInit, OnDestroy {
  isLoading = true;
  displayedColumns: string[] = ['name', 'createdAt', 'userId'];
  events!: IEvent[];

  // Chart stuff
  // Pages Viewed
  pagesViewedResults?: { name: string; value: number }[] = undefined;
  pagesViewedDurationOptions = [1, 7, 14, 30, 60, 90, 365];
  pagesViewedDurationStart = 0; // in days
  pagesViewedDurationEnd = this.pagesViewedDurationOptions[3]; // in days
  viewPagesViewed: [number, number] = [1000, 600];
  isLoadingPagesViewedFirstTime = true;
  hidePagesWithLowViews = true;

  colorSchemeRecentUsage: Color = {
    domain: ['#6554a4'],
    name: '',
    selectable: false,
    group: ScaleType.Time,
  };

  // Recent Usage
  recentUsersResults?: [{ name: string; series: { name: string; value: number }[] }] = undefined;
  isLoadingRecentUsageFirstTime = true;
  curveRecentUsage = shape.curveStep;
  viewRecentUsage: [number, number] = [1000, 300];

  colorSchemePagesViewed: Color = {
    domain: ['#6554a4', '#5460a4', '#5490a4', '#54a47d', '#71a454', '#a3a454', '#a45c54'],
    name: '',
    selectable: false,
    group: ScaleType.Time,
  };

  recentUsersDuration = 15; // minutes
  recentUsersAccuracy = 30; // in seconds
  recentUsersRefreshFrequency = 30; // in seconds
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentUsageRefreshInterval: any;

  constructor(private eventsService: EventsService, private snackBar: MatSnackBar) {}

  /**
   * Fetches the events.
   */
  ngOnInit(): void {
    this.recentUsageRefreshInterval = setInterval(() => {
      this.fetchRecentUsers();
    }, 1000 * this.recentUsersRefreshFrequency);
    this.fetchRecentUsers();
    this.fetchPagesViewed();
    this.fetchEvents();
  }

  ngOnDestroy(): void {
    clearInterval(this.recentUsageRefreshInterval);
    this.recentUsageRefreshInterval = null;
  }

  /**
   * Fetches the events from the API.\
   * \
   * Will toggle `isLoading` to `true` while the events are being fetched
   * and revert it to `false` when they have been fetched.\
   */
  fetchEvents(): void {
    this.isLoading = true;
    this.eventsService.get({}).subscribe({
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
      next: (events: IEvent[]) => {
        this.isLoading = false;
        this.events = events;
      },
    });
  }

  /**
   * Get and process the data on recent usage of the webstore.\
   * The data is processed to work with the line chart.
   */
  fetchRecentUsers(): void {
    this.eventsService.getRecentUsers(this.recentUsersDuration, this.recentUsersAccuracy).subscribe({
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
      next: (usage) => {
        // Process the data to work with the chart
        const renamedData: { name: string; value: number }[] = [];

        // init the date objects
        const dateA = new Date();
        const dateB = new Date();
        dateB.setSeconds(dateB.getSeconds() - this.recentUsersAccuracy);
        let usageCounter = 0;

        // Iterate over the data and create a breakdown of usage per X seconds
        for (let i = 0; i < (this.recentUsersDuration * 60) / this.recentUsersAccuracy; i++) {
          usage.forEach((entry) => {
            const usageDate = new Date(entry.createdAt);
            if (dateA >= usageDate && usageDate >= dateB) {
              usageCounter += entry.count;
            }
          });
          dateA.setSeconds(dateA.getSeconds() - this.recentUsersAccuracy);
          dateB.setSeconds(dateB.getSeconds() - this.recentUsersAccuracy);
          renamedData.push({
            name: `${dateA.getHours()}:${dateA.getMinutes()}:${dateA.getSeconds()}`,
            value: usageCounter,
          });
          usageCounter = 0;
        }
        this.recentUsersResults = [{ name: 'Active users', series: renamedData.reverse() }];
        // Wait for a bit so the chart has time to process the new data
        // The actual timeout duration doesn't match the actual execution time, probably due to how javascript task scheduling works. Still, the chart doesn't appear in the broken state os it's okay
        setTimeout(() => {
          this.isLoadingRecentUsageFirstTime = false;
        }, 1000);
      },
    });
  }

  /**
   * Get and process the data about what pages are being visited.
   */
  fetchPagesViewed(): void {
    this.eventsService.getPagesViewed(this.pagesViewedDurationStart, this.pagesViewedDurationEnd).subscribe({
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
      next: (views) => {
        // eslint-disable-next-line no-useless-escape
        const hostnameRegex = /.*\/\/[a-z:\d\.]*\//gm;
        const designIdRegex = /\?designId.*/gm;
        let renamedData: { name: string; value: number }[] = [];
        views.forEach((view) => {
          if (this.hidePagesWithLowViews) {
            if (view.count <= 5) {
              return;
            }
          }
          let trimmedName = view.url.replace(hostnameRegex, '');
          // eslint-disable-next-line no-useless-escape
          trimmedName = trimmedName.replace(designIdRegex, '');
          if (trimmedName.includes('resetPassword')) {
            trimmedName = 'resetPassword';
          }
          if (trimmedName.includes('unsubscribe')) {
            trimmedName = 'newsletter/unsubscribe';
          }
          // Rename index page to home page
          if (trimmedName === '') {
            trimmedName = 'home';
          }
          renamedData.push({ name: trimmedName, value: view.count });
        });
        // Sort the data
        renamedData = renamedData.sort((a, b) => b.value - a.value);
        this.pagesViewedResults = renamedData;
        setTimeout(() => {
          this.isLoadingPagesViewedFirstTime = false;
        }, 1000);
      },
    });
  }
}
