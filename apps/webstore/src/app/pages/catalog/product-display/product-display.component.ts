import { Component, Input, OnInit } from '@angular/core';
import { CatalogItem } from '../catalogItems';

@Component({
  selector: 'webstore-product-display',
  templateUrl: './product-display.component.html',
  styleUrls: ['./product-display.component.scss'],
})
export class ProductDisplayComponent {
  @Input()
  product!: CatalogItem;

  constructor() {}
}
