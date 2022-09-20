import { Component, Input } from '@angular/core';

@Component({
  selector: 'webstore-input-error-messages',
  templateUrl: './input-error-messages.component.html',
  styleUrls: ['./input-error-messages.component.scss']
})
export class InputErrorMessagesComponent {

  @Input() input! : string;
  @Input() min?: number = 3;
  @Input() max?: number = 50;
  @Input() wrongChar?: boolean;

  constructor() { }

  
}
