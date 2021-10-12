import { Component, Input } from '@angular/core';

@Component({
  selector: 'webstore-info-popover',
  templateUrl: './info-popover.component.html',
  styleUrls: ['./info-popover.component.css'],
})
export class InfoPopoverComponent {
  @Input() title: string;
  @Input() text: string;

  constructor() {}
}
