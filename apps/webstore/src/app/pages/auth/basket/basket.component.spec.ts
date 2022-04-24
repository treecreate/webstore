import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { BasketItemComponent } from '../../../shared/components/items/basket-item/basket-item.component';
import { BasketComponent } from './basket.component';

describe('BasketComponent', () => {
  let component: BasketComponent;
  let fixture: ComponentFixture<BasketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [BasketComponent, BasketItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketComponent);
    component = fixture.componentInstance;

    component.plantedTrees = 1;
    component.priceInfo = {
      fullPrice: 1000,
      discountedPrice: 900,
      finalPrice: 900,
      discountAmount: 100,
      deliveryPrice: 0,
      extraTreesPrice: 0,
      vat: 900 * 0.2,
    };
    console.log(component.plantedTrees);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increase planted trees quantity', () => {
    expect(component.plantedTrees).toEqual(1);
    const increaseButton = fixture.debugElement.query(By.css('#planted-extra-trees-btn'));
    const increaseButtonElement = increaseButton.nativeElement;
    increaseButtonElement.click();
    expect(component.plantedTrees).toEqual(2);
    increaseButtonElement.click();
    expect(component.plantedTrees).toEqual(3);
    increaseButtonElement.click();
    expect(component.plantedTrees).toEqual(4);
  });

  it('should decrease planted trees quantity', () => {
    const decreaseButton = fixture.debugElement.query(By.css('#planted-less-trees-btn'));
    const decreaseButtonElement = decreaseButton.nativeElement;
    component.plantedTrees = 3;
    fixture.detectChanges();

    expect(component.plantedTrees).toEqual(3);
    decreaseButtonElement.click();
    expect(component.plantedTrees).toEqual(2);
    decreaseButtonElement.click();
    expect(component.plantedTrees).toEqual(1);
    decreaseButtonElement.click();
    expect(component.plantedTrees).toEqual(1);
  });
});
