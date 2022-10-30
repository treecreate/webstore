import { Component } from '@angular/core';
import { EventsService } from '../../../shared/services/events/events.service';

@Component({
  selector: 'webstore-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent {
  constructor(public eventsService: EventsService) {}
}
