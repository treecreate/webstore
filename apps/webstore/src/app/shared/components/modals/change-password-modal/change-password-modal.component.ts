import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ErrorlogPriorityEnum } from '@interfaces';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/authentication/auth.service';
import { ErrorlogsService } from '../../../services/errorlog/errorlog.service';
import { EventsService } from '../../../services/events/events.service';
import { UserService } from '../../../services/user/user.service';
import { ToastService } from '../../toast/toast-service';

@Component({
  selector: 'webstore-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: [
    './change-password-modal.component.css',
    '../../../../../assets/styles/modals.css',
    '../../../../../assets/styles/tc-input-field.scss',
  ],
})
export class ChangePasswordModalComponent implements OnInit {
  changePasswordForm: UntypedFormGroup;
  isLoading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserService,
    private toastService: ToastService,
    private authService: AuthService,
    public eventsService: EventsService,
    private errorlogsService: ErrorlogsService
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = new UntypedFormGroup({
      password: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z0-9$§!"#€%&/()=?`´^*\'@~±≠¶™∞£§“¡]{8,}$'),
      ]),
      confirmPassword: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z0-9$§!"#€%&/()=?`´^*\'@~±≠¶™∞£§“¡]{8,}$'),
      ]),
    });
  }

  isEnabled() {
    return this.changePasswordForm.valid && this.passwordsMatch();
  }

  passwordsMatch() {
    return this.changePasswordForm.get('password').value === this.changePasswordForm.get('confirmPassword').value;
  }

  isLengthValid(): string {
    if (this.changePasswordForm.get('password').value.length >= 8) {
      return 'validText';
    } else {
      return 'invalidText';
    }
  }

  hasUppercase(): string {
    if (this.changePasswordForm.get('password').value.match('[A-Z]')) {
      return 'validText';
    } else {
      return 'invalidText';
    }
  }

  hasLowercase(): string {
    if (this.changePasswordForm.get('password').value.match('[a-z]')) {
      return 'validText';
    } else {
      return 'invalidText';
    }
  }

  hasNumber(): string {
    if (this.changePasswordForm.get('password').value.match('[0-9]')) {
      return 'validText';
    } else {
      return 'invalidText';
    }
  }

  changePassword() {
    this.isLoading = true;
    this.userService
      .updateUser({
        password: this.changePasswordForm.get('password').value,
      })
      .subscribe({
        next: () => {
          this.toastService.showAlert('Your password has been updated!', 'Din kode er ændret!', 'success', 2500);
          this.authService.logout();
          this.activeModal.close();
          this.isLoading = false;
          window.scrollTo(0, 0);
          this.eventsService.create('webstore.change-password-modal.password-updated');
        },
        error: (err) => {
          console.error('Failed to update user', err);
          this.errorlogsService.create(
            'webstore.change-password-modal.update-password-failed',
            ErrorlogPriorityEnum.medium,
            err
          );
          this.toastService.showAlert(
            'Something went wrong, please try again.',
            'Noget gik galt, prøv igen',
            'danger',
            2500
          );
          this.activeModal.close();
          this.isLoading = false;
        },
      });
  }
}
