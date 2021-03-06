import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PrivacyNoticeModalComponent } from './privacy-notice-modal.component';

describe('PrivacyNoticeModalComponent', () => {
  let component: PrivacyNoticeModalComponent;
  let fixture: ComponentFixture<PrivacyNoticeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivacyNoticeModalComponent],
      imports: [NgbModule],
      providers: [NgbActiveModal],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyNoticeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
