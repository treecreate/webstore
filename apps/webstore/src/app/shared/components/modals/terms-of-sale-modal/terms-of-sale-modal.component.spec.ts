import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsOfSaleModalComponent } from './terms-of-sale-modal.component';

describe('TermsOfSaleModalComponent', () => {
  let component: TermsOfSaleModalComponent;
  let fixture: ComponentFixture<TermsOfSaleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TermsOfSaleModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsOfSaleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
