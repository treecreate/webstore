import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ErrorlogPriorityEnum } from '@interfaces';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorlogsService } from '../../../services/errorlog/errorlog.service';
import { EventsService } from '../../../services/events/events.service';
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
  forgotPasswordForm: UntypedFormGroup;
  @ViewChild('messageSent') messageSent: ElementRef;
  title = 'ForgotPasswordModal';
  isLoading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private userService: UserService,
    public eventsService: EventsService,
    private errorlogsService: ErrorlogsService
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.email, Validators.required]),
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
        this.eventsService.create('webstore.forgot-password-modal.reset-password-email-sent');
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
