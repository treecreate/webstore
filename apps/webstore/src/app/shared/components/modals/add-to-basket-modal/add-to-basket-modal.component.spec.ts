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
      imports: [NgbModule, RouterTestingModule, FormsModule, ReactiveFormsModule, HttpClientModule],
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

  it('should increase and decrease the Dimension', () => {
    component.addToBasketForm.setValue({
      dimension: DesignDimensionEnum.small,
      quantity: 1,
    });
    expect(component.addToBasketForm.get('dimension').value).toEqual(DesignDimensionEnum.small);
    const increaseDimension = fixture.debugElement.query(By.css('#increase-dimension-btn'));
    const decreaseDimension = fixture.debugElement.query(By.css('#decrease-dimension-btn'));
    const increaseDimensionButton = increaseDimension.nativeElement;
    const decreaseDimensionButton = decreaseDimension.nativeElement;

    component.increaseDimension();
    expect(component.addToBasketForm.get('dimension').value).toEqual(DesignDimensionEnum.medium);
    component.increaseDimension();
    expect(component.addToBasketForm.get('dimension').value).toEqual(DesignDimensionEnum.large);
    fixture.detectChanges();
    expect(increaseDimensionButton.disabled).toBeTruthy();
    expect(component.addToBasketForm.get('dimension').value).toEqual(DesignDimensionEnum.large);
    component.decreaseDimension();
    expect(component.addToBasketForm.get('dimension').value).toEqual(DesignDimensionEnum.medium);
    component.decreaseDimension();
    expect(component.addToBasketForm.get('dimension').value).toEqual(DesignDimensionEnum.small);
    fixture.detectChanges();
    expect(increaseDimensionButton.disabled).toBeFalsy();
    fixture.detectChanges();
    expect(decreaseDimensionButton.disabled).toBeTruthy();
  });

  it('should increase quantity', () => {
    expect(component.addToBasketForm.get('quantity').value).toEqual(1);
    component.increaseQuantity();
    expect(component.addToBasketForm.get('quantity').value).toEqual(2);
    component.increaseQuantity();
    expect(component.addToBasketForm.get('quantity').value).toEqual(3);
  });

  it('should decrease quantity', () => {
    component.addToBasketForm.setValue({
      dimension: DesignDimensionEnum.small,
      quantity: 3,
    });
    expect(component.addToBasketForm.get('quantity').value).toEqual(3);
    component.decreaseQuantity();
    expect(component.addToBasketForm.get('quantity').value).toEqual(2);
    component.decreaseQuantity();
    expect(component.addToBasketForm.get('quantity').value).toEqual(1);
    const decreaseQuantity = fixture.debugElement.query(By.css('#decrease-quantity-btn'));
    const decreaseQuantityButton = decreaseQuantity.nativeElement;
    fixture.detectChanges();
    expect(decreaseQuantityButton.disabled).toBeTruthy();
  });
});
