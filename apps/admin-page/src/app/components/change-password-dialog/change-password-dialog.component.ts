import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'webstore-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css'],
})
export class ChangePasswordDialogComponent {
  public changePasswordForm: UntypedFormGroup;
  public isLoading = false;

  /**
   * Initiates the change password form.
   *
   * @param snackBar
   * @param userService
   * @param data - sending the userId that will be used in the update method.
   * @param dialog
   */
  constructor(
    private snackBar: MatSnackBar,
    private userService: UserService,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
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

  /**
   * Updates the password by sending a request to the api.
   */
  changePassword(): void {
    this.isLoading = true;
    this.userService
      .updatePassword({
        userId: this.data.userId,
        password: this.changePasswordForm.get('password')?.value,
      })
      .subscribe(
        () => {
          this.snackBar.open('Password has been updated!', `I'm the best`, { duration: 5000 });
          this.dialog.closeAll();
          this.isLoading = false;
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.snackBar.open('Failed to update!', `AAArh maaaan`, { duration: 5000 });
          this.isLoading = false;
        }
      );
  }

  /**
   * Checks if the form is valid.
   *
   * @returns whether the form is valid
   */
  isDisabled(): boolean {
    return !this.changePasswordForm.valid;
  }

  /**
   * Checks if the password and confirm password match.
   *
   * @returns whether the password and confirm password match
   */
  isEqual(): boolean {
    return this.changePasswordForm.get('password')?.value === this.changePasswordForm.get('confirmPassword')?.value;
  }
}
