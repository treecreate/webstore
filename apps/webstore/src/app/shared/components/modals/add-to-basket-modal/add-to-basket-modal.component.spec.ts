import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AddToBasketModalComponent } from './add-to-basket-modal.component';

describe('AddToBasketModalComponent', () => {
  let component: AddToBasketModalComponent;
  let fixture: ComponentFixture<AddToBasketModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddToBasketModalComponent],
      imports: [NgbModule, RouterTestingModule],
      providers: [NgbActiveModal],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToBasketModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increase the size', () => {
    expect(component.addToBasketForm.get('size').value).toEqual('20cm x 20cm');
    const increaseSize = fixture.debugElement.query(
      By.css('#increase-size-btn')
    );
    const increaseSizeButton = increaseSize.nativeElement;
    increaseSizeButton.click();
    expect(component.addToBasketForm.get('size').value).toEqual('25cm x 25cm');
    increaseSizeButton.click();
    expect(component.addToBasketForm.get('size').value).toEqual('30cm x 30cm');
    increaseSizeButton.click();
    expect(component.addToBasketForm.get('size').value).toEqual('30cm x 30cm');
  });

  it('should decrease the size', () => {
    component.addToBasketForm.setValue({
      size: '30cm x 30cm',
      amount: 1,
      title: '',
    });
    expect(component.addToBasketForm.get('size').value).toEqual('30cm x 30cm');
    const decreaseSize = fixture.debugElement.query(
      By.css('#decrease-size-btn')
    );
    const decreaseSizeButton = decreaseSize.nativeElement;
    decreaseSizeButton.click();
    expect(component.addToBasketForm.get('size').value).toEqual('25cm x 25cm');
    decreaseSizeButton.click();
    expect(component.addToBasketForm.get('size').value).toEqual('20cm x 20cm');
    decreaseSizeButton.click();
    expect(component.addToBasketForm.get('size').value).toEqual('20cm x 20cm');
  });

  it('should increase amount', () => {
    expect(component.addToBasketForm.get('amount').value).toEqual(1);
    const increaseAmount = fixture.debugElement.query(
      By.css('#increase-amount-btn')
    );
    const increaseAmountButton = increaseAmount.nativeElement;
    increaseAmountButton.click();
    expect(component.addToBasketForm.get('amount').value).toEqual(2);
    increaseAmountButton.click();
    expect(component.addToBasketForm.get('amount').value).toEqual(3);
    increaseAmountButton.click();
    expect(component.addToBasketForm.get('amount').value).toEqual(4);
  });

  it('should decrease amount', () => {
    component.addToBasketForm.setValue({
      size: '20cm x 20cm',
      amount: 3,
      title: '',
    });
    expect(component.addToBasketForm.get('amount').value).toEqual(3);
    const decreaseAmount = fixture.debugElement.query(
      By.css('#decrease-amount-btn')
    );
    const decreaseAmountButton = decreaseAmount.nativeElement;
    decreaseAmountButton.click();
    expect(component.addToBasketForm.get('amount').value).toEqual(2);
    decreaseAmountButton.click();
    expect(component.addToBasketForm.get('amount').value).toEqual(1);
    decreaseAmountButton.click();
    expect(component.addToBasketForm.get('amount').value).toEqual(1);
  });
});
