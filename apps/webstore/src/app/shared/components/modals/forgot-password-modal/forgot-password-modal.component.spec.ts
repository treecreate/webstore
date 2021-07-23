import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordModalComponent } from './forgot-password-modal.component';

describe('ForgotPasswordModalComponent', () => {
  let component: ForgotPasswordModalComponent;
  let fixture: ComponentFixture<ForgotPasswordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
