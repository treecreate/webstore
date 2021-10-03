import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DesignDimensionEnum } from '@interfaces';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddToBasketModalComponent } from './add-to-basket-modal.component';

describe('AddToBasketModalComponent', () => {
  let component: AddToBasketModalComponent;
  let fixture: ComponentFixture<AddToBasketModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddToBasketModalComponent],
      imports: [
        NgbModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
      ],
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
    expect(component.addToBasketForm.get('dimension').value).toEqual(
      DesignDimensionEnum.small
    );
    const increaseSize = fixture.debugElement.query(
      By.css('#increase-size-btn')
    );
    const increaseSizeButton = increaseSize.nativeElement;
    increaseSizeButton.click();
    expect(component.addToBasketForm.get('dimension').value).toEqual(
      DesignDimensionEnum.medium
    );
    increaseSizeButton.click();
    expect(component.addToBasketForm.get('dimension').value).toEqual(
      DesignDimensionEnum.large
    );
    increaseSizeButton.click();
    expect(component.addToBasketForm.get('dimension').value).toEqual(
      DesignDimensionEnum.large
    );
  });

  it('should decrease the size', () => {
    component.addToBasketForm.setValue({
      dimension: DesignDimensionEnum.large,
      quantity: 1,
      title: '',
    });
    expect(component.addToBasketForm.get('dimension').value).toEqual(
      DesignDimensionEnum.large
    );
    const decreaseSize = fixture.debugElement.query(
      By.css('#decrease-size-btn')
    );
    const decreaseSizeButton = decreaseSize.nativeElement;
    decreaseSizeButton.click();
    expect(component.addToBasketForm.get('dimension').value).toEqual(
      DesignDimensionEnum.medium
    );
    decreaseSizeButton.click();
    expect(component.addToBasketForm.get('dimension').value).toEqual(
      DesignDimensionEnum.small
    );
    decreaseSizeButton.click();
    expect(component.addToBasketForm.get('dimension').value).toEqual(
      DesignDimensionEnum.small
    );
  });

  it('should increase quantity', () => {
    expect(component.addToBasketForm.get('quantity').value).toEqual(1);
    const increaseQuantity = fixture.debugElement.query(
      By.css('#increase-quantity-btn')
    );
    const increaseQuantityButton = increaseQuantity.nativeElement;
    increaseQuantityButton.click();
    expect(component.addToBasketForm.get('quantity').value).toEqual(2);
    increaseQuantityButton.click();
    expect(component.addToBasketForm.get('quantity').value).toEqual(3);
    increaseQuantityButton.click();
    expect(component.addToBasketForm.get('quantity').value).toEqual(4);
  });

  it('should decrease quantity', () => {
    component.addToBasketForm.setValue({
      dimension: DesignDimensionEnum.small,
      quantity: 3,
      title: '',
    });
    expect(component.addToBasketForm.get('quantity').value).toEqual(3);
    const decreaseQuantity = fixture.debugElement.query(
      By.css('#decrease-quantity-btn')
    );
    const decreaseQuantityButton = decreaseQuantity.nativeElement;
    decreaseQuantityButton.click();
    expect(component.addToBasketForm.get('quantity').value).toEqual(2);
    decreaseQuantityButton.click();
    expect(component.addToBasketForm.get('quantity').value).toEqual(1);
    decreaseQuantityButton.click();
    expect(component.addToBasketForm.get('quantity').value).toEqual(1);
  });
});
