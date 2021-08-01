import { Component, Input, OnInit, Output } from '@angular/core';
import { Design } from '@interfaces';

@Component({
  selector: 'webstore-design-item',
  templateUrl: './design-item.component.html',
  styleUrls: ['./design-item.component.css'],
})
export class DesignItemComponent implements OnInit {
  @Input() design: any;

  constructor() {}

  ngOnInit(): void {}

  deleteDesign(design: Design) {}

  editDesign(design: Design) {}

  addDesignToBasket(design: Design) {}
}
