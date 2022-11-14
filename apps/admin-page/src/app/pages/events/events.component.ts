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
  isLoadingRecentUsageFirstTime = true;
  view: [number, number] = [1000, 300];
  recentUsersResults?: [{ name: string; series: { name: string; value: number }[] }] = undefined;
  curve = shape.curveStep;

  colorScheme: Color = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
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
    this.fetchEvents();

    this.recentUsageRefreshInterval = setInterval(() => {
      this.fetchRecentUsers();
    }, 1000 * this.recentUsersRefreshFrequency);
    this.fetchRecentUsers();
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
          console.log('done');
          this.isLoadingRecentUsageFirstTime = false;
        }, 1000);
      },
    });
  }
}
