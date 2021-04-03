import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TermsOfSaleModalComponent } from './terms-of-sale-modal.component';

describe('TermsOfSaleModalComponent', () => {
  let component: TermsOfSaleModalComponent;
  let fixture: ComponentFixture<TermsOfSaleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TermsOfSaleModalComponent],
      providers: [NgbActiveModal, NgbModal],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsOfSaleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should have title 'termsOfSaleModal'", () => {
    const fixture = TestBed.createComponent(TermsOfSaleModalComponent);
    const termsOdSaleModal = fixture.componentInstance;
    expect(termsOdSaleModal.title).toEqual('termsOfSaleModal');
  });
});
