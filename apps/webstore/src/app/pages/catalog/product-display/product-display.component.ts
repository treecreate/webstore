import { Component, Input } from '@angular/core';
import { CatalogItem } from '../catalogItems';

@Component({
  selector: 'webstore-product-display',
  templateUrl: './product-display.component.html',
  styleUrls: ['./product-display.component.scss'],
})
export class ProductDisplayComponent {
  @Input()
  product!: CatalogItem;

  @Input()
  isEnglish: boolean = false;

  constructor() {}

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
