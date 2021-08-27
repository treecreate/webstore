import { Component, Input, OnInit } from '@angular/core';
import { Design } from '@interfaces';

@Component({
  selector: 'webstore-design-item',
  templateUrl: './design-item.component.html',
  styleUrls: ['./design-item.component.css'],
})
export class DesignItemComponent implements OnInit {
  @Input() design;

  constructor() {}

  ngOnInit(): void {
    console.log('design-item');
  }

  deleteDesign(design: Design) {
    console.log('Delete design: ', design);
  }

  editDesign(design: Design) {
    console.log('Edit design: ', design);
  }

  addDesignToBasket(design: Design) {
    console.log('Add design to basket: ', design);
  }
}
