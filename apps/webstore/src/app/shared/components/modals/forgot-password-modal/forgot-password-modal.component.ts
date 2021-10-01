import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user/user.service';
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
    private toastService: ToastService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
    });
  }

  sendResetPasswordEmail() {
    this.userService
      .sendResetUserPassword(this.forgotPasswordForm.get('email').value)
      .subscribe(
        () => {
          this.activeModal.close();
          this.toastService.showAlert(
            'We have sent you an e-mail with a link to change your password.',
            'Vi har sendt dig en e-mail med et link til at ændre din kode.',
            'success',
            3500
          );
        },
        (err) => {
          this.toastService.showAlert(
            'We have failed to send an e-mail. Try again or contact us at info@treecreate.dk.',
            'Der skete en fejl da vi skulle sende e-mailen. Prøv igen senere eller skriv til os på info@treecreate.dk',
            'danger',
            10000
          );
        }
      );
  }

  isDisabled(): boolean {
    return this.forgotPasswordForm.get('email').invalid;
  }
}
