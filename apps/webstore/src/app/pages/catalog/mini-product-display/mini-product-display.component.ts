import { Component, Input, OnInit } from '@angular/core';
import { CatalogItem } from '../catalogItems';

@Component({
  selector: 'webstore-mini-product-display',
  templateUrl: './mini-product-display.component.html',
  styleUrls: ['./mini-product-display.component.scss'],
})
export class MiniProductDisplayComponent {
  @Input()
  product!: CatalogItem;

  constructor() {}
}
