import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCancelledComponent } from './payment-cancelled.component';

describe('PaymentCancelledComponent', () => {
  let component: PaymentCancelledComponent;
  let fixture: ComponentFixture<PaymentCancelledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentCancelledComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCancelledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
