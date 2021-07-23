import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordModalComponent } from './forgot-password-modal.component';

describe('ForgotPasswordModalComponent', () => {
  let fixture: ComponentFixture<ForgotPasswordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordModalComponent],
      imports: [NgbModule, RouterTestingModule],
      providers: [NgbActiveModal],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordModalComponent);
    fixture.detectChanges();
  });

  it('should have the title', () => {
    fixture = TestBed.createComponent(ForgotPasswordModalComponent);
    const forgotPasswordModal = fixture.componentInstance;
    expect(forgotPasswordModal.title).toEqual('ForgotPasswordModal');
  });
});
