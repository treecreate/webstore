import { Component, Input } from '@angular/core';
import { CustomOrderExampleType } from './CustomOrderExampleType';

@Component({
  selector: 'webstore-custom-order-display',
  templateUrl: './custom-order-display.component.html',
  styleUrls: ['./custom-order-display.component.scss'],
})
export class CustomOrderDisplayComponent {
  @Input()
  customOrderExample!: CustomOrderExampleType;

  @Input()
  isEnglish!: boolean;

  constructor() {}
}
