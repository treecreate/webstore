import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ErrorlogPriorityEnum } from '@interfaces';
import { ErrorlogsService } from '../../../shared/services/errorlog/errorlog.service';
import { EventsService } from '../../../shared/services/events/events.service';
import { UserService } from '../../../shared/services/user/user.service';

@Component({
  selector: 'webstore-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css', '../../../../assets/styles/tc-input-field.scss'],
})
export class ResetPasswordComponent implements OnInit {
  changePasswordForm: UntypedFormGroup;

  alertMessage = '';
  isUpdateSuccessful = false;
  isLoading = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private eventsService: EventsService,
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

  isDisabled(): boolean {
    return (
      this.changePasswordForm.get('password').invalid ||
      this.changePasswordForm.get('confirmPassword').invalid ||
      !this.matchingPasswords()
    );
  }

  matchingPasswords(): boolean {
    return this.changePasswordForm.get('password').value === this.changePasswordForm.get('confirmPassword').value;
  }

  onChangePassword() {
    this.isLoading = true;
    this.userService
      .updatePassword({
        token: this.route.snapshot.params.token,
        password: this.changePasswordForm.get('password').value,
      })
      .subscribe(
        () => {
          this.alertMessage = 'Your password has been reset!';
          this.isUpdateSuccessful = true;
          this.isLoading = false;
          this.eventsService.create('webstore.reset-password.password-reset');
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.errorlogsService.create(
            'webstore.reset-password.password-reset-failed',
            ErrorlogPriorityEnum.medium,
            error
          );
          if (error.error.status === 400) {
            this.alertMessage = 'The provided data is invalid';
          } else if (error.error.status === 404) {
            this.alertMessage = 'user account was not found';
          } else if (error.error.message === undefined) {
            this.alertMessage = 'Failed to connect to the backend service';
          } else {
            this.alertMessage = error.error.message;
          }
          this.isLoading = false;
          this.isUpdateSuccessful = false;
        }
      );
  }
}
