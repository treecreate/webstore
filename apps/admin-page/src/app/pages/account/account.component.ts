import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { INewsletter, IUser } from '@interfaces';
import { UserRoles } from '@models';
import { catchError, of } from 'rxjs';
import { ChangePasswordDialogComponent } from '../../components/change-password-dialog/change-password-dialog.component';
import { AuthService } from '../../services/authentication/auth.service';
import { NewsletterService } from '../../services/newsletter/newsletter.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'webstore-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent {
  public user!: IUser;
  public authUser;
  public accountForm: UntypedFormGroup;
  public isLoading = false;
  public isUpdatingInfo = false;
  public panelOpenState = false;
  newsletter?: INewsletter = undefined;

  /**
   * Gets the current user.
   * Checks if the user is fetched by id or by is the current user.
   * Initiates the account form.
   *
   * @param userService
   * @param snackBar
   * @param dialog
   */
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private newsletterService: NewsletterService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isLoading = true;
    // get authUser
    this.authUser = this.authService.getAuthUser();
    // get user info
    const queryParams = this.route.snapshot.queryParams;
    // check if it is findUserById
    if (queryParams.userId !== undefined) {
      this.userService.getUser(queryParams.userId).subscribe(
        (user: IUser) => {
          this.user = user;
          this.fetchNewsletter();
          this.updateForm();
          this.isLoading = false;
        },
        (err: HttpErrorResponse) => {
          console.error(err.message);
          this.router.navigate(['/dashboad']);
          this.snackBar.open('Fetching the user data failed', 'Oh no!', { duration: 5000 });
          this.isLoading = false;
        }
      );
      // Get authentikated users information
    } else {
      this.userService.getCurrentUser().subscribe(
        (user: IUser) => {
          this.user = user;
          this.updateForm();
          this.isLoading = false;
        },
        (err: HttpErrorResponse) => {
          console.error(err.message);
          this.snackBar.open('Fetching the user data failed', 'Oh no!', { duration: 5000 });
          this.isLoading = false;
        }
      );
    }

    this.accountForm = new UntypedFormGroup({
      name: new UntypedFormControl('', [Validators.maxLength(50), Validators.pattern('^[^0-9]+$')]),
      phoneNumber: new UntypedFormControl('', [
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.pattern('^[0-9+ ]*$'),
      ]),
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      streetAddress: new UntypedFormControl('', [Validators.maxLength(50), Validators.minLength(3)]),
      streetAddress2: new UntypedFormControl('', [Validators.maxLength(50), Validators.minLength(3)]),
      city: new UntypedFormControl('', [
        Validators.maxLength(50),
        Validators.minLength(3),
        Validators.pattern('^[^0-9]+$'),
      ]),
      postcode: new UntypedFormControl('', [
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.pattern('^[0-9]*$'),
      ]),
    });
  }

  /**
   * @returns if an update of the account is possible
   */
  isDisabled(): boolean | undefined {
    return this.accountForm.invalid || this.formHasChanged() || this.isUpdatingInfo;
  }

  /**
   * Checks for changes in the form.
   *
   * @returns whether or not the inputfields in the form have changed.
   */
  formHasChanged(): boolean {
    return (
      this.accountForm.get('name')?.value === this.user?.name &&
      this.accountForm.get('phoneNumber')?.value === this.user?.phoneNumber &&
      this.accountForm.get('email')?.value === this.user?.email &&
      this.accountForm.get('streetAddress')?.value === this.user?.streetAddress &&
      this.accountForm.get('streetAddress2')?.value === this.user?.streetAddress2 &&
      this.accountForm.get('city')?.value === this.user?.city &&
      this.accountForm.get('postcode')?.value === this.user?.postcode
    );
  }

  /**
   * Checks if user is a user only a user.
   * @returns whether the user contains the role user but not admin or developer.
   */
  isOnlyCustomer(): boolean {
    return this.user.roles.some((role) => role.name === UserRoles.user) && !(this.isDeveloper() || this.isAdmin());
  }

  /**
   * Checks if user has USER role.
   * @returns whether the user contains the role user.
   */
  isUser(): boolean {
    return this.user.roles.some((role) => role.name === UserRoles.user);
  }

  /**
   * Checks if user has DEVELOPER role.
   * @returns whether the user is a developer.
   */
  isDeveloper(): boolean {
    return this.user.roles.some((role) => role.name === UserRoles.developer);
  }

  /**
   * Checks if a user has ADMIN role.
   * @returns whether the user is admin.
   */
  isAdmin(): boolean {
    return this.user.roles.some((role) => role.name === UserRoles.admin);
  }

  /**
   * Updates the form input fields on the page.
   */
  updateForm(): void {
    this.accountForm.setValue({
      name: this.user?.name,
      phoneNumber: this.user?.phoneNumber,
      email: this.user?.email,
      streetAddress: this.user?.streetAddress,
      streetAddress2: this.user?.streetAddress2,
      city: this.user?.city,
      postcode: this.user?.postcode,
    });
  }

  /**
   * Updates the account info by sending a request to the api.
   */
  updateAccount(): void {
    this.isUpdatingInfo = true;
    // Check if authenticated user is same as user being edited
    if (this.user?.email === this.authUser?.email) {
      // Update current users account
      this.userService
        .updateUser({
          name: this.accountForm.get('name')?.value,
          phoneNumber: this.accountForm.get('phoneNumber')?.value,
          email: this.accountForm.get('email')?.value,
          streetAddress: this.accountForm.get('streetAddress')?.value,
          streetAddress2: this.accountForm.get('streetAddress2')?.value,
          city: this.accountForm.get('city')?.value,
          postcode: this.accountForm.get('postcode')?.value,
        })
        .subscribe(
          (data: IUser) => {
            this.snackBar.open('Your account has been updated!', `I'm the best`, { duration: 5000 });
            this.user = data;
            this.isUpdatingInfo = false;
          },
          (err: HttpErrorResponse) => {
            console.error(err.message);
            this.snackBar.open('Updating the user data failed', 'Oh no!', { duration: 5000 });
            this.isUpdatingInfo = false;
          }
        );
      if (this.accountForm.get('email')?.value !== this.authUser?.email) {
        this.snackBar.open('You have been logged out due to email change', 'Wauw');
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    } else {
      // update a users account by id
      this.userService
        .updateUserById(
          {
            name: this.accountForm.get('name')?.value,
            phoneNumber: this.accountForm.get('phoneNumber')?.value,
            email: this.accountForm.get('email')?.value,
            streetAddress: this.accountForm.get('streetAddress')?.value,
            streetAddress2: this.accountForm.get('streetAddress2')?.value,
            city: this.accountForm.get('city')?.value,
            postcode: this.accountForm.get('postcode')?.value,
          },
          this.user.userId
        )
        .subscribe({
          next: (data: IUser) => {
            this.snackBar.open('User ' + this.user?.email + ' has been updated!', `I'm the best`, { duration: 5000 });
            this.user = data;
            this.isUpdatingInfo = false;
          },
          error: (err: HttpErrorResponse) => {
            console.error(err.message);
            this.snackBar.open('Updating the user ' + this.user?.email + ' has failed', 'Oh no!', { duration: 5000 });
            this.isUpdatingInfo = false;
          },
        });
    }
  }

  /**
   * Fetch the newsletter object for the given user. Only fetches if the user exists.\
   * Fetched newsletter is assigned to the component
   */
  async fetchNewsletter(): Promise<void> {
    if (this.user === null || this.user === undefined) {
      return;
    }
    this.newsletterService
      .getNewsletter(this.user.email)
      .pipe(catchError(() => of()))
      .subscribe({
        next: (response: INewsletter) => {
          this.newsletter = response;
        },
      });
  }

  /**
   * Remove, if present, the newsletter entry for the given user.
   */
  unsubscribe(): void {
    if (!this.newsletter) {
      console.warn(
        `An unsubscribe button was pressed even though the user is not subscriber. Something went wrong, the button shouldn't be visible!`
      );
      return;
    }
    this.isLoading = true;
    this.newsletterService.unsubscribe(this.newsletter?.newsletterId).subscribe({
      next: () => {
        this.snackBar.open('The user has been unsubscribed');
        this.newsletter = undefined;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Failed to unsubscribe the user', 'Why??');
        this.isLoading = false;
      },
    });
  }

  /**
   * Opens change password dialog.
   */
  openUpdatePasswordDialog(): void {
    this.dialog.open(ChangePasswordDialogComponent, {
      data: {
        userId: this.user?.userId,
      },
      width: '450px',
    });
  }
}
