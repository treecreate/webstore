import { Component, OnInit } from '@angular/core';
import { IUser } from '@interfaces';
import { UserService } from '../../../shared/services/user/user.service';

@Component({
  selector: 'webstore-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css'],
})
export class AccountInfoComponent implements OnInit {
  currentUser: IUser;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUser();
  }

  updateUser() {
    // take all info from from and create a new IUser object
    // local storage updated
    // api call to update dbw
  }
}
