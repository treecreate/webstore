import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TermsOfUseModalComponent } from './terms-of-use-modal.component';

describe('TermsOfUseModalComponent', () => {
  let component: TermsOfUseModalComponent;
  let fixture: ComponentFixture<TermsOfUseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TermsOfUseModalComponent],
      providers: [NgbModal, NgbActiveModal],
      imports: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsOfUseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`should have as title 'termsOfServiceModal'`, () => {
    const fixture = TestBed.createComponent(TermsOfUseModalComponent);
    const termsModal = fixture.componentInstance;
    expect(termsModal.title).toEqual('termsOfServiceModal');
  });
});
