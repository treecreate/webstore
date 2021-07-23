import { Component, OnInit } from '@angular/core';
import { IUser } from '@interfaces';
import { UserService } from '../../shared/services/user/user.service';

@Component({
  selector: 'webstore-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  currentUser: IUser;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUser();
  }
}
