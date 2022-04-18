import { Component, Input } from '@angular/core';
import { ProductsItem } from '../products-items.constant';

@Component({
  selector: 'webstore-mini-product-display',
  templateUrl: './mini-product-display.component.html',
  styleUrls: ['./mini-product-display.component.scss'],
})
export class MiniProductDisplayComponent {
  @Input()
  product!: ProductsItem;

  @Input()
  isEnglish = false;

  constructor() {}
}
