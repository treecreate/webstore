import { ComponentFixture, TestBed } from '@angular/core/testing';
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
      size: '20cm x 20cm',
      amount: 1,
    };

    component.item = item;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increse the size', () => {
    expect(component.item.size).toEqual('20cm x 20cm');
    component.increaseSize();
    expect(component.item.size).toEqual('25cm x 25cm');
    component.increaseSize();
    expect(component.item.size).toEqual('30cm x 30cm');
    component.increaseSize();
    expect(component.item.size).toEqual('30cm x 30cm');
  });

  it('should decrease the size', () => {
    component.item.size = '30cm x 30cm';
    expect(component.item.size).toEqual('30cm x 30cm');
    component.decreaseSize();
    expect(component.item.size).toEqual('25cm x 25cm');
    component.decreaseSize();
    expect(component.item.size).toEqual('20cm x 20cm');
    component.decreaseSize();
    expect(component.item.size).toEqual('20cm x 20cm');
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
