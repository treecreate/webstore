import { Component, Input } from '@angular/core';
import { ProductsItem } from '../../../../pages/products/products-items.constant';

@Component({
  selector: 'webstore-product-display',
  templateUrl: './product-display.component.html',
  styleUrls: ['./product-display.component.scss'],
})
export class ProductDisplayComponent {
  @Input()
  product!: ProductsItem;

  @Input()
  isEnglish!: boolean;

  constructor() {}

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
