import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PrivacyNoticeModalComponent } from './privacy-notice-modal.component';

describe('PrivacyNoticeModalComponent', () => {
  let component: PrivacyNoticeModalComponent;
  let fixture: ComponentFixture<PrivacyNoticeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivacyNoticeModalComponent],
      providers: [NgbModal, NgbActiveModal],
      imports: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyNoticeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`should have as title 'privacyNoticeModal'`, () => {
    const fixture = TestBed.createComponent(PrivacyNoticeModalComponent);
    const privacyModal = fixture.componentInstance;
    expect(privacyModal.title).toEqual('privacyNoticeModal');
  });
});
