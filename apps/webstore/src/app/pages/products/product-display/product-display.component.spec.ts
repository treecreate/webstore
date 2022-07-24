import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsItem } from '../products-items.constant';

import { ProductDisplayComponent } from './product-display.component';

describe('ProductDisplayComponent', () => {
  const product: ProductsItem = {
    titleEn: 'string',
    titleDk: 'string',
    descriptionEn: 'string',
    descriptionDk: 'string',
    prices: [1, 2, 3],
    imgSrc: 'string',
    altText: 'string',
    specialOffer: 'string',
    routerLink: 'string',
  };
  let component: ProductDisplayComponent;
  let fixture: ComponentFixture<ProductDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductDisplayComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDisplayComponent);
    component = fixture.componentInstance;
    component.product = product;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
