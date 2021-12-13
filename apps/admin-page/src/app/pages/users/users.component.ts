import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUser } from '@interfaces';
import { ClipboardService } from 'ngx-clipboard';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'webstore-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  userList!: IUser[];
  isLoading = false;
  displayedColumns: string[] = ['email', 'userId', 'orders', 'createdAt', 'actions'];
  showFullId = false; 

  /**
   * Retrieves a list of all users.
   *
   * @param userService
   * @param snackBar
   */
  constructor(private userService: UserService, private snackBar: MatSnackBar, private clipboardService: ClipboardService) {
    // Retrieve a list of users.
    this.isLoading = true;
    this.userService.getAllUsers().subscribe(
      (data: IUser[]) => {
        this.userList = data;
        this.isLoading = false;
      },
      (err: HttpErrorResponse) => {
        console.error(err);
        this.isLoading = false;
      }
    );
  }

  /**
   * Checks how many orders the user has.
   *
   * @param userId
   * @returns a number representing the amount this user has bought.
   */
  getUserOrderAmount(userId: string): number {
    return 1;
  }

  copyToClipboard(content: string): void {
    this.clipboardService.copyFromContent(content);
  }

  viewOrders(userId: string): void {
    //TODO: show dialog with orders list.
  }

  getDate(userId: string): void {
    //TODO: get date created
  }
}
