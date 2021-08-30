import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'webstore-info-popover',
  templateUrl: './info-popover.component.html',
  styleUrls: ['./info-popover.component.css'],
})
export class InfoPopoverComponent implements OnInit {
  @Input() title: string;
  @Input() text: string;

  constructor() {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}
}
