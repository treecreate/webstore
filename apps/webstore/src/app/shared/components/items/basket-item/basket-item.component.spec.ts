import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CalculatePriceService } from '../../../services/calculate-price/calculate-price.service';

import { BasketItemComponent } from './basket-item.component';

describe('BasketItemComponent', () => {
  let component: BasketItemComponent;
  let fixture: ComponentFixture<BasketItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasketItemComponent],
      //   imports: [CalculatePriceService]
    }); // .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketItemComponent);
    component = fixture.componentInstance;

    //mock the basketItem
    const item = {
      designId: '1',
      userId: '1',
      title: 'first design',
      size: 'small',
      amount: 1,
    };

    component.item = item;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increse the size', () => {
    expect(component.item.size).toEqual('small');
    component.increaseSize();
    expect(component.item.size).toEqual('medium');
    component.increaseSize();
    expect(component.item.size).toEqual('large');
    component.increaseSize();
    expect(component.item.size).toEqual('large');
  });

  it('should decrease the size', () => {
    component.item.size = 'large';
    expect(component.item.size).toEqual('large');
    component.decreaseSize();
    expect(component.item.size).toEqual('medium');
    component.decreaseSize();
    expect(component.item.size).toEqual('small');
    component.decreaseSize();
    expect(component.item.size).toEqual('small');
  });

  it('should increase amount', () => {
    expect(component.item.amount).toEqual(1);
    component.increaseAmount();
    expect(component.item.amount).toEqual(2);
    component.increaseAmount();
    expect(component.item.amount).toEqual(3);
    component.increaseAmount();
  });

  it('should decrease amount', () => {
    component.item.amount = 3;
    expect(component.item.amount).toEqual(3);
    component.decreaseAmount();
    expect(component.item.amount).toEqual(2);
    component.decreaseAmount();
    expect(component.item.amount).toEqual(1);
    component.decreaseAmount();
    expect(component.item.amount).toEqual(1);
  });
});
