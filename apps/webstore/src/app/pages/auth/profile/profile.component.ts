import { Component, OnInit } from '@angular/core';
import { IUser } from '@interfaces';
import { UserService } from '../../../shared/services/user/user.service';

@Component({
  selector: 'webstore-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  currentUser: IUser;

  constructor(private userService: UserService) {}

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
  }
}
