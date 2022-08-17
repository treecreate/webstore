import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../shared/services/events/events.service';

@Component({
  selector: 'webstore-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css', './payment-success.component.sass'],
})
export class PaymentSuccessComponent implements OnInit {
  constructor(private eventsService: EventsService) {}

  ngOnInit(): void {
    this.eventsService.create('webstore.payment-success');
  }
}
