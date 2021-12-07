import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'webstore-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css'],
})
export class ChangePasswordDialogComponent implements OnInit {
  public changePasswordForm: FormGroup;
  public isLoading: boolean = false;

  constructor(
    private snackBar: MatSnackBar,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.changePasswordForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z0-9$§!"#€%&/()=?`´^*\'@~±≠¶™∞£§“¡]{8,}$'),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z0-9$§!"#€%&/()=?`´^*\'@~±≠¶™∞£§“¡]{8,}$'),
      ]),
    });
  }

  ngOnInit(): void {}

  changePassword() {
    this.isLoading = true;
    this.userService
      .updatePassword({
        userId: this.data.userId,
        password: this.changePasswordForm.get('password')?.value,
      })
      .subscribe(
        () => {
          this.snackBar.open('Password has been updated!', `I'm the best`, { duration: 5000 });
          this.isLoading = false;
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.snackBar.open('Failed to update!', `AAArh maaaan`, { duration: 5000 });
          this.isLoading = false;
        }
      );
  }

  isDisabled(): boolean {
    return !this.changePasswordForm.valid;
  }

  isEqual(): boolean {
    return this.changePasswordForm.get('password')?.value == this.changePasswordForm.get('confirmPassword')?.value;
  }
}
