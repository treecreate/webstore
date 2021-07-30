import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IUser } from '@interfaces';
import { ToastService } from '../../../shared/components/toast/toast-service';
import { UserService } from '../../../shared/services/user/user.service';

@Component({
  selector: 'webstore-profile',
  templateUrl: './profile.component.html',
  styleUrls: [
    './profile.component.css',
    '../../../../assets/styles/tc-input-field.scss',
  ],
})
export class ProfileComponent implements OnInit {
  currentUser: IUser;
  accountInfoForm: FormGroup;

  constructor(
    private userService: UserService,
    private toastService: ToastService
  ) {}

  // TODO: implement proper profile stuff

  ngOnInit(): void {
    try {
      this.userService.getUser().subscribe((data) => {
        this.currentUser = data;
        console.log(this.currentUser); // NOTE: Temporary printout for development purposes
      });
    } catch (error) {
      console.error(error);
      // TODO: handle failed fetching of the data
    }

    this.accountInfoForm = new FormGroup({
      name: new FormControl(''),
      phoneNumber: new FormControl(''),
      email: new FormControl(''),
      streetOne: new FormControl(''),
      streetTwo: new FormControl(''),
      city: new FormControl(''),
      postcode: new FormControl(''),
    });
  }
}
