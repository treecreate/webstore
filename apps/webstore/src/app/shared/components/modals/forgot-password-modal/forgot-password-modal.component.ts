import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorlogPriorityEnum } from '@interfaces';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorlogsService } from '../../../services/errorlog/errorlog.service';
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
  isLoading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private toastService: ToastService,
    private userService: UserService,
    private errorlogsService: ErrorlogsService
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
    });
  }

  sendResetPasswordEmail() {
    this.isLoading = true;
    this.userService.sendResetUserPassword(this.forgotPasswordForm.get('email').value).subscribe(
      () => {
        this.activeModal.close();
        this.toastService.showAlert(
          'We have sent you an e-mail with a link to change your password.',
          'Vi har sendt dig en e-mail med et link til at ændre din kode.',
          'success',
          3500
        );
        this.isLoading = false;
      },
      (err) => {
        console.error(err.error.message);
        this.errorlogsService.create(
          'webstore.forgot-password-modal.send-reset-password-email-failed',
          ErrorlogPriorityEnum.medium,
          err
        );
        this.toastService.showAlert(
          'We have failed to send an e-mail. Try again or contact us at info@treecreate.dk.',
          'Der skete en fejl da vi skulle sende e-mailen. Prøv igen senere eller skriv til os på info@treecreate.dk',
          'danger',
          10000
        );
        this.isLoading = false;
      }
    );
  }

  isDisabled(): boolean {
    return this.forgotPasswordForm.get('email').invalid;
  }
}
