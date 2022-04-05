import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogItem } from '../catalogItems';

import { MiniProductDisplayComponent } from './mini-product-display.component';

describe('MiniProductDisplayComponent', () => {
  const product: CatalogItem = {
    titleEn: 'string',
    titleDk: 'string',
    descriptionEn: 'string',
    descriptionDk: 'string',
    prices: [1, 2, 3],
    imgSrc: 'string',
    specialOffer: 'string',
    routerLink: 'string',
  };
  let component: MiniProductDisplayComponent;
  let fixture: ComponentFixture<MiniProductDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MiniProductDisplayComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniProductDisplayComponent);
    component = fixture.componentInstance;
    component.product = product;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
