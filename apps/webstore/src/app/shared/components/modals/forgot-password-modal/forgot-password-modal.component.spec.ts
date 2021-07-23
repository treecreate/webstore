import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordModalComponent } from './forgot-password-modal.component';

describe('ForgotPasswordModalComponent', () => {
  let component: ForgotPasswordModalComponent;
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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have the title', () => {
    const fixture = TestBed.createComponent(ForgotPasswordModalComponent);
    const forgotPasswordModal = fixture.componentInstance;
    expect(forgotPasswordModal.title).toEqual('ForgotPasswordModal')
  });
});
