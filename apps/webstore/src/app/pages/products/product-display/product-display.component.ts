import { Component, Input } from '@angular/core';
import { ProductsItem } from '../productsItems';

@Component({
  selector: 'webstore-product-display',
  templateUrl: './product-display.component.html',
  styleUrls: ['./product-display.component.scss'],
})
export class ProductDisplayComponent {
  @Input()
  product!: ProductsItem;

  @Input()
  isEnglish = false;

  constructor() {}

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
