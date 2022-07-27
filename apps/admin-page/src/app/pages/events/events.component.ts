import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IEvent } from '@interfaces';
import { EventsService } from '../../services/events/events.service';

@Component({
  selector: 'webstore-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css', '../../../assets/styling/table.css'],
})
export class EventsComponent implements OnInit {
  isLoading = true;
  displayedColumns: string[] = ['name', 'updatedAt', 'userId'];
  events!: IEvent[];

  constructor(private eventsService: EventsService, private snackBar: MatSnackBar) {}

  /**
   * Fetches the events.
   */
  ngOnInit(): void {
    this.fetchEvents();
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
}
