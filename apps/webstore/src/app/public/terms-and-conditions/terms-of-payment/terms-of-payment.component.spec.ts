import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsOfPaymentComponent } from './terms-of-payment.component';

describe('TermsOfPaymentComponent', () => {
  let component: TermsOfPaymentComponent;
  let fixture: ComponentFixture<TermsOfPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TermsOfPaymentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsOfPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
