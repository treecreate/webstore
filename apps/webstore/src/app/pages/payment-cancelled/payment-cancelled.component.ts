import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../shared/services/events/events.service';

@Component({
  selector: 'webstore-payment-cancelled',
  templateUrl: './payment-cancelled.component.html',
  styleUrls: ['./payment-cancelled.component.css'],
})
export class PaymentCancelledComponent implements OnInit {
  constructor(public eventsService: EventsService) {}

  ngOnInit(): void {
    this.eventsService.create('webstore.payment-cancelled');
  }
}
