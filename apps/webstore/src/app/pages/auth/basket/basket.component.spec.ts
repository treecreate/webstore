import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BasketItemComponent } from '../../../shared/components/items/basket-item/basket-item.component';

import { BasketComponent } from './basket.component';

describe('BasketComponent', () => {
  let component: BasketComponent;
  let fixture: ComponentFixture<BasketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasketComponent, BasketItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketComponent);
    component = fixture.componentInstance;

    component.donatedTrees = 1;
    console.log(component.donatedTrees);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increase donated trees amount', () => {
    expect(component.donatedTrees).toEqual(1);
    const increseButton = fixture.debugElement.query(
      By.css('#donate-extra-trees-btn')
    );
    const increaseButtonElement = increseButton.nativeElement;
    increaseButtonElement.click();
    expect(component.donatedTrees).toEqual(2);
    increaseButtonElement.click();
    expect(component.donatedTrees).toEqual(3);
    increaseButtonElement.click();
    expect(component.donatedTrees).toEqual(4);
  });

  it('should increase donated trees amount', () => {
    const increseButton = fixture.debugElement.query(
      By.css('#donate-less-trees-btn')
    );
    const increaseButtonElement = increseButton.nativeElement;
    component.donatedTrees = 3;

    expect(component.donatedTrees).toEqual(3);
    increaseButtonElement.click();
    expect(component.donatedTrees).toEqual(2);
    increaseButtonElement.click();
    expect(component.donatedTrees).toEqual(1);
    increaseButtonElement.click();
    expect(component.donatedTrees).toEqual(1);
  });
});
