import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from '@interfaces';
import { UserRoles } from '@models';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'webstore-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent {
  public user?: IUser;
  public accountForm: FormGroup;
  public isLoading: boolean = false;

  constructor(private userService: UserService) {
    this.isLoading = true;
    this.userService.getUser().subscribe(
      (user: IUser) => {
        this.user = user;
        this.updateForm();
        this.isLoading = false;
      },
      (err: Error) => {
        console.log(err.message);
        this.isLoading = false;
      }
    );

    this.accountForm = new FormGroup({
      name: new FormControl('', [Validators.maxLength(50), Validators.pattern('^[^0-9]+$')]),
      phoneNumber: new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(11),
        Validators.pattern('^[0-9+]*$'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      streetAddress: new FormControl('', [Validators.maxLength(50), Validators.minLength(7)]),
      streetAddress2: new FormControl('', [Validators.maxLength(50), Validators.minLength(3)]),
      city: new FormControl('', [Validators.maxLength(50), Validators.minLength(3), Validators.pattern('^[^0-9]+$')]),
      postcode: new FormControl('', [Validators.max(9999), Validators.min(555), Validators.pattern('^[0-9]*$')]),
    });
  }

  isCustomer(): boolean | undefined {
    return !this.user?.roles.includes(UserRoles.developer) || !this.user?.roles.includes(UserRoles.admin);
  }

  isDeveloper() {
    return this.user?.roles.includes(UserRoles.developer);
  }

  isAdmin() {
    return this.user?.roles.includes(UserRoles.admin);
  }

  updateForm() {
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
}
