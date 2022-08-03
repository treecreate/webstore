import { Component, Input, OnInit } from '@angular/core';
import { CustomOrderExampleType } from './CustomOrderExampleType';

@Component({
  selector: 'webstore-custom-order-display',
  templateUrl: './custom-order-display.component.html',
  styleUrls: ['./custom-order-display.component.scss'],
})
export class CustomOrderDisplayComponent implements OnInit {
  @Input()
  customOrderExample!: CustomOrderExampleType;

  @Input()
  isEnglish!: boolean;

  constructor() {}

  ngOnInit(): void {}
}
