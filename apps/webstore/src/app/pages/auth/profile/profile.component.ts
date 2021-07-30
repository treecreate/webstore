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
  isVerified = false;

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
      streetAddress: new FormControl(''),
      streetAddress2: new FormControl(''),
      city: new FormControl(''),
      postcode: new FormControl(''),
    });

    setTimeout(() => {
      this.updateFormValues();
      console.log('Form values updated');
    }, 500);
  }

  updateFormValues() {
    this.accountInfoForm.setValue({
      name: this.currentUser.name,
      phoneNumber: this.currentUser.phoneNumber,
      email: this.currentUser.email,
      streetAddress: this.currentUser.streetAddress,
      streetAddress2: this.currentUser.streetAddress2,
      city: this.currentUser.city,
      postcode: this.currentUser.postcode,
    });
    console.log(this.accountInfoForm.get('email'));
  }
}

// this.accountInfoForm = new FormGroup({
//   name: new FormControl(this.currentUser.name === undefined ? 'this.currentUser.name' : ''),
//   phoneNumber: new FormControl(this.currentUser.phoneNumber === undefined ? this.currentUser.phoneNumber : ''),
//   email: new FormControl(this.currentUser.email === undefined ? this.currentUser.email : ''),
//   streetAddress: new FormControl(this.currentUser.streetAddress === undefined ? this.currentUser.streetAddress : ''),
//   streetAddress2: new FormControl(this.currentUser.streetAddress2 === undefined ? this.currentUser.streetAddress2 : ''),
//   city: new FormControl(this.currentUser.city === undefined ? this.currentUser.city : ''),
//   postcode: new FormControl(this.currentUser.postcode === undefined ? this.currentUser.postcode : ''),
// });
