import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router) {}

  navigateToProduct() {
    if (this.product.productType) {
      this.router.navigate([this.product.routerLink], { queryParams: { productType: this.product.productType } });
    } else {
      this.router.navigate([this.product.routerLink]);
    }

    this.scrollTop();
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }
}
