import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUser } from '@interfaces';
import { UserRoles } from '@models';
import { UserService } from '../../services/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../../components/change-password-dialog/change-password-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/authentication/auth.service';

@Component({
  selector: 'webstore-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent {
  public user!: IUser;
  public authUser;
  public accountForm: FormGroup;
  public isLoading = false;
  public isUpdatingInfo = false;
  public panelOpenState = false;

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
          console.log(user);
          this.updateForm();
          this.isLoading = false;
        },
        (err: HttpErrorResponse) => {
          console.log(err.message);
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
          console.log(err.message);
          this.snackBar.open('Fetching the user data failed', 'Oh no!', { duration: 5000 });
          this.isLoading = false;
        }
      );
    }

    this.accountForm = new FormGroup({
      name: new FormControl('', [Validators.maxLength(50), Validators.pattern('^[^0-9]+$')]),
      phoneNumber: new FormControl('', [
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.pattern('^[0-9+ ]*$'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      streetAddress: new FormControl('', [Validators.maxLength(50), Validators.minLength(3)]),
      streetAddress2: new FormControl('', [Validators.maxLength(50), Validators.minLength(3)]),
      city: new FormControl('', [Validators.maxLength(50), Validators.minLength(3), Validators.pattern('^[^0-9]+$')]),
      postcode: new FormControl('', [
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
  //TODO: Check if these work. 

  /**
   * Checks if user is a user only a user.
   * @returns whether the user contains the role user but not admin or developer.
   */
  isOnlyUser(): boolean {
    const developer = this.user.roles.filter((role) => role === UserRoles.developer || role === UserRoles.admin);
    return developer.length > 0;
  }

  /**
   * Checks if user is a user.
   * @returns whether the user contains the role user.
   */
  isUser(): boolean {
    return this.user.roles.some((role) => role === UserRoles.user);
  }

  /**
   * Checks if user is a developer.
   * @returns whether the user is a developer.
   */
  isDeveloper(): boolean {
    return this.user.roles.some((role) => role === UserRoles.developer);
  }

  /**
   * Checks if a user is an admin.
   * @returns whether the user is admin.
   */
  isAdmin(): boolean {
    return this.user.roles.some((role) => role === UserRoles.admin);
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
            console.log(data);
            this.snackBar.open('Your account has been updated!', `I'm the best`, { duration: 5000 });
            this.user = data;
            this.isUpdatingInfo = false;
          },
          (err: HttpErrorResponse) => {
            console.log(err.message);
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
        .subscribe(
          (data: IUser) => {
            console.log(data);
            this.snackBar.open('User ' + this.user?.email + ' has been updated!', `I'm the best`, { duration: 5000 });
            this.user = data;
            this.isUpdatingInfo = false;
          },
          (err: HttpErrorResponse) => {
            console.log(err.message);
            this.snackBar.open('Updating the user ' + this.user?.email + ' has failed', 'Oh no!', { duration: 5000 });
            this.isUpdatingInfo = false;
          }
        );
    }
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
