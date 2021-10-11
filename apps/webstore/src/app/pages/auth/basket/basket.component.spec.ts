import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BasketItemComponent } from '../../../shared/components/items/family-tree-basket-item/family-tree-basket-item.component';
import { BasketComponent } from './basket.component';

describe('BasketComponent', () => {
  let component: BasketComponent;
  let fixture: ComponentFixture<BasketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [BasketComponent, BasketItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketComponent);
    component = fixture.componentInstance;

    component.donatedTrees = 1;
    component.priceInfo = {
      fullPrice: 1000,
      discountedPrice: 900,
      finalPrice: 900,
      discountAmount: 100,
      deliveryPrice: 0,
      extraTreesPrice: 0,
      vat: 900 * 0.2,
    };
    console.log(component.donatedTrees);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increase donated trees quantity', () => {
    expect(component.donatedTrees).toEqual(1);
    const increaseButton = fixture.debugElement.query(
      By.css('#donate-extra-trees-btn')
    );
    const increaseButtonElement = increaseButton.nativeElement;
    increaseButtonElement.click();
    expect(component.donatedTrees).toEqual(2);
    increaseButtonElement.click();
    expect(component.donatedTrees).toEqual(3);
    increaseButtonElement.click();
    expect(component.donatedTrees).toEqual(4);
  });

  it('should decrease donated trees quantity', () => {
    const decreaseButton = fixture.debugElement.query(
      By.css('#donate-less-trees-btn')
    );
    const decreaseButtonElement = decreaseButton.nativeElement;
    component.donatedTrees = 3;
    fixture.detectChanges();

    expect(component.donatedTrees).toEqual(3);
    decreaseButtonElement.click();
    expect(component.donatedTrees).toEqual(2);
    decreaseButtonElement.click();
    expect(component.donatedTrees).toEqual(1);
    decreaseButtonElement.click();
    expect(component.donatedTrees).toEqual(1);
  });
});
