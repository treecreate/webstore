import { Component, Input, OnInit } from '@angular/core';
import { IDesign } from '@interfaces';

@Component({
  selector: 'webstore-design-item',
  templateUrl: './design-item.component.html',
  styleUrls: ['./design-item.component.css'],
})
export class DesignItemComponent implements OnInit {
  @Input() design;

  constructor() {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  deleteDesign(design: IDesign) {
    console.log('Delete design: ', design);
  }

  editDesign(design: IDesign) {
    console.log('Edit design: ', design);
  }

  addDesignToBasket(design: IDesign) {
    console.log('Add design to basket: ', design);
  }
}
