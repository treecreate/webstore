import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
    });
  }

  resetPassword() {
    console.log(this.forgotPasswordForm.get('email').value);
    this.activeModal.close();
  }

  isDisabled(): boolean {
    if (this.forgotPasswordForm.get('email').invalid) {
      return true;
    } else {
      return false;
    }
  }
}
