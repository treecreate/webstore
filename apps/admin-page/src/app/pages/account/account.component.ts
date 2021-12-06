import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from '@interfaces';
import { UserRoles } from '@models';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'webstore-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  public user?: IUser;
  public accountForm: FormGroup;

  constructor(private userService: UserService) {
    this.userService.getUser().subscribe(
      (user: IUser) => {
        this.user = user;
      },
      (err: Error) => {
        console.log(err.message);
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

  ngOnInit(): void {
    // TODO: Update form with user values
  }
}
