import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyNoticeModalComponent } from './privacy-notice-modal.component';

describe('PrivacyNoticeModalComponent', () => {
  let component: PrivacyNoticeModalComponent;
  let fixture: ComponentFixture<PrivacyNoticeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivacyNoticeModalComponent],
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
