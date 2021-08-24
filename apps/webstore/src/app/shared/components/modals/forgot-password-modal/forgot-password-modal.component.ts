import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../toast/toast-service';

@Component({
  selector: 'webstore-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: [
    './forgot-password-modal.component.css',
    '../../../../../assets/styles/modals.css',
    '../../../../../assets/styles/tc-input-field.scss',
  ],
})
export class ForgotPasswordModalComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  @ViewChild('messageSent') messageSent: ElementRef;
  title = 'ForgotPasswordModal';

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
    });
  }

  sendResetPasswordEmail(email: string) {
    console.log(email);
    // TODO: send the reset password email (possibly check if the email exists)
  }

  resetPassword() {
    this.sendResetPasswordEmail(this.forgotPasswordForm.get('email').value);
    this.activeModal.close();
    this.toastService.showAlert(
      'We have sent you an e-mail with a link to change your password.',
      'Vi har sendt dig en e-mail med et link til at ændre din kode.',
      'success',
      3500
    );
  }

  isDisabled(): boolean {
    return this.forgotPasswordForm.get('email').invalid;
  }
}
